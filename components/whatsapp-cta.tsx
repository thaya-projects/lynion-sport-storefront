import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';
// solid: la acción principal. outline: WhatsApp como alternativa, para que no
// compita con el botón principal de la sección.
type Variant = 'solid' | 'outline';

type Props = {
  href: string;
  children: ReactNode;
  size?: Size;
  variant?: Variant;
  showArrow?: boolean;
  className?: string;
};

// Todos los tamaños llegan a 44px de alto: es lo mínimo para tocar con el pulgar.
const sizes: Record<Size, { padding: string; text: string; icon: string; gap: string }> = {
  sm: { padding: 'min-h-11 px-4', text: 'text-xs', icon: 'h-3.5 w-3.5', gap: 'gap-2' },
  md: { padding: 'min-h-11 px-5', text: 'text-sm', icon: 'h-4 w-4', gap: 'gap-2' },
  lg: { padding: 'min-h-12 px-6', text: 'text-sm', icon: 'h-4 w-4', gap: 'gap-2.5' },
};

// Texto oscuro sobre el verde: el blanco no llega al contraste mínimo (2.3:1).
const variants: Record<Variant, { button: string; icon: string }> = {
  solid: { button: 'bg-whatsapp text-ink hover:bg-whatsapp-hi', icon: '' },
  outline: {
    button: 'border border-white/15 text-white hover:border-whatsapp/60 hover:bg-whatsapp/10',
    icon: 'text-whatsapp',
  },
};

export function WhatsAppCTA({
  href,
  children,
  size = 'lg',
  variant = 'solid',
  showArrow = false,
  className,
}: Props) {
  const s = sizes[size];
  const v = variants[variant];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={cn(
        'group inline-flex items-center justify-center rounded-full font-semibold transition',
        v.button,
        s.padding,
        s.text,
        s.gap,
        className,
      )}
    >
      <WhatsAppIcon className={cn(s.icon, v.icon)} />
      {children}
      {showArrow && (
        <ArrowRight className={cn(s.icon, 'opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100')} />
      )}
    </a>
  );
}
