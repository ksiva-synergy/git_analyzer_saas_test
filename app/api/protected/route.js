import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured');
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Database not configured',
          details: 'Please check your environment variables and ensure Supabase is properly configured.',
          status: 'configuration_error'
        },
        { status: 500 }
      );
    }

    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'API key is required',
          details: 'Please provide an API key in the request body.',
          status: 'missing_api_key'
        },
        { status: 400 }
      );
    }

    // Validate API key format
    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid API key format',
          details: 'API key must be a non-empty string.',
          status: 'invalid_format'
        },
        { status: 400 }
      );
    }

    // Check if API key follows expected pattern (optional but helpful)
    if (!apiKey.startsWith('syn-') && !apiKey.startsWith('sk_')) {
      console.log('API key format warning - unexpected prefix:', apiKey.substring(0, 10) + '...');
    }

    console.log('Attempting to validate API key:', apiKey.substring(0, 10) + '...');

    // Try to validate the API key directly first
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, key, created_at, label, description, usage, is_active')
        .eq('key', apiKey)
        .single();

      if (error) {
        // Handle specific database errors
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Database setup required',
              details: 'The API keys table has not been created yet. Please run the database setup script first.',
              setup_instructions: 'Run the SQL script in your Supabase SQL editor to create the required tables.',
              status: 'table_not_found'
            },
            { status: 500 }
          );
        }
        
        if (error.code === '42501') {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Database permissions issue',
              details: 'The application does not have permission to access the database. Please check your Supabase configuration.',
              status: 'permission_denied'
            },
            { status: 500 }
          );
        }
        
        if (error.code === 'PGRST200') {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'API key not found',
              details: 'The provided API key does not exist in our system.',
              suggestions: [
                'Check if the API key is correct',
                'Ensure the API key hasn\'t been deleted',
                'Verify you\'re using the right environment (development/staging/production)'
              ],
              status: 'key_not_found'
            },
            { status: 401 }
          );
        }
        
        // For other database errors, return a generic error
        console.error('Database query error:', error);
        return NextResponse.json(
          { 
            valid: false, 
            error: 'Database query error',
            details: `Unable to validate API key: ${error.message}`,
            status: 'query_error'
          },
          { status: 500 }
        );
      }

      // Check if the key is active
      if (data && data.is_active === false) {
        return NextResponse.json(
          { 
            valid: false, 
            error: 'API key is inactive',
            details: 'This API key exists but has been deactivated.',
            suggestions: [
              'Contact your administrator to reactivate the key',
              'Generate a new API key if needed'
            ],
            status: 'key_inactive'
          },
          { status: 401 }
        );
      }

      if (data) {
        console.log('API key validated successfully:', data.id);
        
        // If we get here, the API key is valid
        return NextResponse.json({
          valid: true,
          message: 'API key is valid',
          keyId: data.id,
          createdAt: data.created_at,
          label: data.label,
          description: data.description,
          usage: data.usage,
          status: 'valid'
        });
      }

      // If no data returned, the key doesn't exist
      return NextResponse.json(
        { 
          valid: false, 
          error: 'API key not found',
          details: 'The provided API key does not exist in our system.',
          suggestions: [
            'Check if the API key is correct',
            'Ensure the API key hasn\'t been deleted',
            'Verify you\'re using the right environment (development/staging/production)'
          ],
          status: 'key_not_found'
        },
        { status: 401 }
      );

    } catch (dbError) {
      // If we get a database connection error, check if it's a table structure issue
      console.error('Database connection error:', dbError);
      
      // Try a simple table check to see if it's a structure issue
      try {
        const { error: tableError } = await supabase
          .from('api_keys')
          .select('*')
          .limit(1);
        
        if (tableError && tableError.code === 'PGRST116') {
          return NextResponse.json(
            { 
              valid: false, 
              error: 'Database setup required',
              details: 'The API keys table has not been created yet. Please run the database setup script first.',
              setup_instructions: 'Run the SQL script in your Supabase SQL editor to create the required tables.',
              status: 'table_not_found'
            },
            { status: 500 }
          );
        }
      } catch (tableCheckError) {
        console.error('Table check error:', tableCheckError);
      }
      
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Database connection error',
          details: 'Unable to connect to the database. Please try again later.',
          status: 'connection_error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API key validation error:', error);
    
    // Handle specific error types
    if (error.name === 'SyntaxError') {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid request format',
          details: 'The request body contains invalid JSON.',
          suggestions: [
            'Check your request body format',
            'Ensure the JSON is properly formatted'
          ],
          status: 'invalid_json'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Internal server error',
        details: 'An unexpected error occurred while processing your request.',
        status: 'internal_error'
      },
      { status: 500 }
    );
  }
}
