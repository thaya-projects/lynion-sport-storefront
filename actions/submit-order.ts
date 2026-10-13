'use server';

import { z } from 'zod';
import { buildWhatsappMessage, buildWhatsappUrl } from '@/lib/whatsapp';
import type { CartItem } from '@/lib/cart/store';

const schema = z.object({
  name: z.string().min(2, 'Nombre demasiado corto'),
  phone: z.string().min(6, 'Teléfono inválido'),
  city: z.string().min(2, 'Ciudad requerida'),
  notes: z.string().optional(),
});

type SubmitInput = {
  customer: { name: string; phone: string; city: string; notes?: string };
  items: CartItem[];
};

type SubmitResult =
  | { ok: true; orderNumber: string; waUrl: string }
  | { ok: false; error: string };

export async function submitOrder(input: SubmitInput): Promise<SubmitResult> {
  const parsed = schema.safeParse(input.customer);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  if (!input.items.length) {
    return { ok: false, error: 'El carrito está vacío' };
  }

  const subtotal = input.items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const orderNumber = generateOrderNumber();

  // TODO: reemplazar por POST real a /api/public/sales-orders cuando el
  // PublicStorefrontController esté en el backend .NET.

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  const message = buildWhatsappMessage({
    orderNumber,
    items: input.items,
    subtotal,
    customer: parsed.data,
  });
  const waUrl = buildWhatsappUrl(waNumber, message);

  return { ok: true, orderNumber, waUrl };
}

function generateOrderNumber() {
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LS-${y}${m}${d}-${rand}`;
}
