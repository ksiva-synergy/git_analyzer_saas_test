-- Fix the api_keys table structure
-- Run this in your Supabase SQL editor

-- First, let's see what we currently have
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'api_keys';

-- If the table doesn't exist, create it
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT,
  description TEXT,
  usage INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT '',
  usageLimit INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- If the table exists but is missing columns, add them
DO $$ 
BEGIN
  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'is_active') THEN
    ALTER TABLE api_keys ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
  
  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'created_at') THEN
    ALTER TABLE api_keys ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'updated_at') THEN
    ALTER TABLE api_keys ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  -- Add label column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'label') THEN
    ALTER TABLE api_keys ADD COLUMN label TEXT;
  END IF;
  
  -- Add usage column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'usage') THEN
    ALTER TABLE api_keys ADD COLUMN usage INTEGER DEFAULT 0;
  END IF;
  
  -- Add createdAt column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'createdAt') THEN
    ALTER TABLE api_keys ADD COLUMN createdAt TEXT DEFAULT '';
  END IF;
  
  -- Add usageLimit column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'usageLimit') THEN
    ALTER TABLE api_keys ADD COLUMN usageLimit INTEGER;
  END IF;
  
  -- Add description column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'description') THEN
    ALTER TABLE api_keys ADD COLUMN description TEXT;
  END IF;
  
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'user_id') THEN
    ALTER TABLE api_keys ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your security needs)
DROP POLICY IF EXISTS "Allow read access to active API keys" ON api_keys;
CREATE POLICY "Allow read access to active API keys" ON api_keys
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow insert access to API keys" ON api_keys;
CREATE POLICY "Allow insert access to API keys" ON api_keys
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update access to API keys" ON api_keys;
CREATE POLICY "Allow update access to API keys" ON api_keys
  FOR UPDATE USING (true);

-- Create a policy for deleting API keys
DROP POLICY IF EXISTS "Allow delete access to API keys" ON api_keys;
CREATE POLICY "Allow delete access to API keys" ON api_keys
  FOR DELETE USING (true);

-- Insert some sample API keys for testing
INSERT INTO api_keys (key, label, description, usage, createdAt, is_active) VALUES
  ('sk_test_1234567890abcdef', 'Test Key 1', 'Development testing key', 0, '2024-01-01', true),
  ('sk_test_0987654321fedcba', 'Test Key 2', 'Staging testing key', 0, '2024-01-01', true),
  ('sk_inactive_key_example', 'Inactive Key', 'Inactive key for testing', 0, '2024-01-01', false)
ON CONFLICT (key) DO NOTHING;

-- Verify the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'api_keys'
ORDER BY ordinal_position;

-- Show sample data
SELECT id, key, label, description, usage, is_active, created_at FROM api_keys LIMIT 5;
