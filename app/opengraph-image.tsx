import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site';

export const alt = DEFAULT_OG_IMAGE.alt;
export const size = { width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height };
export const contentType = 'image/png';

// Colores de app/globals.css (@theme).
const INK = '#0a0a0a';
const PRIMARY = '#10a5f5';
const LYNION_600 = '#4b7bf5';
const ACCENT = '#7b2cbf';

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/logo/lynion-sport.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;
  const domain = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: INK,
          backgroundImage: `radial-gradient(circle at 15% 20%, ${PRIMARY}40, transparent 45%), radial-gradient(circle at 85% 85%, ${ACCENT}55, transparent 50%)`,
          color: '#f5f5f7',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={760} height={202} alt="" />
        <div style={{ marginTop: 48, fontSize: 40, fontWeight: 700, letterSpacing: -0.5 }}>
          Pelotas y equipamiento deportivo
        </div>
        <div style={{ marginTop: 14, fontSize: 28, color: 'rgba(245,245,247,0.65)' }}>
          Molten · Spalding · Mikasa · Adidas · Nike · Wilson — Envíos a todo Bolivia
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 10,
            backgroundImage: `linear-gradient(90deg, ${PRIMARY}, ${LYNION_600}, ${ACCENT})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 34,
            right: 48,
            fontSize: 24,
            color: 'rgba(245,245,247,0.5)',
          }}
        >
          {domain}
        </div>
      </div>
    ),
    size,
  );
}
