'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { submitOrder, type OrderField } from '@/actions/submit-order';
import { useCart } from '@/lib/cart/store';
import { cn } from '@/lib/utils';

type Props = { onSuccess: (orderNumber: string, waUrl: string) => void };

// No abre WhatsApp ni vacía el carrito: después de un await el navegador
// bloquea window.open (Safari en iPhone). El drawer muestra un enlace real y
// recién al tocarlo se vacía el carrito.
export function CheckoutForm({ onSuccess }: Props) {
  const items = useCart((s) => s.items);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<OrderField, string>>>({});

  function onSubmit(fd: FormData) {
    setError(null);
    setFieldErrors({});
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
        if (res.cart) useCart.getState().replaceItems(res.cart);
        setFieldErrors(res.fieldErrors ?? {});
        setError(res.error ?? null);
        return;
      }
      onSuccess(res.orderNumber, res.waUrl);
    });
  }

  return (
    // onSubmit y no action: con action, React vacía el formulario al terminar
    // y un error (o un precio corregido) obligaría a escribir todo de nuevo.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      noValidate
      className="space-y-4"
    >
      <Field
        name="name"
        label="Nombre completo"
        placeholder="Carlos Mamani"
        autoComplete="name"
        error={fieldErrors.name}
        required
      />
      <Field
        name="phone"
        label="Teléfono / WhatsApp"
        placeholder="71234567"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={fieldErrors.phone}
        required
      />
      <Field
        name="city"
        label="Ciudad o zona"
        placeholder="Potosí, Zona Centro"
        autoComplete="address-level2"
        error={fieldErrors.city}
        required
      />
      <Field name="notes" label="Notas (opcional)" placeholder="Ej.: entregar por la tarde" />

      {error && (
        <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || items.length === 0}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-4 text-sm font-bold text-ink transition hover:bg-primary-hi disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Preparando tu pedido…
          </>
        ) : (
          'Confirmar pedido'
        )}
      </button>
      <p className="text-center text-xs text-white/60">
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
  error,
  type = 'text',
  inputMode,
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  error?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/75">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-primary">
            *
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'min-h-11 w-full rounded-lg border bg-ink px-3 text-base text-white placeholder:text-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:text-sm',
          error ? 'border-red-400' : 'border-white/15 focus:border-primary',
        )}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
