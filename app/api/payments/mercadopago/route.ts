import { NextRequest } from 'next/server';
import { errorResponse, successResponse, checkAuth } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await checkAuth();

    if (authError || !user) {
      return errorResponse(authError || 'Não autenticado', 401);
    }

    const body = await request.json();
    const { orderId, items, shippingAddress } = body;

    if (!orderId || !items || !Array.isArray(items)) {
      return errorResponse('orderId e items são obrigatórios', 400);
    }

    return successResponse({
      preferenceId: `mock_mp_preference_${orderId}`,
      initPoint: `https://www.mercadopago.com/checkout/v1/redirect?pref_id=mock_${orderId}`,
      publicKey: process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY,
      orderId,
      message: 'Integração Mercado Pago: substitua com lógica real usando createPaymentPreference() de lib/mercado-pago-config.ts',
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
