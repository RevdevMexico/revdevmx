-- Función para obtener estadísticas de usuarios
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
  total_users INTEGER,
  total_clients INTEGER,
  total_admins INTEGER,
  new_users_last_7_days INTEGER,
  confirmed_emails INTEGER,
  active_users_last_30_days INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RAISE NOTICE 'get_user_stats - Starting function execution';
  
  -- Verificar que el usuario actual es admin
  IF NOT (
    auth.jwt() ->> 'email' = 'contacto@revdev.mx' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  ) THEN
    RAISE EXCEPTION 'Solo administradores pueden acceder a esta información';
  END IF;

  RAISE NOTICE 'get_user_stats - Admin verification passed';

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM auth.users) as total_users,
    (SELECT COUNT(*)::INTEGER FROM auth.users 
     WHERE COALESCE(raw_user_meta_data ->> 'role', 'cliente') = 'cliente') as total_clients,
    (SELECT COUNT(*)::INTEGER FROM auth.users 
     WHERE (raw_user_meta_data ->> 'role') = 'admin' OR email = 'contacto@revdev.mx') as total_admins,
    (SELECT COUNT(*)::INTEGER FROM auth.users 
     WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_last_7_days,
    (SELECT COUNT(*)::INTEGER FROM auth.users 
     WHERE email_confirmed_at IS NOT NULL) as confirmed_emails,
    (SELECT COUNT(*)::INTEGER FROM auth.users 
     WHERE last_sign_in_at >= NOW() - INTERVAL '30 days') as active_users_last_30_days;

  RAISE NOTICE 'get_user_stats - Function completed successfully';
END;
$$;

-- Función para obtener información de todos los usuarios
CREATE OR REPLACE FUNCTION get_all_users_info()
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  role TEXT,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RAISE NOTICE 'get_all_users_info - Starting function execution';
  
  -- Verificar que el usuario actual es admin
  IF NOT (
    auth.jwt() ->> 'email' = 'contacto@revdev.mx' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  ) THEN
    RAISE EXCEPTION 'Solo administradores pueden acceder a esta información';
  END IF;

  RAISE NOTICE 'get_all_users_info - Admin verification passed';

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data ->> 'name', u.raw_user_meta_data ->> 'full_name') as name,
    COALESCE(u.raw_user_meta_data ->> 'role', 'cliente') as role,
    u.email_confirmed_at,
    u.created_at,
    u.last_sign_in_at
  FROM auth.users u
  ORDER BY u.created_at DESC;

  RAISE NOTICE 'get_all_users_info - Function completed successfully, returned % users', 
    (SELECT COUNT(*) FROM auth.users);
END;
$$;

-- Función para actualizar el rol de un usuario
CREATE OR REPLACE FUNCTION update_user_role(target_user_id UUID, new_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_email TEXT;
BEGIN
  RAISE NOTICE 'update_user_role - Starting for user % with role %', target_user_id, new_role;
  
  -- Verificar que el usuario actual es admin
  IF NOT (
    auth.jwt() ->> 'email' = 'contacto@revdev.mx' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  ) THEN
    RAISE EXCEPTION 'Solo administradores pueden cambiar roles';
  END IF;

  -- Obtener el email del usuario objetivo
  SELECT email INTO target_email FROM auth.users WHERE id = target_user_id;
  
  IF target_email IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  -- Proteger al admin principal
  IF target_email = 'contacto@revdev.mx' THEN
    RAISE EXCEPTION 'No se puede cambiar el rol del administrador principal';
  END IF;

  -- Validar el nuevo rol
  IF new_role NOT IN ('admin', 'cliente') THEN
    RAISE EXCEPTION 'Rol inválido. Debe ser admin o cliente';
  END IF;

  -- Actualizar el rol en los metadatos del usuario
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', new_role)
  WHERE id = target_user_id;

  RAISE NOTICE 'update_user_role - Role updated successfully for user %', target_email;
  
  RETURN TRUE;
END;
$$;

-- Otorgar permisos necesarios
GRANT EXECUTE ON FUNCTION get_user_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_users_info() TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_role(UUID, TEXT) TO authenticated;

-- Crear política RLS para permitir que los admins accedan a los datos de usuarios
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Política para permitir que los admins lean información de usuarios
CREATE POLICY "Admins can read user data" ON auth.users
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'contacto@revdev.mx' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Política para permitir que los admins actualicen metadatos de usuarios
CREATE POLICY "Admins can update user metadata" ON auth.users
FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'contacto@revdev.mx' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  auth.jwt() ->> 'email' = 'contacto@revdev.mx' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
