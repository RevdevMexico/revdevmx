-- Enable Row Level Security on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view all projects (public read access)
CREATE POLICY "Allow public read access to projects" ON projects 
FOR SELECT 
USING (true);

-- Policy to allow admin users to insert projects
CREATE POLICY "Allow admin users to insert projects" ON projects 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'contacto@revdev.mx'
  )
);

-- Policy to allow admin users to update projects
CREATE POLICY "Allow admin users to update projects" ON projects 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'contacto@revdev.mx'
  )
);

-- Policy to allow admin users to delete projects
CREATE POLICY "Allow admin users to delete projects" ON projects 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'contacto@revdev.mx'
  )
);
