"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createInvoice } from "../../../services/invoices";
import { getProducts, Product } from "../../../services/products";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { ApiError } from "../../../types/api";

export default function NewInvoicePage() {
  const router = useRouter();

  const [number, setNumber] = useState("");
  const [customerName, setCustomerName] = useState("");

  // estado para itens
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { products } = await getProducts(1, 100);
        // filtra so os ativos
        setAvailableProducts(products.filter((p) => p.isActive));
      } catch (error) {
        setErrorMessage("erro ao carregar os produtos.");
      } finally {
        setIsFetchingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (items.some((item) => !item.productId)) {
      setErrorMessage("selecione um produto para todos os itens.");
      return;
    }

    setIsLoading(true);

    try {
      await createInvoice({
        number: Number(number),
        customerName,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      });

      router.push("/invoices");
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(apiError.message || "erro ao criar fatura.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-screen bg-zinc-50">
      <h1 className="text-2xl font-medium mb-8 text-zinc-900 tracking-tight">
        Nova Fatura
      </h1>

      {errorMessage && (
        <div className="mb-6 p-3 bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 border border-zinc-200"
      >
        <div>
          <h2 className="text-base font-medium text-zinc-900 mb-4 border-b border-zinc-100 pb-2">
            Dados do Cliente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Input
                label="Nº da Fatura"
                type="number"
                placeholder="Ex: 1001"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Nome do Cliente"
                placeholder="Nome completo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-2">
            <h2 className="text-base font-medium text-zinc-900">Itens</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 underline underline-offset-4"
            >
              adicionar produto
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-end gap-4 bg-zinc-50 p-4 border border-zinc-200"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Produto
                  </label>

                  <select
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(index, "productId", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-none outline-none focus:border-zinc-500 text-sm"
                    required
                    disabled={isFetchingProducts}
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>

                    {availableProducts.map((product) => {
                      const isAlreadySelected = items.some(
                        (selectedItem, selectedIndex) =>
                          selectedIndex !== index &&
                          selectedItem.productId === product.id,
                      );

                      return (
                        <option
                          key={product.id}
                          value={product.id}
                          disabled={isAlreadySelected} // desabilita se ja estiver em uso
                        >
                          {product.name} (Estoque: {product.stock})
                          {isAlreadySelected ? " - Já adicionado" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="w-24">
                  <Input
                    label="Qtd"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    required
                  />
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="mb-1 p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    remover
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-4 border-t border-zinc-100">
          <button
            type="button"
            className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 underline underline-offset-4"
            onClick={() => router.push("/invoices")}
          >
            Cancelar
          </button>

          <Button
            type="submit"
            isLoading={isLoading || isFetchingProducts}
            className="bg-zinc-900 text-white rounded-none hover:bg-zinc-800"
          >
            Salvar Fatura
          </Button>
        </div>
      </form>
    </div>
  );
}
