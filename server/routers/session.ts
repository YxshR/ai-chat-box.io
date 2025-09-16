import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export const sessionRouter = router({
  getAllSessions: publicProcedure
    .query(async () => {
      try {
        // Check if user is authenticated
        const session = await getServerSession();
        
        // For anonymous users, return empty array since sessions are handled client-side
        if (!session?.user) {
          return [];
        }

        // For authenticated users, fetch from database
        const sessions = await prisma.chatSession.findMany({
          where: {
            userId: (session.user as any).id
          },
          include: {
            _count: {
              select: { messages: true }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        const dbSessions = sessions.map(session => ({
          id: session.id,
          title: session.title,
          createdAt: session.createdAt,
          updatedAt: session.createdAt, // Using createdAt as updatedAt for now
          messageCount: session._count.messages,
        }));

        return dbSessions;
      } catch (error) {
        throw new Error('Failed to fetch sessions');
      }
    }),

  createSession: publicProcedure
    .input(z.object({
      title: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Check if user is authenticated
        const userSession = await getServerSession();
        
        // For anonymous users, return a client-side session ID
        if (!userSession?.user) {
          const anonymousSessionId = `anon_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          return {
            id: anonymousSessionId,
            title: input.title || 'New Chat',
            createdAt: new Date(),
            updatedAt: new Date(),
            messageCount: 0,
          };
        }

        // For authenticated users, create in database
        const session = await prisma.chatSession.create({
          data: {
            title: input.title || 'New Chat',
            userId: (userSession.user as any).id,
          },
          include: {
            _count: {
              select: { messages: true }
            }
          }
        });

        return {
          id: session.id,
          title: session.title,
          createdAt: session.createdAt,
          updatedAt: session.createdAt,
          messageCount: session._count.messages,
        };
      } catch (error) {
        throw new Error('Failed to create session');
      }
    }),

  deleteSession: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Delete all messages in the session first
        await prisma.message.deleteMany({
          where: {
            sessionId: input.sessionId
          }
        });

        // Then delete the session
        await prisma.chatSession.delete({
          where: {
            id: input.sessionId
          }
        });

        return { success: true };
      } catch (error) {
        throw new Error('Failed to delete session');
      }
    }),
});