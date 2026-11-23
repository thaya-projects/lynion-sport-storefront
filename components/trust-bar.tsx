import { ShieldCheck, Truck, Headset } from 'lucide-react';

const props = [
  { icon: ShieldCheck, title: 'Originales', subtitle: 'Distribuidor autorizado' },
  { icon: Truck, title: 'Envíos', subtitle: 'A todo Bolivia' },
  { icon: Headset, title: 'Atención', subtitle: 'Directa por WhatsApp' },
];

export function TrustBar() {
  return (
    <section aria-label="Beneficios Lynion Sport" className="mt-6">
      <div className="grid grid-cols-1 divide-y divide-white/8 rounded-2xl border border-white/8 bg-ink-soft/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {props.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="flex items-center gap-3 px-5 py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{p.title}</p>
                <p className="text-xs text-white/70">{p.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
