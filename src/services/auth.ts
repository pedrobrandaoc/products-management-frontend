import { apiClient } from './api';

// molde do que a sua API espera receber para fazer o login
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser{
  name: string,
  email: string,
  createdAt: string,
  updatedAt: string
}

export async function login(data: LoginDTO) {
  return apiClient<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function register(data: RegisterDTO) {
  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
