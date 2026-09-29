import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // express-session salva o token em um cookie chamado 'connect.sid'/'sid'
  const sessionCookie = request.cookies.get('sid');

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// config que diz qual rotas devem ser protegidas
export const config = {
  matcher: [
    '/products/:path*',
    '/invoices/:path*',
  ],
};
