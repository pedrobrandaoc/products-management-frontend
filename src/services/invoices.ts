import { apiClient } from './api';

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: string; 
  total: string;     
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceUser {
  id: string;
  name: string;
  email: string;
}

export interface Invoice {
  id: string;
  number: number;
  customerName: string;
  status: 'DRAFT' | 'ISSUED' | 'CANCELLED'; 
  total: string; 
  createdById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
  createdBy: InvoiceUser;
  updatedBy: InvoiceUser;
}

export interface GetInvoicesResponse {
  invoices: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateInvoiceItemDTO {
  productId: string;
  quantity: number;
}

export interface CreateInvoiceDTO {
  number: number;
  customerName: string;
  items: CreateInvoiceItemDTO[];
}

export async function getInvoices(page: number = 1, limit: number = 10) {
  return apiClient<GetInvoicesResponse>(`/invoice?page=${page}&limit=${limit}`);
}

export async function getInvoiceById(id: string) {
  return apiClient<Invoice>(`/invoice/${id}`);
}

export async function createInvoice(data: CreateInvoiceDTO) {
  return apiClient<Invoice>('/invoice', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function issueInvoice(id: string) {
  return apiClient<Invoice>(`/invoice/${id}/issue`, {
    method: 'PATCH',
  });
}

export async function cancelInvoice(id: string) {
  return apiClient<Invoice>(`/invoice/${id}/cancel`, {
    method: 'PATCH',
  });
}
