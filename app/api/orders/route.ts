import { NextRequest } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { createOrderSchema } from '@/lib/validations';
import { checkAuth, checkAdmin, errorResponse, successResponse, validateStock, generateOrderNumber } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await checkAuth();

    if (authError || !user) {
      return errorResponse(authError || 'Não autenticado', 401);
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const role = user.app_metadata?.role || user.user_metadata?.role;
    const isAdmin = role === 'admin';

    let query = supabase
      .from('orders')
      .select('*, order_items(*)');

    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    if (status) {
      query = query.eq('status', status);
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
    const { user, error: authError } = await checkAuth();

    if (authError || !user) {
      return errorResponse(authError || 'Não autenticado', 401);
    }

    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    const productIds = validated.items.map(item => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError || !products) {
      return errorResponse('Erro ao buscar produtos', 500);
    }

    for (const item of validated.items) {
      const product = products.find(p => p.id === item.product_id);

      if (!product) {
        return errorResponse(`Produto ${item.product_id} não encontrado`, 404);
      }

      const stockCheck = await validateStock(item.product_id, item.quantity);
      if (!stockCheck.valid) {
        return errorResponse(
          stockCheck.error || `Estoque insuficiente para ${product.name}`,
          400
        );
      }
    }

    let subtotal = 0;
    const orderItems = validated.items.map(item => {
      const product = products.find(p => p.id === item.product_id)!;
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      return {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      };
    });

    const total = subtotal + validated.shipping_price;
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          order_number: orderNumber,
          subtotal,
          shipping_price: validated.shipping_price,
          total,
          status: 'pending',
          payment_method: validated.payment_method,
          shipping_address: validated.shipping_address,
          notes: validated.notes,
        },
      ])
      .select()
      .single();

    if (orderError) {
      return errorResponse(orderError.message, 500);
    }

    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      await supabase.from('orders').delete().eq('id', order.id);
      return errorResponse('Erro ao criar itens do pedido', 500);
    }

    for (const item of validated.items) {
      const product = products.find(p => p.id === item.product_id)!;
      await supabaseAdmin
        .from('products')
        .update({ stock: product.stock - item.quantity })
        .eq('id', item.product_id);
    }

    const { data: fullOrder } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', order.id)
      .single();

    return successResponse(fullOrder, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message, 400);
    }
    return errorResponse(error.message, 500);
  }
}
