"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '../../services/api';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // verifica se a rota esta ativa para destacar o link
  const isActive = (path: string) => pathname.startsWith(path);

  async function handleLogout() {
    if (!window.confirm('Tem certeza que deseja sair?')) return;

    try {
      // chama a rota de logout do back-end para limpar a sessao
      await apiClient('/auth/logout', { method: 'POST' }).catch(() => {});

      // redireciona para a tela de login
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  }

  // nao mostra o menu na tela de login ou registro
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-white border-b border-zinc-200 text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* logo e links da esquerda */}
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center font-medium text-lg tracking-tight">
              Management Products
            </div>

            <div className="hidden md:flex space-x-6">
              <Link
                href="/products"
                className={`inline-flex items-center text-sm font-medium transition-colors hover:text-zinc-900 ${
                  isActive('/products')
                    ? 'text-zinc-900 underline underline-offset-4'
                    : 'text-zinc-500'
                }`}
              >
                Produtos
              </Link>

              <Link
                href="/invoices"
                className={`inline-flex items-center text-sm font-medium transition-colors hover:text-zinc-900 ${
                  isActive('/invoices')
                    ? 'text-zinc-900 underline underline-offset-4'
                    : 'text-zinc-500'
                }`}
              >
                Faturas
              </Link>
            </div>
          </div>

          {/* botao de logout na direita sem cores de alerta */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-zinc-900 text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
