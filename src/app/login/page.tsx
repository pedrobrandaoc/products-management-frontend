"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { login } from '../../services/auth';
import { ApiError } from '../../types/api';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      // executa o login e atualiza a sessao
      await login({ email, password });
      router.push('/products');
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(apiError.message || 'Erro ao entrar. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50">
      <div className="bg-white p-8 border border-zinc-200 w-full max-w-sm">

        <div className="mb-8">
          <h1 className="text-xl font-medium text-zinc-900 tracking-tight">Entrar</h1>
          <p className="text-zinc-500 text-sm mt-1">Acesse sua conta para continuar</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            placeholder="nome@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="pt-2">
            <Button type="submit" isLoading={isLoading} className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-none">
              Acessar
            </Button>
          </div>
        </form>

        <div className="mt-8 text-sm text-zinc-500 pt-6 border-t border-zinc-100">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors">
            Criar agora
          </Link>
        </div>

      </div>
    </div>
  );
}
