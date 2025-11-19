"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Package, User } from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-medium mb-4">Acesso Necessário</h2>
          <p className="text-muted-foreground mb-6">Você precisa estar conectado para acessar sua conta.</p>
          <Button asChild className="bg-stone-900 text-white hover:bg-stone-800 rounded-none">
            <Link href="/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-stone-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="bg-white border border-stone-200 p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-serif font-medium mb-2">Minha Conta</h1>
              <p className="text-muted-foreground">Bem-vindo de volta, {user.name}!</p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-stone-900 text-white hover:bg-stone-800 rounded-none flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5" />
              <h2 className="text-lg font-serif font-medium">Dados Pessoais</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID do Cliente</p>
                <p className="font-medium text-xs font-mono">{user.id}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Button asChild className="w-full bg-stone-900 text-white hover:bg-stone-800 rounded-none py-6 flex items-center gap-3 justify-center">
              <Link href="/account/orders">
                <Package className="h-5 w-5" />
                <span>Meus Pedidos</span>
              </Link>
            </Button>
            <Button asChild className="w-full bg-stone-900 text-white hover:bg-stone-800 rounded-none py-6 flex items-center gap-3 justify-center">
              <Link href="/">
                <span>Continuar Comprando</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Orders Summary */}
        <Card className="bg-white border border-stone-200 p-6">
          <h2 className="text-lg font-serif font-medium mb-4">Últimos Pedidos</h2>
          <p className="text-muted-foreground text-sm">Nenhum pedido realizado ainda. <Link href="/" className="font-medium hover:underline">Comece a comprar</Link></p>
        </Card>
      </div>
    </div>
  );
}
