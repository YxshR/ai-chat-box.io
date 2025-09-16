import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../../server/routers/_app';
import type { Context } from '../../../../server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: (): Context => ({
      req: req as any, // Cast to NextRequest type
    }),
  });

export { handler as GET, handler as POST };