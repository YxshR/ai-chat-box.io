import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { NextRequest } from 'next/server';

// Define the context type
export interface Context {
  req?: NextRequest;
}

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;