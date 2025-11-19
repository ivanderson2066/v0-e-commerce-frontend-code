import { NextRequest } from 'next/server';
import { errorResponse, successResponse, checkAuth } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await checkAuth();

    if (authError || !user) {
      return errorResponse(authError || 'Não autenticado', 401);
    }

    const body = await request.json();
    const { orderId, amount, currency = 'brl' } = body;

    if (!orderId || !amount) {
      return errorResponse('orderId e amount são obrigatórios', 400);
    }

    return successResponse({
      clientSecret: `mock_stripe_client_secret_${orderId}`,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      orderId,
      amount,
      currency,
      message: 'Integração Stripe: substitua com lógica real',
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
