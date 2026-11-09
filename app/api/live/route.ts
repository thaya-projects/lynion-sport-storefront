import { CATALOG_CHANGED, storefrontLive } from '@/lib/live-updates';

export const dynamic = 'force-dynamic';

const HEARTBEAT_MS = 25_000;

// Server-Sent Events: cada página abierta queda conectada aquí y recibe un
// evento cuando Thaya avisa un cambio, para refrescarse sin recargar.
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          cleanup();
        }
      };
      const onChange = () => send(`event: ${CATALOG_CHANGED}\ndata: ${Date.now()}\n\n`);
      // Comentario vacío: mantiene viva la conexión a través de proxies.
      const heartbeat = setInterval(() => send(': ping\n\n'), HEARTBEAT_MS);

      storefrontLive.on(CATALOG_CHANGED, onChange);
      cleanup = () => {
        clearInterval(heartbeat);
        storefrontLive.off(CATALOG_CHANGED, onChange);
      };
      request.signal.addEventListener('abort', () => {
        cleanup();
        try {
          controller.close();
        } catch {}
      });

      send('retry: 5000\n\n');
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
