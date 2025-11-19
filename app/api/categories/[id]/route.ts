import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { categorySchema } from '@/lib/validations';
import { checkAdmin, errorResponse, successResponse } from '@/lib/api-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return errorResponse(error.message, 404);
    }

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAdmin, error: authError } = await checkAdmin();

    if (authError) {
      return errorResponse(authError, 403);
    }

    const { id } = await params;
    const body = await request.json();
    const validated = categorySchema.partial().parse(body);

    const { data, error } = await supabase
      .from('categories')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse(data);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message, 400);
    }
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAdmin, error: authError } = await checkAdmin();

    if (authError) {
      return errorResponse(authError, 403);
    }

    const { id } = await params;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse({ message: 'Categoria deletada com sucesso' });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
