"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useShipping } from "@/lib/shipping-context";
import { processPayment, formatCardNumber, maskCEP } from "@/lib/payment-utils";
import { ChevronLeft, AlertCircle, CheckCircle, Copy } from 'lucide-react';

type CheckoutStep = "shipping" | "payment" | "confirmation";
type PaymentMethod = "card" | "pix";

interface OrderData {
  orderId: string;
  items: any[];
  shippingAddress: any;
  shippingOption: any;
  paymentMethod: string;
  total: number;
  transactionId: string;
  pixQRCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total: cartTotal, clearCart } = useCart();
  const { selectedShipping, shippingOptions, calculateShipping, selectShipping } = useShipping();
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [error, setError] = useState<string>("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
  });

  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (items.length === 0 && step === "shipping") {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-green-50">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-medium text-green-900 mb-4">Carrinho Vazio</h2>
          <p className="text-gray-600 mb-6">Adicione produtos antes de fazer checkout.</p>
          <Button asChild className="bg-green-700 text-white hover:bg-green-800 rounded-none">
            <Link href="/">Continuar Comprando</Link>
          </Button>
        </div>
      </div>
    );
  }

  const shippingPrice = selectedShipping?.price || 0;
  const finalTotal = cartTotal + shippingPrice;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === "cep") {
      formattedValue = maskCEP(value.replace(/\D/g, ""));
    }
    
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleCalculateShipping = () => {
    if (formData.cep.length < 9) {
      setError("CEP inválido");
      return;
    }
    setError("");
    calculateShipping(formData.cep, cartTotal);
    setShowShippingOptions(true);
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = formatCardNumber(value.replace(/\D/g, "").slice(0, 16));
    } else if (name === "expiryDate") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
    } else if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipping) {
      setError("Selecione uma opção de frete");
      return;
    }
    setError("");
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      const paymentResult = await processPayment({
        amount: finalTotal,
        currency: "BRL",
        description: `Pedido Caiçara - ${items.length} produto(s)`,
        email: formData.email,
        name: formData.fullName,
        paymentMethod: paymentMethod,
      });

      if (paymentResult.success) {
        const order: OrderData = {
          orderId: `PED-${Date.now()}`,
          items: items,
          shippingAddress: formData,
          shippingOption: selectedShipping,
          paymentMethod: paymentMethod === "card" ? "Cartão de Crédito" : "PIX",
          total: finalTotal,
          transactionId: paymentResult.transactionId,
          pixQRCode: paymentMethod === "pix" ? paymentResult.pixQRCode : undefined,
        };

        setOrderData(order);
        clearCart();
        setStep("confirmation");
      }
    } catch (err) {
      setError("Erro ao processar pagamento. Tente novamente.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPix = () => {
    if (orderData?.transactionId) {
      navigator.clipboard.writeText(orderData.transactionId);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    }
  };

  // Confirmation Step
  if (step === "confirmation" && orderData) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-green-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white border border-green-200 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-medium text-green-900 mb-2">Compra Confirmada!</h1>
            <p className="text-gray-600 mb-6">Obrigado por sua compra. Aqui está o resumo:</p>

            <div className="bg-green-50 p-6 rounded-lg mb-8 text-left">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Número do Pedido</p>
                <p className="text-lg font-medium text-green-900">{orderData.orderId}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Método de Pagamento</p>
                <p className="text-lg font-medium text-green-900">{orderData.paymentMethod}</p>
              </div>

              {orderData.paymentMethod === "PIX" && (
                <div className="mb-6 p-4 bg-white border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-3">Escaneie para pagar com PIX</p>
                  <div className="bg-white p-4 mb-3 rounded-lg flex justify-center">
                    <div className="w-48 h-48 bg-green-100 flex items-center justify-center text-sm text-gray-500">
                      QR Code PIX
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Ou copie a chave PIX:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={orderData.transactionId}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-green-200 bg-green-50 rounded-lg"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="px-3 py-2 bg-green-700 text-white text-sm hover:bg-green-800 rounded-lg flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      {pixCopied ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-600">ID da Transação</p>
                <p className="text-sm font-mono text-green-700 break-all">{orderData.transactionId}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Frete Selecionado</p>
                <p className="text-lg font-medium text-green-900">{orderData.shippingOption.name} - {orderData.shippingOption.estimatedDate}</p>
              </div>
              <div className="border-t border-green-200 pt-4">
                <p className="text-sm text-gray-600">Total da Compra</p>
                <p className="text-2xl font-serif font-medium text-green-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.total)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-green-700 text-white hover:bg-green-800 rounded-none py-2 h-12">
                <Link href="/account/orders">Ver Meus Pedidos</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-none py-2 h-12 border-green-200 text-green-700 hover:bg-green-50">
                <Link href="/">Continuar Comprando</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-green-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-green-200 p-8">
              {/* Step Indicator */}
              <div className="flex gap-4 mb-12">
                <button
                  onClick={() => setStep("shipping")}
                  className={`flex-1 pb-3 border-b-2 transition-colors ${
                    step === "shipping" ? "border-green-700 text-green-900 font-medium" : "border-gray-200 text-gray-600"
                  }`}
                >
                  Entrega
                </button>
                <button
                  onClick={() => step !== "shipping" && setStep("payment")}
                  disabled={step === "shipping"}
                  className={`flex-1 pb-3 border-b-2 transition-colors ${
                    step === "payment" ? "border-green-700 text-green-900 font-medium" : "border-gray-200 text-gray-600 disabled:cursor-not-allowed"
                  }`}
                >
                  Pagamento
                </button>
              </div>

              {step === "shipping" && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <h3 className="text-lg font-serif font-medium text-green-900 mb-4">Dados de Entrega</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-green-900 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-green-900 mb-2">E-mail</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-green-900 mb-2">Telefone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-2">CEP *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="cep"
                          value={formData.cep}
                          onChange={handleShippingChange}
                          placeholder="00000-000"
                          required
                          className="flex-1 px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleCalculateShipping}
                          className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-900 text-sm font-medium transition-colors"
                        >
                          Calcular
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-2">Cidade</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-green-900 mb-2">Rua</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-2">Número</label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-2">Complemento</label>
                      <input
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleShippingChange}
                        placeholder="Apto, sala..."
                        className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-2">Estado</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                      />
                    </div>
                  </div>

                  {showShippingOptions && shippingOptions.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-green-200">
                      <h4 className="font-medium text-green-900 mb-4">Opções de Frete</h4>
                      <div className="space-y-3">
                        {shippingOptions.map((option) => (
                          <label key={option.id} className="flex items-start gap-3 p-4 border border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShipping?.id === option.id}
                              onChange={() => selectShipping(option)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-green-900">{option.name}</p>
                              <p className="text-sm text-gray-600">Entrega em {option.daysToDeliver} dia(s) - {option.estimatedDate}</p>
                              <p className="text-sm font-medium text-green-700 mt-1">
                                {option.price === 0 ? "Grátis" : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price)}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={!showShippingOptions || !selectedShipping}
                    className="w-full bg-green-700 text-white hover:bg-green-800 rounded-none py-2 disabled:bg-gray-400"
                  >
                    Continuar para Pagamento
                  </Button>
                </form>
              )}

              {step === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <h3 className="text-lg font-serif font-medium text-green-900 mb-4">Método de Pagamento</h3>

                  <div className="space-y-3 mb-8">
                    <label className="flex items-center gap-3 p-4 border-2 border-green-300 rounded-lg cursor-pointer hover:bg-green-50 transition-colors" style={{ borderColor: paymentMethod === "card" ? "#166534" : "#c6f6d5" }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      />
                      <div>
                        <p className="font-medium text-green-900">Cartão de Crédito</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, Elo</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-green-300 rounded-lg cursor-pointer hover:bg-green-50 transition-colors" style={{ borderColor: paymentMethod === "pix" ? "#166534" : "#c6f6d5" }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pix"
                        checked={paymentMethod === "pix"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      />
                      <div>
                        <p className="font-medium text-green-900">PIX</p>
                        <p className="text-sm text-gray-600">Transferência instantânea</p>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-green-900 mb-2">Nome no Cartão</label>
                        <input
                          type="text"
                          name="cardName"
                          value={cardData.cardName}
                          onChange={handleCardChange}
                          required
                          className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-900 mb-2">Número do Cartão</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardChange}
                          placeholder="0000 0000 0000 0000"
                          maxLength="19"
                          required
                          className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-2">Válido até</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardData.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/AA"
                            maxLength="5"
                            required
                            className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-green-900 mb-2">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            placeholder="000"
                            maxLength="3"
                            required
                            className="w-full px-4 py-2 border border-green-300 focus:outline-none focus:border-green-700 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "pix" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Após confirmar seu pedido, você receberá um código PIX para realizar o pagamento. O código terá validade de 30 minutos.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-green-700 text-white hover:bg-green-800 rounded-none py-2 disabled:bg-gray-400"
                  >
                    {isProcessing ? "Processando Pagamento..." : "Finalizar Compra"}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-green-200 p-6 sticky top-20">
              <h3 className="text-lg font-serif font-medium text-green-900 mb-4">Resumo do Pedido</h3>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span className="text-green-900 font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-green-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-green-900 font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Frete</span>
                  <span className="text-green-900 font-medium">
                    {selectedShipping?.price === 0
                      ? "Grátis"
                      : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between font-serif font-medium text-lg pt-4 border-t border-green-200 text-green-900">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
