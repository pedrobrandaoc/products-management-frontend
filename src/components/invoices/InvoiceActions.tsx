"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { issueInvoice, cancelInvoice } from '../../services/invoices';
import { Button } from '../ui/Button';
import { ApiError } from '../../types/api';

interface InvoiceActionsProps {
  id: string;
  status: 'DRAFT' | 'ISSUED' | 'CANCELLED';
}

export function InvoiceActions({ id, status }: InvoiceActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleIssue() {
    if (!window.confirm('Tem certeza que deseja emitir esta fatura? Essa ação não pode ser desfeita.')) return;
    setIsLoading(true);
    try {
      await issueInvoice(id);
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message || 'Erro ao emitir a fatura.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm('Tem certeza que deseja cancelar esta fatura?')) return;
    setIsLoading(true);
    try {
      await cancelInvoice(id);
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message || 'Erro ao cancelar a fatura.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-3 mt-6">
      {status === 'DRAFT' && (
        <Button
          onClick={handleIssue}
          isLoading={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Emitir Fatura
        </Button>
      )}

      {(status === 'DRAFT' || status === 'ISSUED') && (
        <Button
          onClick={handleCancel}
          isLoading={isLoading}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
        >
          Cancelar Fatura
        </Button>
      )}
    </div>
  );
}
