"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ChevronLeft } from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-medium mb-4">Acesso Necessário</h2>
          <Button asChild className="bg-stone-900 text-white hover:bg-stone-800 rounded-none">
            <Link href="/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-stone-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium hover:text-muted-foreground mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="bg-white border border-stone-200 p-8">
          <h1 className="text-3xl font-serif font-medium mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground mb-8">Acompanhe todos os seus pedidos aqui.</p>

          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum pedido encontrado</p>
            <p className="text-muted-foreground mb-6">Você ainda não realizou nenhuma compra.</p>
            <Button asChild className="bg-stone-900 text-white hover:bg-stone-800 rounded-none">
              <Link href="/">Explorar Produtos</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
