// Mercado Pago Configuration
// Replace with your actual credentials from Mercado Pago dashboard

import crypto from 'crypto';

export const mercadoPagoConfig = {
  // Public key para cliente (expor é seguro)
  publicKey: process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY,
  
  // Access token para servidor (nunca expor no cliente)
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  
  // Webhook endpoint para receber notificações de pagamento
  webhookUrl: process.env.MERCADO_PAGO_WEBHOOK_URL,
  
  // Configuração de notificações
  notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/webhook`,
};

// Helper para criar preferência de pagamento
export async function createPaymentPreference(
  items: any[],
  shippingPrice: number,
  customerEmail: string,
  customerName: string,
  orderId: string,
  shippingAddress: any
) {
  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mercadoPagoConfig.accessToken}`,
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          id: item.id,
          title: item.name,
          description: item.description || "Produto Caiçara",
          picture_url: item.image || "/placeholder.svg",
          category_id: item.category || "cosmeticos",
          quantity: item.quantity,
          currency_id: "BRL",
          unit_price: Number(item.price),
        })),
        shipments: {
          receiver_address: {
            zip_code: shippingAddress?.cep?.replace(/\D/g, '') || "00000000",
            street_name: shippingAddress?.street || "",
            street_number: shippingAddress?.number || "",
            city_name: shippingAddress?.city || "",
            state_name: shippingAddress?.state || "",
          },
        },
        payer: {
          name: customerName,
          email: customerEmail,
          phone: {
            number: shippingAddress?.phone?.replace(/\D/g, '') || "",
          },
          address: {
            zip_code: shippingAddress?.cep?.replace(/\D/g, '') || "00000000",
            street_name: shippingAddress?.street || "",
            street_number: shippingAddress?.number || "",
          },
        },
        payment_methods: {
          excluded_payment_types: [
            {
              id: "atm",
            },
          ],
          installments: 12,
          default_installments: 1,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderId}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?order=${orderId}`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending?order=${orderId}`,
        },
        auto_return: "approved",
        external_reference: orderId,
        notification_url: mercadoPagoConfig.notificationUrl,
        statement_descriptor: "CAICARA COSMETICOS",
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutos
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[v0] Erro ao criar preferência:", error);
      throw new Error(`Erro ao criar preferência: ${error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[v0] Erro ao criar preferência:", error);
    throw error;
  }
}

// Helper para obter status de pagamento
export async function getPaymentStatus(paymentId: string) {
  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${mercadoPagoConfig.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao obter status de pagamento");
    }

    return await response.json();
  } catch (error) {
    console.error("[v0] Erro ao obter status:", error);
    throw error;
  }
}

// Helper para obter ordem de compra
export async function getMerchantOrder(merchantOrderId: string) {
  try {
    const response = await fetch(
      `https://api.mercadopago.com/merchant_orders/${merchantOrderId}`,
      {
        headers: {
          Authorization: `Bearer ${mercadoPagoConfig.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao obter ordem de compra");
    }

    return await response.json();
  } catch (error) {
    console.error("[v0] Erro ao obter merchant order:", error);
    throw error;
  }
}

// Helper para validar webhook
export function verifyWebhookSignature(
  body: string,
  signature: string,
  webhookSecret: string
): boolean {
  try {
    const hash = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error("[v0] Erro ao verificar assinatura:", error);
    return false;
  }
}
