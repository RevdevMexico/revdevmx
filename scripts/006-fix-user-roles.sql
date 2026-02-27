-- Primero, vamos a corregir la función del trigger para ser más estricta
CREATE OR REPLACE FUNCTION assign_client_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo estos emails específicos serán admin
  IF NEW.email = 'contacto@revdev.mx' THEN
    NEW.raw_user_meta_data = COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb;
  ELSE
    -- TODOS los demás usuarios serán clientes
    NEW.raw_user_meta_data = COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || '{"role": "cliente"}'::jsonb;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Recrear el trigger
DROP TRIGGER IF EXISTS assign_user_role_trigger ON auth.users;
CREATE TRIGGER assign_user_role_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_client_role();

-- Corregir TODOS los usuarios existentes
-- Primero, hacer que todos sean clientes
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "cliente"}'::jsonb;

-- Luego, hacer admin solo al email específico
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'contacto@revdev.mx';

-- Verificar los cambios
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
ORDER BY created_at DESC;
