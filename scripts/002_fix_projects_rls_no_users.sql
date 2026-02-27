-- Fix RLS policies to avoid users table access
-- Drop existing policies that might reference users table
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
DROP POLICY IF EXISTS "projects_update_policy" ON projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON projects;

-- Create simple RLS policies that don't access users table
-- Allow public read access to projects
CREATE POLICY "projects_select_policy" ON projects
    FOR SELECT USING (true);

-- Allow insert/update/delete only for authenticated users
-- We'll handle admin checks in the application layer
CREATE POLICY "projects_insert_policy" ON projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "projects_update_policy" ON projects
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "projects_delete_policy" ON projects
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
