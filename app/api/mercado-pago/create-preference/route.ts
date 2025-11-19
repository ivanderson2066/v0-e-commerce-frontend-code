import { NextRequest, NextResponse } from 'next/server';
import { createPaymentPreference } from '@/lib/mercado-pago-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shippingPrice,
      customerEmail,
      customerName,
      orderId,
      shippingAddress,
    } = body;

    if (!items || !customerEmail || !customerName || !orderId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const preference = await createPaymentPreference(
      items,
      shippingPrice,
      customerEmail,
      customerName,
      orderId,
      shippingAddress
    );

    return NextResponse.json(preference);
  } catch (error) {
    console.error("[v0] Erro em create-preference:", error);
    return NextResponse.json(
      { error: 'Erro ao criar preferência de pagamento' },
      { status: 500 }
    );
  }
}
