import { NextResponse } from 'next/server';
import { supabase } from './supabase';

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export async function checkAuth() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, error: 'Não autenticado' };
  }

  return { user, error: null };
}

export async function checkAdmin() {
  const { user, error } = await checkAuth();

  if (error || !user) {
    return { isAdmin: false, user: null, error: error || 'Não autenticado' };
  }

  const role = user.app_metadata?.role || user.user_metadata?.role;
  const isAdmin = role === 'admin';

  if (!isAdmin) {
    return { isAdmin: false, user, error: 'Acesso negado: apenas administradores' };
  }

  return { isAdmin: true, user, error: null };
}

export async function validateStock(productId: string, quantity: number): Promise<{ valid: boolean; available: number; error?: string }> {
  const { data: product, error } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .single();

  if (error || !product) {
    return { valid: false, available: 0, error: 'Produto não encontrado' };
  }

  if (product.stock < quantity) {
    return {
      valid: false,
      available: product.stock,
      error: `Estoque insuficiente. Disponível: ${product.stock}`
    };
  }

  return { valid: true, available: product.stock };
}

export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
