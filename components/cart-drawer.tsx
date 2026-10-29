'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag, Check, ArrowLeft } from 'lucide-react';
import { cartCount, cartSubtotal, useCart } from '@/lib/cart/store';
import { formatPrice } from '@/lib/format';
import { useDialog } from '@/lib/use-dialog';
import { CheckoutForm } from '@/components/checkout-form';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

type Phase = 'cart' | 'checkout' | 'success';

function unitsLabel(n: number) {
  return n === 1 ? '1 producto' : `${n} productos`;
}

export function CartDrawer() {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const closeDrawer = useCart((s) => s.closeDrawer);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const [phase, setPhase] = useState<Phase>('cart');
  const [order, setOrder] = useState<{ number: string; waUrl: string } | null>(null);
  const [sent, setSent] = useState(false);
  const dialogRef = useDialog<HTMLElement>(isOpen, closeDrawer);
  const sendRef = useRef<HTMLAnchorElement>(null);

  // El botón de envío del formulario desaparece al confirmar: el foco pasa al
  // siguiente paso (abrir WhatsApp) para no quedar perdido en la página.
  useEffect(() => {
    if (phase === 'success') sendRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (!isOpen) {
      // Al cerrar se vuelve al carrito, para que la próxima apertura no
      // muestre un pedido viejo. Si el pedido no se envió, el carrito sigue
      // intacto y se puede reintentar.
      const t = setTimeout(() => {
        setPhase('cart');
        setOrder(null);
        setSent(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const subtotal = cartSubtotal(items);
  const units = cartCount(items);

  const title =
    phase === 'success' ? 'Pedido listo' : phase === 'checkout' ? 'Tus datos' : `Tu carrito (${units})`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={closeDrawer}
        >
          <motion.aside
            ref={dialogRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="ml-auto flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-soft"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <header className="flex items-center justify-between border-b border-white/10 py-2 pl-5 pr-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-lynion-500" aria-hidden />
                <h2 id="cart-title" className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Cerrar carrito"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {phase === 'success' && order && (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp">
                  <Check className="h-8 w-8 text-ink" strokeWidth={3} aria-hidden />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold text-white">
                  {sent ? '¡Pedido enviado!' : 'Último paso'}
                </h3>
                <p className="mt-2 text-sm font-semibold tabular-nums text-primary">{order.number}</p>
                <p className="mt-3 max-w-xs text-sm text-white/70">
                  {sent
                    ? 'Si WhatsApp no se abrió, toca el botón otra vez. Ahí coordinamos el pago y la entrega.'
                    : 'Envíanos el pedido por WhatsApp para confirmarlo. Ahí coordinamos el pago y la entrega.'}
                </p>
                <a
                  ref={sendRef}
                  href={order.waUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={() => {
                    setSent(true);
                    clear();
                  }}
                  className="mt-8 inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-2.5 rounded-full bg-whatsapp px-5 text-sm font-bold text-ink transition hover:bg-whatsapp-hi"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {sent ? 'Abrir WhatsApp de nuevo' : 'Enviar pedido por WhatsApp'}
                </a>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="mt-3 min-h-11 px-5 text-sm font-semibold text-white/70 transition hover:text-white"
                >
                  Seguir viendo productos
                </button>
              </div>
            )}

            {phase !== 'success' && items.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="h-10 w-10 text-white/30" aria-hidden />
                <p className="mt-4 text-sm text-white/70">Tu carrito está vacío.</p>
                <Link
                  href="/productos"
                  onClick={closeDrawer}
                  className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-ink transition hover:bg-primary-hi"
                >
                  Ver catálogo
                </Link>
              </div>
            )}

            {phase === 'cart' && items.length > 0 && (
              <>
                <ul className="flex-1 divide-y divide-white/5 overflow-y-auto px-5">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-3 py-4">
                      <CartThumb item={item} />
                      <div className="min-w-0 flex-1">
                        {item.brand && (
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                            {item.brand}
                          </p>
                        )}
                        <Link
                          href={`/productos/${item.slug}`}
                          onClick={closeDrawer}
                          className="line-clamp-2 text-sm font-medium text-white hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm font-bold tabular-nums text-white">
                          {formatPrice(item.price * item.qty)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => remove(item.productId)}
                          aria-label={`Quitar ${item.name} del carrito`}
                          className="-mr-3 -mt-2 flex h-11 w-11 items-center justify-center text-white/50 transition hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-center rounded-full border border-white/10">
                          <button
                            type="button"
                            onClick={() => setQty(item.productId, item.qty - 1)}
                            className="flex h-11 w-10 items-center justify-center text-white/70 transition hover:text-white"
                            aria-label={`Quitar una unidad de ${item.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-white">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.productId, item.qty + 1)}
                            className="flex h-11 w-10 items-center justify-center text-white/70 transition hover:text-white"
                            aria-label={`Agregar una unidad de ${item.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-white/10 px-5 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Subtotal · {unitsLabel(units)}</span>
                    <span className="text-lg font-bold tabular-nums text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/60">
                    El envío se coordina por WhatsApp según destino.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPhase('checkout')}
                    className="mt-4 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-4 text-sm font-bold text-ink transition hover:bg-whatsapp-hi"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Finalizar por WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="mt-2 min-h-11 w-full text-sm font-semibold text-white/70 transition hover:text-white"
                  >
                    Seguir comprando
                  </button>
                </footer>
              </>
            )}

            {phase === 'checkout' && items.length > 0 && (
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <button
                  type="button"
                  onClick={() => setPhase('cart')}
                  className="-ml-2 mb-3 inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/70 transition hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  Volver al carrito
                </button>
                <div className="mb-5 rounded-lg border border-white/10 bg-ink px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Total · {unitsLabel(units)}</span>
                    <span className="font-bold tabular-nums text-white">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <CheckoutForm
                  onSuccess={(number, waUrl) => {
                    setOrder({ number, waUrl });
                    setPhase('success');
                  }}
                />
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CartThumb({ item }: { item: { imageSrc?: string | null; imageHue: number } }) {
  return (
    <div
      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/8"
      style={{
        background: `radial-gradient(circle at 50% 55%, hsl(${item.imageHue} 55% 28% / 0.5), transparent 70%), #0d0d14`,
      }}
      aria-hidden
    >
      {item.imageSrc && <Image src={item.imageSrc} alt="" fill sizes="64px" className="object-contain p-1.5" />}
    </div>
  );
}
