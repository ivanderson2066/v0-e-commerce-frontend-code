"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, User, LogOut, Search } from 'lucide-react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useAuth } from "@/lib/auth-context";
import { SearchModal } from "@/components/search/search-modal";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="bg-emerald-700 text-white text-center py-2 px-4 text-xs md:text-sm font-bold uppercase tracking-wider">
        🎉 Ganhe 3% de desconto pagando com PIX em todas as compras!
      </div>

      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 hover:bg-emerald-50 rounded transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link href="/" className="flex-1 lg:flex-none text-center lg:text-center">
          <div className="text-lg md:text-xl font-black text-emerald-700 tracking-tighter uppercase">
            CAIÇARA
          </div>
          <p className="text-xs text-emerald-600 font-semibold tracking-widest">Beleza Natural</p>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="text-xs font-bold text-foreground hover:text-emerald-700 transition-colors uppercase tracking-widest"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <SearchModal />

          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/account" className="text-xs font-semibold text-foreground hover:text-emerald-700 transition-colors uppercase tracking-wide">
                  {user.name.split(' ')[0]}
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="text-xs font-bold px-2 py-1 bg-emerald-700 text-white hover:bg-emerald-800 rounded">
                    ADMIN
                  </Link>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className="hidden sm:flex text-xs font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider">
              <User className="h-5 w-5 mr-1" />
              Entrar
            </Link>
          )}
          <CartSheet />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white">
          <nav className="flex flex-col p-4 space-y-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-sm font-bold text-foreground uppercase tracking-wide py-2 hover:text-emerald-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-emerald-100 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wide py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    Minha Conta
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 p-2 uppercase tracking-wide"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-bold text-red-600 w-full py-2 uppercase tracking-wide"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm font-bold text-emerald-700 uppercase tracking-wide py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Entrar
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
