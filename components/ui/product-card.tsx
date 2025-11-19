"use client";

import Image from "next/image";
import { Product } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const originalPrice = product.price * 1.3;
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer group">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onClick={handleViewDetails}
        />

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Adicionar aos favoritos"
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute bottom-3 right-3 z-10 bg-amber-400 text-gray-900 px-2 py-1 rounded font-bold text-sm">
            -{discountPercent}%
          </div>
        )}

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-gray-700 text-white px-4 py-2 font-bold">ESGOTADO</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2 px-2 pb-2">
        <button 
          onClick={handleViewDetails}
          className="text-left hover:opacity-80 transition-opacity"
        >
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </button>

        {/* Price Section */}
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-400 line-through">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalPrice)}
          </p>
          <div>
            <p className="text-sm font-bold text-gray-900">
              por: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </p>
            {product.price > 50 && (
              <p className="text-xs text-gray-500">
                ou em 3x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 3)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="mx-2 mb-2 py-3 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <ShoppingBag className="h-5 w-5" />
        Comprar
      </button>
    </div>
  );
}
