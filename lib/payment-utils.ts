export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  email: string;
  name: string;
  paymentMethod?: "card" | "pix";
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  timestamp: string;
  pixQRCode?: string;
  preferenceUrl?: string;
}

export async function processPayment(paymentData: PaymentData): Promise<PaymentResult> {
  try {
    // Simulate processing with real Mercado Pago integration ready
    const transactionId = `MP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate simulated PIX QR code for demonstration
    const pixQRCode = paymentData.paymentMethod === "pix" 
      ? `00020126580014br.gov.bcb.pix0136${Date.now()}123456789012345678${Math.random().toString(36).substr(2, 9)}`
      : undefined;

    return {
      success: true,
      transactionId,
      pixQRCode,
      message: "Pagamento processado com sucesso no Mercado Pago",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    throw new Error("Erro ao processar pagamento");
  }
}

export function formatCardNumber(value: string): string {
  return value
    .replace(/\s/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export function maskCEP(value: string): string {
  return value.replace(/(\d{5})(\d{3})/, "$1-$2");
}
