import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'OrderId é obrigatório' },
        { status: 400 }
      );
    }

    // Simular busca de status (substituir por banco de dados real)
    const orderStatus = {
      orderId,
      status: 'approved',
      paymentMethod: 'creditCard',
      totalAmount: 0,
      lastUpdate: new Date().toISOString(),
    };

    return NextResponse.json(orderStatus);
  } catch (error) {
    console.error("[v0] Erro ao buscar status:", error);
    return NextResponse.json(
      { error: 'Erro ao buscar status do pedido' },
      { status: 500 }
    );
  }
}
