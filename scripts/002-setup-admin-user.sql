-- Actualizar el usuario contacto@revdev.mx para que sea administrador
-- NOTA: Este script debe ejecutarse después de que el usuario se haya registrado

UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'contacto@revdev.mx';

-- Función para asignar rol de cliente a nuevos usuarios automáticamente
CREATE OR REPLACE FUNCTION assign_client_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Si es contacto@revdev.mx o contiene 'revdev', asignar rol de admin
  IF NEW.email = 'contacto@revdev.mx' OR NEW.email ILIKE '%revdev%' OR NEW.email ILIKE '%contacto%' THEN
    NEW.raw_user_meta_data = COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb;
  ELSE
    -- Para todos los demás usuarios, asignar rol de cliente
    NEW.raw_user_meta_data = COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || '{"role": "cliente"}'::jsonb;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para asignar roles automáticamente
DROP TRIGGER IF EXISTS assign_user_role_trigger ON auth.users;
CREATE TRIGGER assign_user_role_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_client_role();

-- Actualizar usuarios existentes que no tengan rol asignado para que sean clientes
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "cliente"}'::jsonb
WHERE raw_user_meta_data->>'role' IS NULL 
  AND email != 'contacto@revdev.mx' 
  AND email NOT ILIKE '%revdev%' 
  AND email NOT ILIKE '%contacto%';
