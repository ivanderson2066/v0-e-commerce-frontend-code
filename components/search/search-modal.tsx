"use client";

import { useState, useEffect } from "react";
import { Search, X } from 'lucide-react';
import Link from "next/link";
import { products } from "@/lib/data";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(products);
  const router = useRouter();

  useEffect(() => {
    if (query.trim()) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(products);
    }
  }, [query]);

  const handleProductClick = (productId: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/product/${productId}`);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)} />
      )}

      {isOpen && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Busque por produto, categoria ou marca..."
                className="flex-1 bg-transparent outline-none text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {results.length > 0 ? (
              results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(product.price)}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p className="text-sm">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-emerald-50 rounded transition-colors"
        title="Buscar"
      >
        <Search className="h-5 w-5 text-foreground" />
      </button>
    </>
  );
}
