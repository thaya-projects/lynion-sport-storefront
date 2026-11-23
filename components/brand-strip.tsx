type Brand = { name: string; file: string; height: number };

const brands: Brand[] = [
  { name: 'Molten', file: '/brands/molten.svg', height: 40 },
  { name: 'Spalding', file: '/brands/spalding.svg', height: 34 },
  { name: 'Mikasa', file: '/brands/mikasa.svg', height: 36 },
  { name: 'Adidas', file: '/brands/adidas.svg', height: 38 },
  { name: 'Nike', file: '/brands/nike.svg', height: 32 },
  { name: 'Wilson', file: '/brands/wilson.svg', height: 34 },
];

export function BrandStrip() {
  return (
    <section
      aria-label="Marcas oficiales que trabajamos"
      className="relative mt-12 overflow-hidden rounded-2xl border border-white/8 bg-ink-soft"
    >
      <div className="border-b border-white/5 px-6 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">
          Marcas oficiales que trabajamos
        </p>
      </div>

      <div className="relative py-7 md:py-8">
        <div className="marquee flex items-center gap-14 whitespace-nowrap px-6 md:gap-20">
          {/* La segunda vuelta solo existe para el loop visual del marquee:
              se oculta a lectores de pantalla y buscadores. */}
          {[...brands, ...brands].map((brand, idx) => {
            const isLoopCopy = idx >= brands.length;
            return (
              <div
                key={`${brand.name}-${idx}`}
                aria-hidden={isLoopCopy || undefined}
                data-loop-copy={isLoopCopy || undefined}
                className="flex shrink-0 items-center gap-14 md:gap-20"
              >
                {/* SVG: next/image no lo optimiza, así que se usa <img> directo.
                    Los logos vienen en color oscuro: se pasan a blanco para leerse sobre negro. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.file}
                  alt={isLoopCopy ? '' : `Logo ${brand.name}`}
                  loading="lazy"
                  decoding="async"
                  style={{ height: brand.height }}
                  className="w-auto opacity-75 brightness-0 invert transition duration-300 hover:opacity-100"
                />
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent/70" />
              </div>
            );
          })}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-soft to-transparent motion-reduce:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-soft to-transparent motion-reduce:hidden"
        />
      </div>
    </section>
  );
}
