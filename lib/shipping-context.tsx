"use client";

import { createContext, useContext, useState } from "react";

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  daysToDeliver: number;
  estimatedDate: string;
}

interface ShippingContextType {
  selectedShipping: ShippingOption | null;
  shippingOptions: ShippingOption[];
  calculateShipping: (cep: string, totalValue: number) => ShippingOption[];
  selectShipping: (option: ShippingOption) => void;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

export function ShippingProvider({ children }: { children: React.ReactNode }) {
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);

  const calculateShipping = (cep: string, totalValue: number): ShippingOption[] => {
    // Simulando cálculo de frete baseado em CEP
    // Em produção, isso seria chamado para uma API real
    const today = new Date();

    // Gera diferentes opções de frete
    const options: ShippingOption[] = [];

    // Opção 1: Frete Econômico
    if (totalValue < 500) {
      const economicDate = new Date(today);
      economicDate.setDate(economicDate.getDate() + 10);
      options.push({
        id: "economic",
        name: "Frete Econômico",
        price: 19.9,
        daysToDeliver: 10,
        estimatedDate: economicDate.toLocaleDateString("pt-BR"),
      });
    }

    // Opção 2: Frete Padrão (sempre disponível)
    const standardDate = new Date(today);
    standardDate.setDate(standardDate.getDate() + 5);
    const standardPrice = totalValue > 500 ? 0 : 35.0;
    options.push({
      id: "standard",
      name: "Frete Padrão",
      price: standardPrice,
      daysToDeliver: 5,
      estimatedDate: standardDate.toLocaleDateString("pt-BR"),
    });

    // Opção 3: Frete Express
    const expressDate = new Date(today);
    expressDate.setDate(expressDate.getDate() + 2);
    options.push({
      id: "express",
      name: "Frete Express",
      price: 89.9,
      daysToDeliver: 2,
      estimatedDate: expressDate.toLocaleDateString("pt-BR"),
    });

    setShippingOptions(options);
    // Seleciona automaticamente a primeira opção
    if (options.length > 0 && !selectedShipping) {
      setSelectedShipping(options[0]);
    }
    return options;
  };

  const selectShipping = (option: ShippingOption) => {
    setSelectedShipping(option);
  };

  return (
    <ShippingContext.Provider
      value={{
        selectedShipping,
        shippingOptions,
        calculateShipping,
        selectShipping,
      }}
    >
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const context = useContext(ShippingContext);
  if (!context) {
    throw new Error("useShipping must be used within a ShippingProvider");
  }
  return context;
}
