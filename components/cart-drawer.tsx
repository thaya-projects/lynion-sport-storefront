'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag, Check } from 'lucide-react';
import { cartSubtotal, useCart } from '@/lib/cart/store';
import { formatPrice } from '@/lib/format';
import { CheckoutForm } from '@/components/checkout-form';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

export function CartDrawer() {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const closeDrawer = useCart((s) => s.closeDrawer);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const [phase, setPhase] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Al cerrar el drawer, si estábamos en "success" volvemos al carrito
      // (vacío) para que la próxima apertura no muestre el mensaje viejo.
      const t = setTimeout(() => {
        setPhase('cart');
        setOrderNumber(null);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const subtotal = cartSubtotal(items);

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="ml-auto flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-soft"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Carrito de compras"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-lynion-500" />
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                  {phase === 'success' ? 'Pedido confirmado' : phase === 'checkout' ? 'Tus datos' : `Tu carrito (${items.length})`}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Cerrar carrito"
                className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {phase === 'success' && orderNumber && (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp">
                  <Check className="h-8 w-8 text-white" strokeWidth={3} />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold text-white">
                  ¡Listo, {orderNumber}!
                </h3>
                <p className="mt-3 text-sm text-white/70">
                  Te llevamos a WhatsApp para coordinar el pago y la entrega.
                  Si no se abrió automáticamente, revisá tu app.
                </p>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="mt-8 rounded-lg border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white/40"
                >
                  Seguir viendo productos
                </button>
              </div>
            )}

            {phase !== 'success' && items.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="h-10 w-10 text-white/30" />
                <p className="mt-4 text-sm text-white/60">Tu carrito está vacío.</p>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="mt-6 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-ink transition hover:bg-primary-hi"
                >
                  Explorar catálogo
                </button>
              </div>
            )}

            {phase === 'cart' && items.length > 0 && (
              <>
                <ul className="flex-1 divide-y divide-white/5 overflow-y-auto px-5">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-3 py-4">
                      <div
                        className="h-16 w-16 shrink-0 rounded-lg"
                        style={{
                          background: `radial-gradient(circle at 35% 35%, hsl(${item.imageHue} 80% 65%), hsl(${item.imageHue} 70% 30%) 70%, #0f0f14)`,
                        }}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/50">
                          {item.brand}
                        </p>
                        <p className="line-clamp-2 text-sm font-medium text-white">{item.name}</p>
                        <p className="mt-1 text-sm font-bold text-white">
                          {formatPrice(item.price * item.qty)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          type="button"
                          onClick={() => remove(item.productId)}
                          aria-label="Quitar del carrito"
                          className="text-white/40 transition hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-1 rounded-lg border border-white/10">
                          <button
                            type="button"
                            onClick={() => setQty(item.productId, item.qty - 1)}
                            className="p-1.5 text-white/70 transition hover:text-white"
                            aria-label="Disminuir"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold text-white">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.productId, item.qty + 1)}
                            className="p-1.5 text-white/70 transition hover:text-white"
                            aria-label="Aumentar"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-white/10 px-5 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-lg font-bold text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[0.65rem] text-white/40">
                    El envío se coordina por WhatsApp según destino.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPhase('checkout')}
                    className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-white transition hover:bg-whatsapp-hi"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Finalizar por WhatsApp
                  </button>
                </footer>
              </>
            )}

            {phase === 'checkout' && items.length > 0 && (
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <button
                  type="button"
                  onClick={() => setPhase('cart')}
                  className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/60 transition hover:text-white"
                >
                  ← Volver al carrito
                </button>
                <div className="mb-4 rounded-lg border border-white/10 bg-ink px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Total ({items.length} productos)</span>
                    <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <CheckoutForm
                  onSuccess={(n) => {
                    setOrderNumber(n);
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
