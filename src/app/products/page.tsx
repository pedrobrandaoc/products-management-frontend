import Link from 'next/link';
import { getProducts } from '../../services/products';
import { ProductActions } from '../../components/products/ProductActions';

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentLimit = Number(params.limit) || 10;

  const { products, pagination } = await getProducts(currentPage, currentLimit);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < pagination.totalPages;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-zinc-50 min-h-screen">
      <div className="flex justify-between items-end mb-8 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-medium text-zinc-900 tracking-tight">Produtos</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Página {pagination.page} de {pagination.totalPages}
          </p>
        </div>

        <Link
          href="/products/new"
          className="bg-zinc-900 text-white px-4 py-2 text-sm hover:bg-zinc-800 transition-colors"
        >
          Novo Produto
        </Link>
      </div>

      <div className="grid gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-5 border border-zinc-200 bg-white flex flex-col md:flex-row justify-between md:items-center hover:border-zinc-300 transition-colors"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-medium text-zinc-900">{product.name}</h2>
                <span className="text-zinc-400 text-sm">/</span>
                <span className="text-zinc-500 text-sm lowercase">
                  {product.isActive ? 'ativo' : 'inativo'}
                </span>
              </div>
              <p className="text-sm text-zinc-600">
                Estoque: {product.stock} un.
              </p>
            </div>

            <div className="text-left md:text-right flex flex-col justify-between mt-4 md:mt-0">
              <span className="text-base font-medium text-zinc-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(Number(product.price))}
              </span>

              <div className="flex items-center gap-4 mt-2">
                <ProductActions id={product.id} />
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="p-8 text-center text-zinc-500 border border-zinc-200 bg-white">
            Nenhum produto encontrado.
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between pt-4">
        <div className="text-sm text-zinc-500">
          Total de {pagination.total} registros
        </div>

        <div className="flex gap-2">
          {hasPreviousPage ? (
            <Link href={`/products?page=${currentPage - 1}&limit=${currentLimit}`} className="px-4 py-2 border border-zinc-200 text-sm hover:bg-zinc-100">
              Anterior
            </Link>
          ) : (
            <button disabled className="px-4 py-2 border border-zinc-100 text-zinc-400 text-sm cursor-not-allowed">Anterior</button>
          )}

          {hasNextPage ? (
            <Link href={`/products?page=${currentPage + 1}&limit=${currentLimit}`} className="px-4 py-2 border border-zinc-200 text-sm hover:bg-zinc-100">
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
