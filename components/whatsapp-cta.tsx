import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  href: string;
  children: ReactNode;
  size?: Size;
  showArrow?: boolean;
  className?: string;
};

const sizes: Record<Size, { padding: string; text: string; icon: string; gap: string }> = {
  sm: { padding: 'px-3 py-2.5', text: 'text-xs', icon: 'h-3.5 w-3.5', gap: 'gap-2' },
  md: { padding: 'px-4 py-2', text: 'text-xs', icon: 'h-3.5 w-3.5', gap: 'gap-2' },
  lg: { padding: 'px-6 py-3', text: 'text-sm', icon: 'h-4 w-4', gap: 'gap-2.5' },
};

export function WhatsAppCTA({ href, children, size = 'lg', showArrow = false, className }: Props) {
  const s = sizes[size];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={cn(
        'group inline-flex items-center justify-center rounded-full bg-whatsapp font-semibold text-white transition hover:bg-whatsapp-hi',
        s.padding,
        s.text,
        s.gap,
        className,
      )}
    >
      <WhatsAppIcon className={s.icon} />
      {children}
      {showArrow && (
        <ArrowRight className={cn(s.icon, 'opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100')} />
      )}
    </a>
  );
}
