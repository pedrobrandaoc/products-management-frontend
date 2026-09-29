"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "../../services/auth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ApiError } from "../../types/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // envia os dados para criacao na api
      await register({ name, email, password });
      alert("Conta criada. Faça login para acessar.");
      router.push("/login");
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.errors && apiError.errors.length > 0) {
        setErrorMessage(apiError.errors[0].message);
        return;
      }

      setErrorMessage(apiError.message || "Erro ao criar conta.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50">
      <div className="bg-white p-8 border border-zinc-200 w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-xl font-medium text-zinc-900 tracking-tight">
            Nova Conta
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Preencha os dados abaixo</p>
        </div>

        {/* bloco de erro em tons de cinza em vez de vermelho */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nome"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            minLength={6}
          />

          <div className="pt-2">
            {/* botao principal escuro e quadrado */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-none"
            >
              Cadastrar
            </Button>
          </div>
        </form>

        <div className="mt-8 text-sm text-zinc-500 pt-6 border-t border-zinc-100">
          Já possui conta?{" "}
          <Link
            href="/login"
            className="text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
