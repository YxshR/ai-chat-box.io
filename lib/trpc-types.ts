import type { AppRouter } from '../server/routers/_app';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

// Infer the types from the tRPC router
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Chat router types
export type SendMessageInput = RouterInputs['chat']['sendMessage'];
export type SendMessageOutput = RouterOutputs['chat']['sendMessage'];
export type GetMessagesInput = RouterInputs['chat']['getMessages'];
export type GetMessagesOutput = RouterOutputs['chat']['getMessages'];

// Session router types
export type GetAllSessionsOutput = RouterOutputs['session']['getAllSessions'];
export type CreateSessionInput = RouterInputs['session']['createSession'];
export type CreateSessionOutput = RouterOutputs['session']['createSession'];
export type DeleteSessionInput = RouterInputs['session']['deleteSession'];
export type DeleteSessionOutput = RouterOutputs['session']['deleteSession'];

// Utility types for common operations
export type SessionFromAPI = CreateSessionOutput;
export type SessionListFromAPI = GetAllSessionsOutput;