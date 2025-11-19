import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { categorySchema } from '@/lib/validations';
import { checkAdmin, errorResponse, successResponse } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isAdmin, error: authError } = await checkAdmin();

    if (authError) {
      return errorResponse(authError, 403);
    }

    const body = await request.json();
    const validated = categorySchema.parse(body);

    const { data, error } = await supabase
      .from('categories')
      .insert([validated])
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse(data, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message, 400);
    }
    return errorResponse(error.message, 500);
  }
}
