-- Función para verificar si el usuario actual es administrador
CREATE OR REPLACE FUNCTION is_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar si el usuario está autenticado
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Obtener el email del usuario actual
  DECLARE
    user_email TEXT;
    user_role TEXT;
  BEGIN
    SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
    SELECT raw_user_meta_data->>'role' INTO user_role FROM auth.users WHERE id = auth.uid();
    
    -- Verificar múltiples condiciones para ser admin
    RETURN (
      user_role = 'admin' OR
      user_email = 'contacto@revdev.mx' OR
      user_email ILIKE '%revdev%' OR
      user_email ILIKE '%contacto%'
    );
  EXCEPTION
    WHEN OTHERS THEN
      RETURN FALSE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener información del usuario actual (segura)
CREATE OR REPLACE FUNCTION get_current_user_info()
RETURNS JSON AS $$
DECLARE
  user_info JSON;
BEGIN
  -- Verificar si el usuario está autenticado
  IF auth.uid() IS NULL THEN
    RETURN '{"authenticated": false}'::JSON;
  END IF;
  
  -- Obtener información del usuario
  SELECT json_build_object(
    'authenticated', true,
    'id', id,
    'email', email,
    'role', raw_user_meta_data->>'role',
    'name', raw_user_meta_data->>'name',
    'is_admin', (
      raw_user_meta_data->>'role' = 'admin' OR
      email = 'contacto@revdev.mx' OR
      email ILIKE '%revdev%' OR
      email ILIKE '%contacto%'
    ),
    'created_at', created_at
  ) INTO user_info
  FROM auth.users 
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_info, '{"authenticated": false}'::JSON);
EXCEPTION
  WHEN OTHERS THEN
    RETURN '{"authenticated": false, "error": true}'::JSON;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar las políticas de la tabla projects para usar la nueva función
DROP POLICY IF EXISTS "Admin can manage projects" ON projects;

CREATE POLICY "Admin can manage projects" ON projects
  FOR ALL USING (is_user_admin());

-- Política más específica para INSERT
CREATE POLICY "Admin can insert projects" ON projects
  FOR INSERT WITH CHECK (is_user_admin());

-- Política más específica para UPDATE
CREATE POLICY "Admin can update projects" ON projects
  FOR UPDATE USING (is_user_admin());

-- Política más específica para DELETE
CREATE POLICY "Admin can delete projects" ON projects
  FOR DELETE USING (is_user_admin());
