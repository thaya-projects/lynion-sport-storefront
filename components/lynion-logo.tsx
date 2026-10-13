import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export function LynionLogo({ className }: Props) {
  return (
    <Image
      src="/logo/lynion-sport.png"
      alt="Lynion Sport"
      width={950}
      height={253}
      priority
      className={cn('h-11 w-auto md:h-12', className)}
    />
  );
}
