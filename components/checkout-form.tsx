'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { submitOrder } from '@/actions/submit-order';
import { useCart } from '@/lib/cart/store';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

type Props = { onSuccess: (orderNumber: string) => void };

export function CheckoutForm({ onSuccess }: Props) {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const closeDrawer = useCart((s) => s.closeDrawer);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(fd: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await submitOrder({
        customer: {
          name: String(fd.get('name') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          city: String(fd.get('city') ?? ''),
          notes: String(fd.get('notes') ?? ''),
        },
        items,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      window.open(res.waUrl, '_blank', 'noopener');
      clear();
      closeDrawer();
      onSuccess(res.orderNumber);
    });
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <Field name="name" label="Nombre completo" placeholder="Carlos Mamani" required />
      <Field name="phone" label="Teléfono / WhatsApp" placeholder="+591 7 123 4567" required />
      <Field name="city" label="Ciudad o zona" placeholder="Potosí, Zona Centro" required />
      <Field name="notes" label="Notas (opcional)" placeholder="Ej: entregar por la tarde" />

      {error && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || items.length === 0}
        className="mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-white transition hover:bg-whatsapp-hi disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirmando…
          </>
        ) : (
          <>
            <WhatsAppIcon className="h-4 w-4" />
            Confirmar y abrir WhatsApp
          </>
        )}
      </button>
      <p className="text-center text-[0.65rem] text-white/50">
        Coordinamos pago y entrega por WhatsApp. No cobramos aquí.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/70">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-lynion-500 focus:outline-none"
      />
    </label>
  );
}
