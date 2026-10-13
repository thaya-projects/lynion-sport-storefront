import { Search, Menu, ArrowRight } from 'lucide-react';

type Tile = {
  name: string;
  hue: number;
  from: string;
  to: string;
};

const tiles: Tile[] = [
  { name: 'Fútbol', hue: 145, from: 'from-emerald-500', to: 'to-emerald-900' },
  { name: 'Futsal', hue: 35, from: 'from-amber-500', to: 'to-orange-900' },
  { name: 'Vóley', hue: 300, from: 'from-fuchsia-500', to: 'to-purple-900' },
  { name: 'Básquet', hue: 15, from: 'from-orange-500', to: 'to-red-900' },
];

export function PhoneMockup() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-8 rounded-full bg-lynion-500/20 blur-3xl"
      />

      <div className="relative w-[240px] rounded-[2.4rem] border-[9px] border-neutral-900 bg-neutral-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] md:w-[268px] md:rounded-[2.6rem]">
        <div className="absolute left-1/2 top-1.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black" />

        <div className="relative overflow-hidden rounded-[1.8rem] bg-ink-soft md:rounded-[2rem]">
          <div className="flex items-center justify-between px-5 pt-7 pb-1.5 text-[0.55rem] font-semibold text-white/90">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex items-end gap-[1px]">
                <div className="h-1 w-[2px] rounded-sm bg-white/85" />
                <div className="h-1.5 w-[2px] rounded-sm bg-white/85" />
                <div className="h-2 w-[2px] rounded-sm bg-white/85" />
                <div className="h-2.5 w-[2px] rounded-sm bg-white/85" />
              </div>
              <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 text-white/85">
                <path fill="currentColor" d="M8 3a10 10 0 0 1 7 2.8L14 7a8 8 0 0 0-12 0L1 5.8A10 10 0 0 1 8 3zm0 3a7 7 0 0 1 5 2l-1 1a5 5 0 0 0-8 0l-1-1a7 7 0 0 1 5-2zm0 3a4 4 0 0 1 3 1l-1 1a2 2 0 0 0-4 0L5 10a4 4 0 0 1 3-1zm0 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
              </svg>
              <div className="flex h-2.5 w-4 items-center rounded-[3px] border border-white/85 px-[1px]">
                <div className="h-1.5 w-full rounded-[1px] bg-white/85" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none">
                <defs>
                  <linearGradient id="phone-l-grad" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#29A8FF" />
                    <stop offset="55%" stopColor="#3B7BFF" />
                    <stop offset="100%" stopColor="#6B4AE6" />
                  </linearGradient>
                </defs>
                <path
                  d="M14 8 L14 30 L34 30"
                  stroke="url(#phone-l-grad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M20 30 L26 38 L40 18"
                  stroke="url(#phone-l-grad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <div className="flex flex-col leading-none">
                <span className="font-display text-[0.72rem] font-black text-white">
                  Lynion
                </span>
                <span className="text-[0.4rem] font-light uppercase tracking-[0.32em] text-white/70">
                  Sport
                </span>
              </div>
            </div>
            <Menu className="h-3.5 w-3.5 text-white/80" />
          </div>

          <div className="px-4 pt-4">
            <p className="font-display text-[1.35rem] font-black leading-none text-white">
              Tu deporte.
            </p>
            <p className="mt-1 font-display text-[1.35rem] font-black italic leading-none">
              <span className="gradient-text">Tu equipo.</span>
            </p>
          </div>

          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
              <span className="flex-1 text-[0.62rem] text-white/50">
                Buscar productos...
              </span>
              <Search className="h-3 w-3 text-white/60" />
            </div>
          </div>

          <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
            {tiles.map((t) => (
              <div
                key={t.name}
                className={`relative flex aspect-[1.15/1] flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br ${t.from} ${t.to} p-2`}
              >
                <div
                  className="h-6 w-6 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, hsl(${t.hue} 90% 78%), hsl(${t.hue} 80% 42%) 70%, hsl(${t.hue} 70% 22%))`,
                    boxShadow: 'inset -3px -4px 8px rgba(0,0,0,0.4)',
                  }}
                />
                <span className="text-[0.62rem] font-bold text-white">{t.name}</span>
              </div>
            ))}
          </div>

          <div className="px-4 pt-3 pb-4">
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-[0.6rem] font-black uppercase tracking-[0.16em] text-ink shadow-lg shadow-primary/40">
              Ver catálogo
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
