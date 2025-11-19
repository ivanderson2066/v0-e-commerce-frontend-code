import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { ShippingProvider } from "@/lib/shipping-context";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumina | E-commerce de Cosméticos Naturais",
  description: "Produtos naturais e cosméticos de alta qualidade para sua beleza.",
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <CartProvider>
            <ShippingProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </ShippingProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
