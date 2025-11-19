"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/ui/product-card";
import { ArrowRight, Leaf, Truck, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

const heroContent = [
  {
    title: "Esquenta Black Friday",
    subtitle: "A melhor temporada de ofertas de beleza do ano",
    cta: "Aproveite",
    offer: "PRODUTOS COM ATÉ 60% OFF",
    background: "bg-gradient-to-r from-red-600 to-red-700"
  },
  {
    title: "Coleção Sustentável",
    subtitle: "Beleza natural que cuida do planeta",
    cta: "Explorar",
    offer: "100% NATURAL E ECO-FRIENDLY",
    background: "bg-gradient-to-r from-emerald-600 to-emerald-700"
  },
  {
    title: "Promoção PIX",
    subtitle: "Ganhe 3% de desconto em todas as compras",
    cta: "Comprar Agora",
    offer: "VÁLIDO POR TEMPO LIMITADO",
    background: "bg-gradient-to-r from-blue-600 to-blue-700"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products.filter((p) => p.featured);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroContent.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroContent.length) % heroContent.length);

  return (
    <div className="flex flex-col gap-0 pb-16">
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[16/9] md:aspect-auto md:h-96 w-full">
          {heroContent.map((banner, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? "opacity-100" : "opacity-0"
              } ${banner.background}`}
            >
              <div className="relative w-full h-full grid md:grid-cols-2 gap-0">
                <div className="flex flex-col justify-center p-6 md:p-12 space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-sm md:text-base font-semibold">
                    {banner.subtitle}
                  </p>
                  <div className="bg-black text-white px-6 py-3 w-fit font-black uppercase text-sm md:text-base tracking-widest">
                    {banner.offer}
                  </div>
                  <Button className="mt-4 px-6 bg-white text-emerald-700 hover:bg-emerald-50 font-black uppercase tracking-wider">
                    {banner.cta}
                  </Button>
                </div>
                <div className="hidden md:block relative h-full">
                  <Image
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-red-600" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="h-6 w-6 text-red-600" />
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroContent.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-3 w-3 rounded-full transition-all ${
                idx === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <Truck className="h-8 w-8 text-emerald-700 flex-shrink-0" />
              <div>
                <p className="font-bold text-foreground text-sm">Retire Na Loja Sem Custo</p>
                <p className="text-xs text-muted-foreground">Em pontos participantes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-emerald-700 flex-shrink-0" />
              <div>
                <p className="font-bold text-foreground text-sm">Escolha Seu Prazo</p>
                <p className="text-xs text-muted-foreground">Frete ajustável conforme CEP</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Leaf className="h-8 w-8 text-emerald-700 flex-shrink-0" />
              <div>
                <p className="font-bold text-foreground text-sm">Produtos 100% Naturais</p>
                <p className="text-xs text-muted-foreground">Certificados e testados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
            Categorias para Maratonar
          </h2>
          <p className="text-sm text-muted-foreground">🍿</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-secondary border border-emerald-200 hover:border-emerald-400 transition-all duration-300"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-lg font-black uppercase tracking-wide">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Mais Vendidos
          </h2>
          <Link href="/category/cuidados-pele" className="text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-800">
            Ver mais <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-emerald-700 text-white py-12 mt-8">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Junte-se à Comunidade Caiçara
          </h2>
          <p className="text-sm text-emerald-100 max-w-md mx-auto">
            Receba ofertas exclusivas e dicas de beleza natural
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-4 py-3 bg-white text-foreground focus:outline-none font-medium text-sm"
            />
            <Button className="px-6 bg-white text-emerald-700 hover:bg-emerald-50 font-black uppercase tracking-wider">Inscrever</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
