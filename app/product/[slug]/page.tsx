import { notFound } from 'next/navigation';
import Image from "next/image";
import { products, categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  // In a real app, slug would likely be an ID or unique slug. 
  // Here we use ID for simplicity in data.ts but route is [slug]. 
  // Let's assume the route passes the ID for this demo or we find by ID.
  // To make it work with the links generated, we'll treat the param as ID.
  const product = products.find((p) => p.id === slug);

  if (!product) {
    notFound();
  }

  const category = categories.find((c) => c.slug === product.category);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${category?.slug}`}>
                {category?.name || "Categoria"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-secondary overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images.slice(1).map((img, idx) => (
              <div key={idx} className="relative aspect-square bg-secondary overflow-hidden">
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${product.name} view ${idx + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-serif font-medium">{product.name}</h1>
            <p className="text-2xl font-medium">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </p>
          </div>

          <div className="prose prose-stone text-muted-foreground">
            <p>{product.description}</p>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {product.stock > 0 ? `${product.stock} unidades em estoque` : "Esgotado"}
            </div>
            
            <div className="flex gap-4">
              <AddToCartButton 
                product={product} 
                size="lg" 
                className="flex-1 rounded-none h-12 text-base" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
            <div className="flex items-start gap-3 p-4 bg-stone-50">
              <Truck className="h-6 w-6 text-stone-600 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Frete Grátis</h4>
                <p className="text-xs text-muted-foreground">Para compras acima de R$ 500,00</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-stone-50">
              <ShieldCheck className="h-6 w-6 text-stone-600 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Garantia de 1 Ano</h4>
                <p className="text-xs text-muted-foreground">Contra defeitos de fabricação</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
