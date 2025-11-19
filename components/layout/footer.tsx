import Link from "next/link";
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-black uppercase tracking-tight">CAIÇARA</h3>
            <p className="text-gray-300 max-w-xs text-sm leading-relaxed">
              Cosméticos naturais de qualidade para sua beleza e bem-estar. Produtos certificados e sustentáveis.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">Categorias</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/category/cuidados-pele" className="hover:text-emerald-400 transition-colors">Cuidados com Pele</Link></li>
              <li><Link href="/category/cabelos" className="hover:text-emerald-400 transition-colors">Cabelos</Link></li>
              <li><Link href="/category/maquiagem" className="hover:text-emerald-400 transition-colors">Maquiagem</Link></li>
              <li><Link href="/category/corpo-banho" className="hover:text-emerald-400 transition-colors">Corpo & Banho</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">Suporte</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Fale Conosco</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Envios e Devoluções</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Termos de Uso</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">Redes Sociais</h4>
            <div className="flex gap-3">
              <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-emerald-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-emerald-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-emerald-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} CAIÇARA - Cosméticos Naturais. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
