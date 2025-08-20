# API Playground Setup Guide

## Overview
The API Playground allows users to test and validate API keys against the Supabase database. When a user submits an API key, it's validated against the `api_keys` table in Supabase.

## Database Setup

### 1. Create the API Keys Table
Run this SQL in your Supabase SQL editor:

```sql
-- Create the api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy for reading API keys (adjust based on your security needs)
CREATE POLICY "Allow read access to active API keys" ON api_keys
  FOR SELECT USING (is_active = true);

-- Create a policy for inserting API keys (adjust based on your security needs)
CREATE POLICY "Allow insert access to API keys" ON api_keys
  FOR INSERT WITH CHECK (true);

-- Create a policy for updating API keys (adjust based on your security needs)
CREATE POLICY "Allow update access to API keys" ON api_keys
  FOR UPDATE USING (true);

-- Create a policy for deleting API keys (adjust based on your security needs)
CREATE POLICY "Allow delete access to API keys" ON api_keys
  FOR DELETE USING (true);
```

### 2. Insert Sample API Keys
Insert some test API keys:

```sql
-- Insert sample API keys for testing
INSERT INTO api_keys (key, name, description, is_active) VALUES
  ('sk_test_1234567890abcdef', 'Test Key 1', 'Development testing key', true),
  ('sk_test_0987654321fedcba', 'Test Key 2', 'Staging testing key', true),
  ('sk_inactive_key_example', 'Inactive Key', 'Inactive key for testing', false);
```

## Features

### API Playground Page (`/playground`)
- Clean, modern interface with navy blue theme
- Form to input and validate API keys
- Real-time validation feedback
- Responsive design

### API Validation Endpoint (`/api/protected`)
- POST endpoint that validates API keys
- Checks against Supabase `api_keys` table
- Returns validation status and details
- Proper error handling

### Notification System
- Success notifications (green background)
- Error notifications (red background)
- Animated slide-in/out effects
- Auto-dismiss after 3 seconds
- Manual close option

## Usage

1. Navigate to the dashboard
2. Click on "API Playground" in the sidebar
3. Enter an API key in the form
4. Click "Validate API Key"
5. View the validation result via notification

## Security Notes

- API keys are validated against the database
- Only active API keys are considered valid
- The endpoint uses proper error handling
- Consider implementing rate limiting for production use
- Ensure proper authentication/authorization for the API endpoint

## Customization

### Colors
The playground uses the Synergize theme colors:
- `synergyNavy`: Primary navy blue color
- `synergyBlue`: Secondary blue color
- `synergyLight`: Light background color

### Styling
All components use Tailwind CSS classes and can be easily customized by modifying the className attributes.

## Troubleshooting

### Common Issues
1. **API key not found**: Ensure the key exists in the `api_keys` table
2. **Database connection error**: Check Supabase configuration in `lib/supabaseClient.js`
3. **CORS issues**: Ensure the API route is properly configured

### Environment Variables
Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
