"use client";

import { notFound } from 'next/navigation';
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/ui/product-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronDown, Sliders } from 'lucide-react';
import { useState } from 'react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPageWrapper({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.category === slug);

  return <CategoryPageClient category={category} products={categoryProducts} />;
}

function CategoryPageClient({ category, products: categoryProducts }: any) {
  const [sortBy, setSortBy] = useState('popular');

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
          <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
            {category.description}
          </p>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          {/* Sort Dropdown */}
          <div className="relative">
            <button className="px-6 py-3 border-2 border-gray-900 rounded-full font-bold text-gray-900 flex items-center gap-2 hover:bg-gray-50 transition-colors">
              Mais Vendidos
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Filter Button */}
          <button className="px-6 py-3 border-2 border-gray-900 rounded-full font-bold text-gray-900 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Sliders className="h-4 w-4" />
            Filtrar
          </button>
        </div>

        {/* Product Count */}
        <p className="text-gray-600 font-medium mb-6">
          {sortedProducts.length} produtos
        </p>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-12">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed">
            <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
