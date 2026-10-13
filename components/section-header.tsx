import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  id?: string;
  title: string;
  linkHref?: string;
  linkLabel?: string;
};

export function SectionHeader({ id, title, linkHref, linkLabel }: Props) {
  return (
    <header className="flex items-end justify-between gap-4">
      <h2
        id={id}
        className="font-display text-3xl font-extrabold text-white md:text-4xl"
      >
        {title}
      </h2>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="hidden items-center gap-1.5 text-sm font-semibold text-lynion-500 hover:text-lynion-600 md:inline-flex"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </header>
  );
}
