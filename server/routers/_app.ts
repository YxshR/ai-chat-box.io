import { router } from '../trpc';
import { chatRouter } from './chat';
import { sessionRouter } from './session';

export const appRouter = router({
  chat: chatRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;