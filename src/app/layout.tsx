import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Management Products",
  description: "Gerenciamento de Produtos e Faturas com sistema de autenticação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}
      >
        <Navbar />

        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
