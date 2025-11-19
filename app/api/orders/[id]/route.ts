import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAuth, checkAdmin, errorResponse, successResponse } from '@/lib/api-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await checkAuth();

    if (authError || !user) {
      return errorResponse(authError || 'Não autenticado', 401);
    }

    const { id } = await params;

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();

    if (error) {
      return errorResponse(error.message, 404);
    }

    const role = user.app_metadata?.role || user.user_metadata?.role;
    const isAdmin = role === 'admin';

    if (!isAdmin && data.user_id !== user.id) {
      return errorResponse('Acesso negado', 403);
    }

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(
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

    const allowedUpdates = ['status', 'payment_id', 'notes'];
    const updates: any = {};

    for (const key of allowedUpdates) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse('Nenhum campo válido para atualizar', 400);
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select('*, order_items(*)')
      .single();

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
