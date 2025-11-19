"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-stone-50">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="text-3xl font-serif font-medium mb-2">Compra Confirmada!</h1>
        <p className="text-muted-foreground mb-4">
          Obrigado por sua compra. Um e-mail de confirmação foi enviado.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Você pode acompanhar seu pedido na página de pedidos.
        </p>

        <div className="space-y-3">
          <Button asChild className="w-full bg-stone-900 text-white hover:bg-stone-800 rounded-none">
            <Link href="/account/orders">Ver Pedidos</Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-none border-black hover:bg-stone-100">
            <Link href="/">Continuar Comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
