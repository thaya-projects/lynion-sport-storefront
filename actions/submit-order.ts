'use server';

import { z } from 'zod';
import { buildWhatsappMessage, buildWhatsappUrl } from '@/lib/whatsapp';
import { WHATSAPP_NUMBER } from '@/lib/site';
import { getAllProducts } from '@/lib/catalog';
import type { CartItem } from '@/lib/cart/store';

const MIN_PHONE_DIGITS = 7;

const schema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre para saber a quién enviar el pedido.'),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v.replace(/\D/g, '').length >= MIN_PHONE_DIGITS,
      'Escribe un número con al menos 7 dígitos, por ejemplo 71234567.',
    ),
  city: z.string().trim().min(2, 'Escribe tu ciudad o zona para calcular el envío.'),
  notes: z.string().optional(),
});

// Del carrito solo se confía en qué productos y cuántos: precio, nombre y stock
// salen del catálogo de Thaya al momento de pedir.
const itemsSchema = z
  .array(
    z.object({
      productId: z.string().min(1).max(100),
      name: z.string().min(1).max(200),
      price: z.number().nonnegative(),
      qty: z.number().int().min(1).max(999),
      option: z.string().max(80).optional(),
    }).passthrough(),
  )
  .max(50);

export type OrderField = 'name' | 'phone' | 'city';

type SubmitInput = {
  customer: { name: string; phone: string; city: string; notes?: string };
  items: CartItem[];
};

type SubmitResult =
  | { ok: true; orderNumber: string; waUrl: string }
  | {
      ok: false;
      error?: string;
      fieldErrors?: Partial<Record<OrderField, string>>;
      // Carrito corregido cuando cambió el precio o el stock desde que se armó.
      cart?: CartItem[];
    };

export async function submitOrder(input: SubmitInput): Promise<SubmitResult> {
  const parsed = schema.safeParse(input.customer);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<OrderField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as OrderField;
      fieldErrors[field] ??= issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const parsedItems = itemsSchema.safeParse(input.items);
  if (!parsedItems.success) {
    return { ok: false, error: 'No pudimos leer tu carrito. Vacíalo y vuelve a agregar los productos.' };
  }
  if (!input.items.length) {
    return { ok: false, error: 'Tu carrito está vacío. Agrega un producto para hacer el pedido.' };
  }

  const { items, changed } = await repriceItems(input.items);
  if (changed) {
    return {
      ok: false,
      cart: items,
      error: items.length
        ? 'Algunos precios o el stock cambiaron. Revisa tu carrito y vuelve a confirmar.'
        : 'Los productos de tu carrito ya no están disponibles.',
    };
  }

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const orderNumber = generateOrderNumber();

  // TODO: reemplazar por POST real a /api/public/sales-orders cuando el
  // PublicStorefrontController esté en el backend .NET.

  const waNumber = WHATSAPP_NUMBER;
  const message = buildWhatsappMessage({
    orderNumber,
    items,
    subtotal,
    customer: parsed.data,
  });
  const waUrl = buildWhatsappUrl(waNumber, message);

  return { ok: true, orderNumber, waUrl };
}

// Compara el carrito con el catálogo actual. Saca productos que ya no se
// venden o están agotados, ajusta la cantidad al stock y actualiza precio y
// nombre. Si Thaya no responde, se sigue con el carrito tal cual: el pedido
// igual lo confirma una persona por WhatsApp.
async function repriceItems(cart: CartItem[]): Promise<{ items: CartItem[]; changed: boolean }> {
  let catalog;
  try {
    catalog = await getAllProducts();
  } catch {
    return { items: cart, changed: false };
  }
  const byId = new Map(catalog.map((p) => [p.id, p]));

  let changed = false;
  const items: CartItem[] = [];
  for (const item of cart) {
    const product = byId.get(item.productId);
    if (!product || product.price === null || product.stock === 0) {
      changed = true;
      continue;
    }
    const qty = product.stock === undefined ? item.qty : Math.min(item.qty, product.stock);
    if (qty !== item.qty || product.price !== item.price || product.name !== item.name) changed = true;
    items.push({ ...item, name: product.name, price: product.price, qty, maxQty: product.stock });
  }
  return { items, changed };
}

function generateOrderNumber() {
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LS-${y}${m}${d}-${rand}`;
}
