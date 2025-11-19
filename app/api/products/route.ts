import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { productSchema } from '@/lib/validations';
import { checkAdmin, errorResponse, successResponse } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let query = supabase.from('products').select('*, categories(name, slug)');

    if (category) {
      query = query.eq('category_id', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

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
    const validated = productSchema.parse(body);

    const { data, error } = await supabase
      .from('products')
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
