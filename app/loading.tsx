import { LynionLogo } from '@/components/lynion-logo';

// Se muestra mientras una página espera los datos de Thaya. Aparece con un
// pequeño retraso (.page-loader en globals.css) para no parpadear cuando la
// respuesta llega rápido desde la caché.
export default function Loading() {
  return (
    <div role="status" className="page-loader flex min-h-dvh flex-col items-center justify-center gap-6 px-4">
      <LynionLogo priority className="page-loader-logo h-12 md:h-14" />
      <div aria-hidden className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <div className="page-loader-bar h-full w-1/3 rounded-full bg-primary" />
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
