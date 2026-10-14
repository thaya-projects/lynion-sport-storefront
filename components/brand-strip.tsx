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
      className="relative mt-12 overflow-hidden rounded-2xl border border-white/8"
      style={{
        background:
          'linear-gradient(120deg, rgba(16,165,245,0.10) 0%, rgba(20,20,32,0.95) 45%, rgba(123,44,191,0.15) 100%)',
      }}
    >
      <div className="border-b border-white/5 px-6 py-3">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.32em] text-white/55">
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
                className="flex shrink-0 items-center gap-14 md:gap-20"
              >
                {/* SVG: next/image no lo optimiza, así que se usa <img> directo. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.file}
                  alt={isLoopCopy ? '' : `Logo ${brand.name}`}
                  loading="lazy"
                  decoding="async"
                  style={{ height: brand.height }}
                  className="w-auto opacity-80 transition duration-300 hover:opacity-100"
                />
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent/70" />
              </div>
            );
          })}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink via-ink/80 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink via-ink/80 to-transparent"
        />
      </div>
    </section>
  );
}
