import { Fragment } from 'react';
import { parseRichText, type InlinePart } from '@/lib/rich-text';

function Inline({ parts }: { parts: InlinePart[] }) {
  return (
    <>
      {parts.map((part, i) => {
        if (part.bold) return <strong key={i} className="font-semibold text-white">{part.text}</strong>;
        if (part.italic) return <em key={i}>{part.text}</em>;
        return <Fragment key={i}>{part.text}</Fragment>;
      })}
    </>
  );
}

// Descripción con negrita, cursiva y listas, tal como se escribió en Thaya.
export function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {parseRichText(text).map((block, i) => {
        if (block.kind === 'p') {
          return (
            <p key={i}>
              {block.lines.map((line, j) => (
                <Fragment key={j}>
                  {j > 0 && <br />}
                  <Inline parts={line} />
                </Fragment>
              ))}
            </p>
          );
        }
        const List = block.kind;
        return (
          <List key={i} className={block.kind === 'ul' ? 'list-disc space-y-1 pl-5 marker:text-white/40' : 'list-decimal space-y-1 pl-5 marker:text-white/50'}>
            {block.items.map((item, j) => (
              <li key={j} className="pl-1">
                <Inline parts={item} />
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
