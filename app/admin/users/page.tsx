"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

export default function AdminUsersPage() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-medium mb-4">Acesso Negado</h2>
          <Button asChild className="bg-stone-900 text-white hover:bg-stone-800 rounded-none">
            <Link href="/admin">Voltar</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <Link href="/admin" className="flex items-center gap-2 text-sm font-medium mb-8 hover:text-stone-300">
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>

        <div className="bg-stone-800 border border-stone-700 p-8">
          <h1 className="text-3xl font-serif font-medium mb-2">Usuários</h1>
          <p className="text-stone-400 mb-8">Nenhum usuário registrado ainda.</p>
        </div>
      </div>
    </div>
  );
}
