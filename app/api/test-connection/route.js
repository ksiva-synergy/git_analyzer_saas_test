import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    // Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!hasUrl || !hasKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing environment variables',
        hasUrl,
        hasKey,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      });
    }

    // Test basic connection and check table structure
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        code: error.code
      });
    }

    // Check table structure
    const hasRequiredColumns = data.length > 0 && 
      'id' in data[0] && 
      'key' in data[0];
    
    const hasIsActiveColumn = data.length > 0 && 'is_active' in data[0];
    const hasCreatedAtColumn = data.length > 0 && 'created_at' in data[0];

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        code: error.code
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      hasTable: true,
      tableStructure: {
        hasRequiredColumns,
        hasIsActiveColumn,
        hasCreatedAtColumn,
        columns: data.length > 0 ? Object.keys(data[0]) : []
      },
      data: data
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error.message
    });
  }
}
