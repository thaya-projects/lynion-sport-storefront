// La descripción llega de Thaya con formato simple de texto:
//   **negrita**   *cursiva*   "- " viñetas   "1. " lista numerada
// Se convierte a bloques para dibujarlos con React (nunca como HTML crudo).

export type InlinePart = { text: string; bold?: boolean; italic?: boolean };
export type RichBlock =
  | { kind: 'p'; lines: InlinePart[][] }
  | { kind: 'ul' | 'ol'; items: InlinePart[][] };

const BULLET = /^\s*[-•]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;
const INLINE = /\*\*(?=\S)(.+?)(?<=\S)\*\*|(^|[^*\w])\*(?=\S)([^*]+?)(?<=\S)\*(?!\*)/g;

export function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (m[1] !== undefined) {
      if (start > last) parts.push({ text: text.slice(last, start) });
      parts.push({ text: m[1], bold: true });
    } else {
      const prefixEnd = start + m[2].length;
      if (prefixEnd > last) parts.push({ text: text.slice(last, prefixEnd) });
      parts.push({ text: m[3], italic: true });
    }
    last = start + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

export function parseRichText(source: string): RichBlock[] {
  const blocks: RichBlock[] = [];
  const lastBlock = (): RichBlock | undefined => blocks[blocks.length - 1];
  let open = false; // una línea vacía cierra el bloque actual
  for (const line of source.replace(/\r\n?/g, '\n').split('\n')) {
    const bullet = BULLET.exec(line);
    const numbered = bullet ? null : NUMBERED.exec(line);
    const prev = open ? lastBlock() : undefined;
    if (bullet || numbered) {
      const kind = bullet ? 'ul' : 'ol';
      const item = parseInline((bullet ?? numbered)![1]);
      if (prev && prev.kind === kind) prev.items.push(item);
      else blocks.push({ kind, items: [item] });
      open = true;
    } else if (!line.trim()) {
      open = false;
    } else {
      const content = parseInline(line.trim());
      if (prev && prev.kind === 'p') prev.lines.push(content);
      else blocks.push({ kind: 'p', lines: [content] });
      open = true;
    }
  }
  return blocks;
}

// Para SEO y datos estructurados: el texto sin marcas.
export function richTextToPlain(source: string): string {
  return source
    .split('\n')
    .map((line) => line.replace(BULLET, '$1').replace(NUMBERED, '$1'))
    .join('\n')
    .replace(/\*\*(?=\S)(.+?)(?<=\S)\*\*/g, '$1')
    .replace(/(^|[^*\w])\*(?=\S)([^*]+?)(?<=\S)\*(?!\*)/g, '$1$2');
}
