-- Fix the delete policy for api_keys table
-- Run this in your Supabase SQL editor

-- First, let's check the current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'api_keys';

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow read access to active API keys" ON api_keys;
DROP POLICY IF EXISTS "Allow insert access to API keys" ON api_keys;
DROP POLICY IF EXISTS "Allow update access to API keys" ON api_keys;
DROP POLICY IF EXISTS "Allow delete access to API keys" ON api_keys;

-- Create comprehensive policies for all operations
-- SELECT policy - allow reading all API keys
CREATE POLICY "Allow read access to API keys" ON api_keys
  FOR SELECT USING (true);

-- INSERT policy - allow inserting new API keys
CREATE POLICY "Allow insert access to API keys" ON api_keys
  FOR INSERT WITH CHECK (true);

-- UPDATE policy - allow updating existing API keys
CREATE POLICY "Allow update access to API keys" ON api_keys
  FOR UPDATE USING (true);

-- DELETE policy - allow deleting API keys
CREATE POLICY "Allow delete access to API keys" ON api_keys
  FOR DELETE USING (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'api_keys';

-- Test the delete functionality with a sample key
-- First, let's see what keys exist
SELECT id, key, label, description FROM api_keys LIMIT 5;

-- If you want to test delete, you can run this (replace 'test-id' with an actual ID):
-- DELETE FROM api_keys WHERE id = 'test-id' RETURNING *;
