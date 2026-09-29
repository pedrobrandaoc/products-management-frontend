# Products Management Frontend

Interface front-end desenvolvida com Next.js (App Router), TypeScript e Tailwind CSS para consumo da API de gerenciamento de produtos e faturas.

## Tecnologias

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Estrutura do Projeto

- `src/app/`: Páginas e layouts organizados por rotas (invoices, products, login, register).
- `src/components/`: Componentes visuais reutilizáveis e de layout.
- `src/services/`: Clientes de integração HTTP, tratamento de cookies e chamadas à API.
- `src/proxy.ts`: Interceptador de rotas para proteção de acesso.

## Instalação e Execução

Clone o repositório e instale as dependências:

```bash
git clone [https://github.com/pedrobrandaoc/products-management-frontend](https://github.com/pedrobrandaoc/products-management-frontend)
cd products-management-frontend
npm install
npm run build
npm start