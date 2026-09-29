import { ENV } from "../config/env";
import { ApiError } from "../types/api";

// ---------- csrf token armazenada da memória ---------- 
let cachedCsrfToken: string | null = null;

// ---------- api client (client HTTP abstraction) ---------- 
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {

  // url da api + endpoint 
  const url = `${ENV.API_URL}${endpoint}`;

  // method da requisição 
  const method = (options.method || "GET").toUpperCase();

  //  headers 
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // ---------- lógica server side ---------- 
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("sid");
    if (sessionCookie) {
      headers = { ...headers, Cookie: `sid=${sessionCookie.value}` };
    };
  };

  // ---------- lógica client side  ---------- 
  if (
    typeof window !== "undefined" &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(method) 
  ) {
    // verifica se existe csrf token na memória  
    if (!cachedCsrfToken) {
      try {
        const csrfRes = await fetch(`${ENV.API_URL}/auth/csrf-token`, {
          credentials: "include", // todos cookies que estão no navegador
        });

        if (csrfRes.ok) {
          const data = await csrfRes.json();
          cachedCsrfToken = data.csrfToken;
        };
      } catch (err) {
        console.error("Erro ao buscar token CSRF:", err);
      };
    };

    // add csrfToken no headers 
    if (cachedCsrfToken) {
      headers = { ...headers, "x-csrf-token": cachedCsrfToken };
    };
  };

 // ---------- response principal ---------- 
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // tratamento de erro response principal 
  if (!response.ok) {

    let errorData: ApiError;

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: "Ocorreu um erro inesperado no servidor." };
    }

    // csrf token inválido 
    if (response.status === 403) {
      cachedCsrfToken = null;
    };

    // lança erro 
    throw {
      message: errorData.message || "Erro na requisição",
      statusCode: response.status,
      errors: errorData.errors,
    } as ApiError;
  };

  // ---------- response sem retorno ---------- 
  if (response.status === 204) return {} as T;

  // ---------- response com retorno em json ---------- 
  return response.json();
}
