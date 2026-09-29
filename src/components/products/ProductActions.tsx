"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deactiveProduct } from '../../services/products';
import { Button } from '../ui/Button';
import { ApiError } from '../../types/api';
import Link from 'next/link';

interface ProductActionsProps {
  id: string;
}

export function ProductActions({ id }: ProductActionsProps) {
  const router = useRouter();
  const [isDeactivating, setIsDeactivating] = useState(false);

  async function handleDeactive() {
    if (!window.confirm('Tem certeza que você quer desativar esse produto')) return;

    setIsDeactivating(true);

    try {
      await deactiveProduct(id);
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message || 'Error deactiving product');
      setIsDeactivating(false);
    }
  }

  return (
    <div className="flex justify-center items-center gap-6 mt-4 md:mt-0">
      <Link
        href={`/products/${id}/edit`}
        className="text-zinc-500 hover:text-zinc-900 text-sm underline underline-offset-4"
      >
        Editar
      </Link>

      <Button
        type="button"
        onClick={handleDeactive}
        isLoading={isDeactivating}
        className="bg-red-500 text-red-600 hover:bg-red-100 py-1.5 px-3 text-sm"
      >
        Desativar produto
      </Button>
    </div>
  );
}
