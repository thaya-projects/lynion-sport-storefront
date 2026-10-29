import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

// Thaya llama aquí cada vez que cambia algo que la tienda muestra (productos,
// fotos, stock, categorías, datos de la empresa). Se descarta la caché del
// catálogo y la siguiente visita ya trae los datos nuevos, sin esperar los
// 5 minutos de revalidación.
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'REVALIDATE_SECRET no está configurado' }, { status: 500 });
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!safeEqual(token, secret)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  revalidateTag('storefront');
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
