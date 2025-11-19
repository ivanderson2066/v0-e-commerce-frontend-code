"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import { BarChart3, Package, LogOut } from 'lucide-react';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-medium mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">Você precisa ser um administrador para acessar esta área.</p>
          <Button asChild className="bg-stone-900 text-white hover:bg-stone-800 rounded-none">
            <Link href="/">Voltar ao Site</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-medium mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">Você não tem permissão para acessar esta área.</p>
          <Button asChild className="bg-stone-900 text-white hover:bg-stone-800 rounded-none">
            <Link href="/account">Ir para Minha Conta</Link>
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
    <div className="min-h-screen bg-stone-50">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-serif font-medium">Painel Administrativo</h1>
          <Button
            onClick={handleLogout}
            className="bg-stone-700 text-white hover:bg-stone-600 rounded-none flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-stone-600" />
              <h3 className="text-sm font-medium text-muted-foreground">Total de Produtos</h3>
            </div>
            <p className="text-3xl font-serif font-medium">{products.length}</p>
          </div>

          <div className="bg-white border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-stone-600" />
              <h3 className="text-sm font-medium text-muted-foreground">Produtos em Estoque</h3>
            </div>
            <p className="text-3xl font-serif font-medium">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
          </div>

          <div className="bg-white border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-stone-600" />
              <h3 className="text-sm font-medium text-muted-foreground">Valor Total</h3>
            </div>
            <p className="text-3xl font-serif font-medium">R$ {products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-stone-200">
          <div className="p-6 border-b border-stone-200 flex justify-between items-center">
            <h2 className="text-lg font-serif font-medium">Produtos</h2>
            <Link href="/admin/products/new">
              <Button className="bg-stone-900 text-white hover:bg-stone-800 rounded-none text-sm">
                Novo Produto
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Produto</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Preço</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Estoque</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Categoria</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-stone-200 hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm">{product.name}</td>
                    <td className="px-6 py-4 text-sm">R$ {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded ${product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.category}</td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:underline">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Link href="/admin/orders" className="bg-white border border-stone-200 p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-serif font-medium mb-2">Gerenciar Pedidos</h3>
            <p className="text-sm text-muted-foreground">Ver e processar todos os pedidos</p>
          </Link>
          <Link href="/admin/users" className="bg-white border border-stone-200 p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-serif font-medium mb-2">Gerenciar Usuários</h3>
            <p className="text-sm text-muted-foreground">Visualizar clientes registrados</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
