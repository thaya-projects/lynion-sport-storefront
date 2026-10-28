import type { CartItem } from '@/lib/cart/store';
import { formatPrice } from '@/lib/format';

type CustomerInfo = {
  name: string;
  phone: string;
  city: string;
  notes?: string;
};

type BuildMessageArgs = {
  orderNumber?: string;
  items: CartItem[];
  subtotal: number;
  customer: CustomerInfo;
};

export function buildWhatsappMessage({ orderNumber, items, subtotal, customer }: BuildMessageArgs) {
  const lines = [
    '¡Hola Lynion Sport! Quiero hacer un pedido.',
    '',
    orderNumber ? `Pedido: ${orderNumber}` : 'Pedido nuevo',
    '──────────────',
    ...items.map((i) => `• ${i.qty}× ${i.name} — ${formatPrice(i.price * i.qty)}`),
    '──────────────',
    `Subtotal: ${formatPrice(subtotal)}`,
    '',
    'Datos:',
    `Nombre: ${customer.name}`,
    `Teléfono: ${customer.phone}`,
    `Ciudad: ${customer.city}`,
  ];

  if (customer.notes?.trim()) {
    lines.push(`Notas: ${customer.notes.trim()}`);
  }

  lines.push('', '¡Gracias!');
  return lines.join('\n');
}

export function buildWhatsappUrl(phoneE164: string, message: string) {
  const cleaned = phoneE164.replace(/[^\d]/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildProductInquiryUrl(
  phoneE164: string,
  product: { name: string; brand?: string; price: number | null },
) {
  const title = product.brand ? `${product.brand} — ${product.name}` : product.name;
  const price = product.price !== null ? `\n${formatPrice(product.price)}` : '';
  const message = `Hola Lynion Sport, me interesa consultar por:\n\n${title}${price}\n\n¿Está disponible?`;
  return buildWhatsappUrl(phoneE164, message);
}

export function buildGeneralInquiryUrl(phoneE164: string) {
  return buildWhatsappUrl(phoneE164, 'Hola Lynion Sport, quiero más información sobre sus productos.');
}
