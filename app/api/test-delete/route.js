import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'API key ID is required' },
        { status: 400 }
      );
    }

    console.log('Testing delete for API key ID:', id);

    // First, check if the key exists
    const { data: existingKey, error: selectError } = await supabase
      .from('api_keys')
      .select('id, label')
      .eq('id', id)
      .single();

    if (selectError) {
      console.error('Select error:', selectError);
      return NextResponse.json(
        { success: false, error: `Key not found: ${selectError.message}` },
        { status: 404 }
      );
    }

    console.log('Found key to delete:', existingKey);

    // Attempt to delete the key
    const { data: deletedKey, error: deleteError } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .select();

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { success: false, error: `Delete failed: ${deleteError.message}` },
        { status: 500 }
      );
    }

    console.log('Successfully deleted key:', deletedKey);

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully',
      deletedKey
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: `Unexpected error: ${error.message}` },
      { status: 500 }
    );
  }
}
