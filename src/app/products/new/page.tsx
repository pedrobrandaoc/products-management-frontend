"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "../../../services/products";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { ApiError } from "../../../types/api";

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await createProduct({
        name,
        price: Number(price),
        stock: Number(stock),
        isActive: true,
      });

      // força a atualização da lista ao voltar
      router.push("/products");
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(apiError.message || "Error creating product");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-screen bg-zinc-50">
      <h1 className="text-2xl font-medium mb-8 text-zinc-900 tracking-tight">
        Novo Produto
      </h1>

      {errorMessage && (
        <div className="mb-6 p-3 bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 border border-zinc-200"
      >
        <Input
          label="Nome do Produto"
          placeholder="Ex: Teclado Mecânico"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <Input
            label="Estoque"
            type="number"
            placeholder="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="pt-6 flex justify-end gap-4 border-t border-zinc-100">
          <button
            type="button"
            className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 underline underline-offset-4"
            onClick={() => router.push("/products")}
          >
            Cancelar
          </button>

          <Button
            type="submit"
            isLoading={isLoading}
            className="bg-zinc-900 text-white rounded-none hover:bg-zinc-800"
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
