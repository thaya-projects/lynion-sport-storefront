'use client';

import { motion } from 'motion/react';
import { Search, MessageSquare, CheckCircle2, Truck } from 'lucide-react';

const steps = [
  { n: 1, icon: Search, title: 'Elegís el producto', body: 'Sumá al carrito lo que necesites.' },
  { n: 2, icon: MessageSquare, title: 'Nos escribís', body: 'Enviás el carrito por WhatsApp.' },
  { n: 3, icon: CheckCircle2, title: 'Confirmamos precio', body: 'Verificamos stock y descuentos.' },
  { n: 4, icon: Truck, title: 'Coordinamos envío', body: 'Pago y entrega directo con vos.' },
];

export function WhatsAppProcess() {
  return (
    <section
      aria-labelledby="wa-process-title"
      className="relative mt-20 overflow-hidden rounded-3xl border border-white/8"
      style={{
        background:
          'linear-gradient(120deg, rgba(16,165,245,0.12) 0%, rgba(15,15,22,0.95) 45%, rgba(123,44,191,0.16) 100%)',
      }}
    >
      <div aria-hidden className="absolute -right-32 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
      <div aria-hidden className="absolute -left-32 -bottom-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative px-6 py-10 md:px-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-end md:gap-12">
          <div>
            <span className="text-[0.66rem] font-black uppercase tracking-[0.32em] text-primary">
              Comprar en Lynion
            </span>
            <h2
              id="wa-process-title"
              className="mt-3 font-display text-3xl font-black leading-[1.05] text-white md:text-[2.5rem]"
            >
              Es simple:
              <br />
              <span className="text-white/45">4 pasos y ya jugás.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Sin cuenta. Sin formularios largos. Sin pasarela de pago rara.
              Todo por WhatsApp con una persona real del otro lado.
            </p>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-7 hidden h-px bg-gradient-to-r from-primary/40 via-primary/20 to-accent/40 md:block"
            />

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.08, ease: 'easeOut' }}
                    className="relative flex flex-col items-start"
                  >
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
                      <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[0.62rem] font-black text-primary ring-1 ring-primary/40">
                        {s.n}
                      </span>
                    </div>
                    <p className="mt-4 text-sm font-bold text-white">{s.title}</p>
                    <p className="mt-1 text-[0.72rem] leading-snug text-white/55">{s.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
