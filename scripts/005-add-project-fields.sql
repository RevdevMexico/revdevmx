-- Agregar nuevos campos a la tabla projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS project_url TEXT,
ADD COLUMN IF NOT EXISTS technologies JSONB DEFAULT '[]'::jsonb;

-- Crear índice para búsquedas en tecnologías
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON projects USING GIN (technologies);

-- Comentarios para documentar los campos
COMMENT ON COLUMN projects.project_url IS 'URL del proyecto en vivo o repositorio';
COMMENT ON COLUMN projects.technologies IS 'Array de tecnologías utilizadas en el proyecto';

-- Ejemplo de datos de tecnologías (opcional, para testing)
-- UPDATE projects SET technologies = '["React", "Next.js", "TypeScript", "Tailwind CSS", "Supabase"]'::jsonb WHERE id = 'algún-id';
