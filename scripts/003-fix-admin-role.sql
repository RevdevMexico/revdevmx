-- Verificar usuarios existentes y sus roles
SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'role' as current_role,
  created_at
FROM auth.users 
ORDER BY created_at DESC;

-- Actualizar TODOS los usuarios con email que contenga 'revdev' o 'contacto' para que sean admin
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email ILIKE '%revdev%' 
   OR email ILIKE '%contacto%'
   OR email = 'contacto@revdev.mx';

-- Verificar que se aplicó el cambio
SELECT 
  email,
  raw_user_meta_data->>'role' as role_after_update
FROM auth.users 
WHERE email ILIKE '%revdev%' 
   OR email ILIKE '%contacto%'
   OR email = 'contacto@revdev.mx';
