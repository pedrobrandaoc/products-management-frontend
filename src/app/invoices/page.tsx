import Link from 'next/link';
import { getInvoices } from '../../services/invoices';

interface InvoicesPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentLimit = Number(params.limit) || 10;

  // busca os dados na api
  const { invoices, pagination } = await getInvoices(currentPage, currentLimit);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < pagination.totalPages;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-zinc-50 min-h-screen">
      <div className="flex justify-between items-end mb-8 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-medium text-zinc-900 tracking-tight">Faturas</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Página {pagination.page} de {pagination.totalPages}
          </p>
        </div>

        <Link
          href="/invoices/new"
          className="bg-zinc-900 text-white px-4 py-2 text-sm hover:bg-zinc-800 transition-colors"
        >
          Nova Fatura
        </Link>
      </div>

      <div className="grid gap-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-5 border border-zinc-200 bg-white flex flex-col md:flex-row justify-between md:items-center hover:border-zinc-300 transition-colors"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-medium text-zinc-900">#{invoice.number}</h2>
                <span className="text-zinc-400 text-sm">/</span>
                {/* status minimalista sem cores coloridas */}
                <span className="text-zinc-500 text-sm">{invoice.status}</span>
              </div>
              <p className="text-sm text-zinc-600">
                {invoice.customerName}
              </p>
            </div>

            <div className="text-left md:text-right flex flex-col justify-between mt-4 md:mt-0">
              <span className="text-base font-medium text-zinc-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(Number(invoice.total))}
              </span>

              <Link
                href={`/invoices/${invoice.id}`}
                className="text-zinc-500 hover:text-zinc-900 text-sm mt-2 underline underline-offset-4"
              >
                Detalhes
              </Link>
            </div>
          </div>
        ))}

        {invoices.length === 0 && (
          <div className="p-8 text-center text-zinc-500 border border-zinc-200 bg-white">
            Nenhuma fatura encontrada.
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between pt-4">
        <div className="text-sm text-zinc-500">
          Total de {pagination.total} registros
        </div>

        <div className="flex gap-2">
          {hasPreviousPage ? (
            <Link href={`/invoices?page=${currentPage - 1}&limit=${currentLimit}`} className="px-4 py-2 border border-zinc-200 text-sm hover:bg-zinc-100">
              Anterior
            </Link>
          ) : (
            <button disabled className="px-4 py-2 border border-zinc-100 text-zinc-400 text-sm cursor-not-allowed">Anterior</button>
          )}

          {hasNextPage ? (
            <Link href={`/invoices?page=${currentPage + 1}&limit=${currentLimit}`} className="px-4 py-2 border border-zinc-200 text-sm hover:bg-zinc-100">
              Próximo
            </Link>
          ) : (
            <button disabled className="px-4 py-2 border border-zinc-100 text-zinc-400 text-sm cursor-not-allowed">Próximo</button>
          )}
        </div>
      </div>
    </div>
  );
}
