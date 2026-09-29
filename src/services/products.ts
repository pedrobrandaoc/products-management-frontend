import { apiClient } from './api';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string | null;
}

export interface GetProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductDTO {
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
}

export async function getProducts(page: number = 1, limit: number = 10) {
  return apiClient<GetProductsResponse>(`/products?page=${page}&limit=${limit}`);
}

export async function getProductById(id: string): Promise<Product> {
  const response = await apiClient(`/products/${id}`) as { product: Product };

  return response.product;
}

export async function createProduct(data: CreateProductDTO) {
  return apiClient<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: UpdateProductDTO) {
  return apiClient<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deactiveProduct(id: string) {
  return apiClient<void>(`/products/deactivate/${id}`, {
    method: 'PATCH',
  });
}
