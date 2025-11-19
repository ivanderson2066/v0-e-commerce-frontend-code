import { NextRequest, NextResponse } from 'next/server';
import { getMerchantOrder } from '@/lib/mercado-pago-config';

// Simular armazenamento de pedidos (substituir por banco de dados real)
const ordersDatabase: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[v0] Webhook recebido:", body);

    const { type, data } = body;

    // Processar diferentes tipos de notificação
    if (type === 'payment') {
      const paymentId = data.id;
      console.log(`[v0] Pagamento recebido: ${paymentId}`);
      
      // Aqui você buscaria o pagamento para atualizar o status
      // E salvaria no banco de dados
    } else if (type === 'merchant_order') {
      const merchantOrderId = data.id;
      console.log(`[v0] Merchant Order recebida: ${merchantOrderId}`);

      try {
        const merchantOrder = await getMerchantOrder(merchantOrderId);
        console.log("[v0] Detalhes da merchant order:", merchantOrder);

        // Atualizar status do pedido baseado no status do pagamento
        const externalReference = merchantOrder.external_reference;
        if (externalReference) {
          ordersDatabase[externalReference] = {
            status: merchantOrder.status,
            payments: merchantOrder.payments,
            order_id: merchantOrderId,
            updated_at: new Date().toISOString(),
          };

          console.log(`[v0] Pedido ${externalReference} atualizado para status: ${merchantOrder.status}`);
        }
      } catch (error) {
        console.error("[v0] Erro ao processar merchant order:", error);
      }
    }

    // Retornar sucesso imediatamente ao Mercado Pago
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[v0] Erro ao processar webhook:", error);
    // Retornar 200 para não fazer retry
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

export async function GET(request: NextRequest) {
  // Endpoint para testar webhook
  return NextResponse.json({ message: 'Webhook endpoint ativo' });
}
