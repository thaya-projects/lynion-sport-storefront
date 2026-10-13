import { ShieldCheck, Truck, Headset, RefreshCcw } from 'lucide-react';

const props = [
  { icon: ShieldCheck, title: 'Originales', subtitle: 'Distribuidor autorizado' },
  { icon: Truck, title: 'Envíos', subtitle: 'A todo Bolivia' },
  { icon: Headset, title: 'Atención', subtitle: 'Directa por WhatsApp' },
  { icon: RefreshCcw, title: 'Cambios', subtitle: 'Hasta 15 días' },
];

export function TrustBar() {
  return (
    <section aria-label="Beneficios Lynion Sport" className="mt-6">
      <div className="grid grid-cols-2 divide-y divide-white/8 rounded-2xl border border-white/8 bg-ink-soft/60 md:grid-cols-4 md:divide-x md:divide-y-0">
        {props.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="flex items-center gap-3 px-5 py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{p.title}</p>
                <p className="text-[0.7rem] text-white/50">{p.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
