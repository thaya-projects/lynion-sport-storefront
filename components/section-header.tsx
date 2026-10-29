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
        className="font-display text-2xl font-extrabold text-white sm:text-3xl md:text-4xl"
      >
        {title}
      </h2>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-hi"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </header>
  );
}
