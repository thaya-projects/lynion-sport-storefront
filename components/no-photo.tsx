import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Para productos que todavía no tienen foto cargada en el sistema.
export function NoPhoto({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50',
        className,
      )}
    >
      <ImageOff className="h-8 w-8" aria-hidden />
      <span className="text-xs font-semibold uppercase tracking-[0.16em]">Sin foto</span>
    </div>
  );
}
