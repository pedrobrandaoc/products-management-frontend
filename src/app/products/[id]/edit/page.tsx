"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getProductById, updateProduct } from "../../../../services/products";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { ApiError } from "../../../../types/api";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [resolvedId, setResolvedId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setResolvedId(p.id));
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;

    async function loadProduct() {
      try {
        
        const data = await getProductById(resolvedId);

        setName(data.name);
        setPrice(data.price.toString());
        setStock(data.stock.toString());
        setIsActive(data.isActive);
      } catch (error) {
        setErrorMessage("erro ao carregar os dados do produto.");
      } finally {
        setIsFetching(false);
      }
    }

    loadProduct();
  }, [resolvedId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await updateProduct(resolvedId, {
        name,
        price: Number(price),
        stock: Number(stock),
        isActive,
      });

      router.push("/products");
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(apiError.message || "erro ao atualizar produto.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return <div className="p-8 text-center text-zinc-500">carregando...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-screen bg-zinc-50">
      <h1 className="text-2xl font-medium mb-8 text-zinc-900 tracking-tight">
        Editar Produto
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <Input
            label="Estoque"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 accent-zinc-900 border-zinc-300"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-zinc-700"
          >
            Produto Ativo
          </label>
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
            Atualizar
          </Button>
        </div>
      </form>
    </div>
  );
}
