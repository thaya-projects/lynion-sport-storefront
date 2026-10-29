'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NoPhoto } from '@/components/no-photo';
import { cn } from '@/lib/utils';

type Props = {
  images: string[];
  name: string;
  imageHue: number;
  discount: number | null;
};

// Galería de la ficha: las fotos que el negocio sube en Thaya, en el orden que
// devuelve la API (principal primero). En el celular se desliza con el dedo
// (scroll-snap nativo); en escritorio, flechas y miniaturas.
export function ProductGallery({ images, name, imageHue, discount }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = images.length;

  // La foto activa sale del scroll real, así deslizar, flechas y miniaturas
  // quedan siempre sincronizados.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count < 2) return;
    function onScroll() {
      if (!track) return;
      setActive(Math.round(track.scrollLeft / track.clientWidth));
    }
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [count]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const target = Math.max(0, Math.min(count - 1, index));
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollTo({ left: target * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    },
    [count],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(active - 1);
    }
  }

  const stageBackground = `radial-gradient(circle at 50% 55%, hsl(${imageHue} 55% 30% / 0.35), transparent 65%), #0d0d14`;

  if (count === 0) {
    return (
      <div
        className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-white/8 sm:aspect-square"
        style={{ background: stageBackground }}
      >
        <NoPhoto />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative overflow-hidden rounded-3xl border border-white/8"
        style={{ background: stageBackground }}
      >
        <div
          ref={trackRef}
          tabIndex={count > 1 ? 0 : undefined}
          onKeyDown={count > 1 ? onKeyDown : undefined}
          role={count > 1 ? 'region' : undefined}
          aria-roledescription={count > 1 ? 'carrusel' : undefined}
          aria-label={count > 1 ? `Fotos de ${name}. Usa las flechas para cambiar de foto.` : undefined}
          className="flex aspect-[5/4] snap-x sm:aspect-square snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, idx) => (
            <div
              key={`${idx}-${src}`}
              className="relative h-full w-full shrink-0 snap-center"
              aria-hidden={count > 1 && idx !== active ? true : undefined}
            >
              <Image
                src={src}
                alt={count > 1 ? `${name}, foto ${idx + 1} de ${count}` : name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority={idx === 0}
                className="object-contain p-6 md:p-10"
              />
            </div>
          ))}
        </div>

        {discount && (
          <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white md:left-5 md:top-5">
            -{discount}%
          </span>
        )}

        {count > 1 && (
          <>
            <span
              aria-hidden
              className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tabular-nums text-white md:hidden"
            >
              {active + 1} / {count}
            </span>
            <GalleryArrow side="left" disabled={active === 0} onClick={() => goTo(active - 1)} />
            <GalleryArrow side="right" disabled={active === count - 1} onClick={() => goTo(active + 1)} />
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, idx) => (
            <button
              key={`${idx}-${src}`}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Ver foto ${idx + 1} de ${count}`}
              aria-current={idx === active ? 'true' : undefined}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-ink-soft transition md:h-20 md:w-20',
                idx === active ? 'border-primary' : 'border-white/10 opacity-60 hover:opacity-100',
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryArrow({
  side,
  disabled,
  onClick,
}: {
  side: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'Foto anterior' : 'Foto siguiente'}
      className={cn(
        'absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-ink/70 text-white backdrop-blur transition hover:border-white/30 disabled:pointer-events-none disabled:opacity-0 md:flex',
        side === 'left' ? 'left-4' : 'right-4',
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
