import Link from 'next/link';
import { getInvoiceById } from '../../../services/invoices';
import { InvoiceActions } from '../../../components/invoices/InvoiceActions';

interface InvoiceDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailsPage({ params }: InvoiceDetailsProps) {
  const resolvedParams = await params;
  const invoice = await getInvoiceById(resolvedParams.id);

  const formatCurrency = (value: string) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));

  // calcula o total caso o banco retorne zerado
  const calculatedTotal = invoice.items.reduce((acc, item) => acc + Number(item.total), 0);
  const finalTotal = Number(invoice.total) > 0 ? Number(invoice.total) : calculatedTotal;

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-zinc-50">
      <Link href="/invoices" className="text-sm text-zinc-500 hover:text-zinc-900 mb-6 inline-block underline underline-offset-4">
        voltar para faturas
      </Link>

      <div className="bg-white p-8 border border-zinc-200">
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 pb-6 border-b border-zinc-100">
          <div>
            <h1 className="text-2xl font-medium text-zinc-900 mb-1 tracking-tight">
              Fatura #{invoice.number}
            </h1>
            <p className="text-zinc-600 text-sm">Cliente: <span className="font-medium text-zinc-900">{invoice.customerName}</span></p>
            <p className="text-sm text-zinc-400 mt-1">
              Data: {new Date(invoice.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <span className="text-sm text-zinc-500 lowercase border border-zinc-200 px-3 py-1 bg-zinc-50">
              {invoice.status}
            </span>
            <div className="mt-4">
              <InvoiceActions id={invoice.id} status={invoice.status} />
            </div>
          </div>
        </div>

        <h3 className="text-base font-medium text-zinc-900 mb-4">Itens da Fatura</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-sm text-zinc-500">
                <th className="pb-3 font-medium">Produto</th>
                <th className="pb-3 font-medium text-center">Qtd</th>
                <th className="pb-3 font-medium text-right">Preço Unit.</th>
                <th className="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100 last:border-0">
                  <td className="py-4 text-zinc-800">{item.productName}</td>
                  <td className="py-4 text-center text-zinc-600">{item.quantity}</td>
                  <td className="py-4 text-right text-zinc-600">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-right font-medium text-zinc-900">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-full md:w-1/3 bg-zinc-50 p-4 border border-zinc-200">
            <div className="flex justify-between items-center text-base font-medium text-zinc-900">
              <span>Total da Fatura:</span>
              <span>{formatCurrency(finalTotal.toString())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
