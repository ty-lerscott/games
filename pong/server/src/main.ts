import rooms from '@/routes/rooms.ts';
import logger from '@/helpers/logger.ts'
import healthCheck from '@/routes/health.ts';
import websocket from '@/routes/websocket.ts';

const started = Date.now();

Deno.serve({port: 4000}, (req: Request) => {
  const {pathname} = new URL(req.url);

  logger(req);

  switch(pathname) {
    case '/health':
      return healthCheck(req, started);
    case '/rooms':
      return rooms(req);
    case "/game-socket":
      return websocket(req);
    default:
      return new Response('Not Found', {status: 404});
  }
})