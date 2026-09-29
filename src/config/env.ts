const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Variável de ambiente ausente: NEXT_PUBLIC_API_URL");
}

export const ENV = {
  API_URL: apiUrl,
} as const;
