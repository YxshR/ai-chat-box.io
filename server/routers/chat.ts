import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { generateSmartTitle } from '../../lib/utils/session-utils';
import { generateResponse } from '../../lib/gemini';
import { checkRateLimit, incrementRateLimit, getRateLimitStatus, resetRateLimit, getClientIP } from '../../lib/rate-limit';
import { getServerSession } from 'next-auth';
import { isAnonymousSession } from '../../lib/anonymous-session';
import { authOptions } from '../../lib/auth';
import { getResponseStats } from '../../lib/career-responses';

// Initialize Prisma with error handling
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  // Create a mock client for development when DB is not available
  prisma = {
    message: {
      count: async () => 0,
      findMany: async () => [],
      create: async (data: any) => ({ 
        id: `temp_${Date.now()}`, 
        ...data.data, 
        createdAt: new Date() 
      }),
      groupBy: async () => [],
    },
    chatSession: {
      update: async () => ({}),
    },
  } as any;
}

export const chatRouter = router({
  getRateLimitStatus: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const session = await getServerSession(authOptions)
        
        // Authenticated users have no rate limit
        if (session?.user) {
          return { remaining: -1 } // -1 indicates unlimited
        }
        
        // For anonymous users, check rate limit status
        const clientIP = getClientIP(ctx.req as Request)
        const { remaining } = await getRateLimitStatus(clientIP)
        
        return { remaining }
      } catch (error) {
        return { remaining: 3 } // Default to full limit on error
      }
    }),

  resetRateLimit: publicProcedure
    .mutation(async ({ ctx }) => {
      try {
        // Only allow in development
        if (process.env.NODE_ENV !== 'development') {
          throw new Error('Rate limit reset only available in development')
        }
        
        const clientIP = getClientIP(ctx.req as Request)
        await resetRateLimit(clientIP)
        
        return { success: true }
      } catch (error) {
        throw new Error('Failed to reset rate limit')
      }
    }),

  getAnalytics: publicProcedure
    .query(async () => {
      try {
        // Get message statistics from database
        const totalMessages = await prisma.message.count();
        const anonymousMessages = await prisma.message.count({
          where: { isAnonymous: true }
        });
        const aiResponses = await prisma.message.count({
          where: { 
            role: 'assistant',
            responseType: 'ai'
          }
        });
        const commonResponses = await prisma.message.count({
          where: { 
            role: 'assistant',
            responseType: 'common'
          }
        });

        // Get category breakdown
        const categoryStats = await prisma.message.groupBy({
          by: ['category'],
          where: {
            role: 'assistant',
            category: { not: null }
          },
          _count: true
        });

        // Get ML response system stats
        const mlStats = getResponseStats();

        return {
          totalMessages,
          anonymousMessages,
          authenticatedMessages: totalMessages - anonymousMessages,
          responseTypes: {
            ai: aiResponses,
            common: commonResponses,
            total: aiResponses + commonResponses
          },
          categories: categoryStats.reduce((acc, stat) => {
            if (stat.category) {
              acc[stat.category] = stat._count;
            }
            return acc;
          }, {} as Record<string, number>),
          mlSystem: mlStats,
          efficiency: {
            commonResponseRate: commonResponses / (aiResponses + commonResponses) * 100,
            apiSavings: commonResponses // Number of API calls saved
          }
        };
      } catch (error) {
        throw new Error('Failed to fetch analytics');
      }
    }),

  sendMessage: publicProcedure
    .input(z.object({
      content: z.string().min(1, 'Message cannot be empty'),
      sessionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions)
        const isAuthenticated = !!session?.user
        const isAnonymous = isAnonymousSession(input.sessionId)

        // Rate limiting for anonymous users only
        let rateLimitInfo: { remaining: number } | undefined
        if (!isAuthenticated && isAnonymous) {
          const clientIP = getClientIP(ctx.req as Request)
          const rateLimit = await checkRateLimit(clientIP)
          
          if (!rateLimit.allowed) {
            throw new Error('You\'ve reached the message limit for guests. Please sign in to continue chatting without limits.')
          }
          
          // If allowed, increment the counter and get remaining count
          rateLimitInfo = await incrementRateLimit(clientIP)
        }

        // Get client info for anonymous users (if needed for logging)
        // const clientIP = getClientIP(ctx.req as Request)
        // const userAgent = (ctx.req as Request).headers.get('user-agent') || 'unknown'

        // Get conversation history for context
        let conversationHistory: Array<{ role: string; content: string }> = []
        
        if (!isAnonymous) {
          // For authenticated users, get session-based history from database
          const previousMessages = await prisma.message.findMany({
            where: { sessionId: input.sessionId },
            orderBy: { createdAt: 'asc' },
            take: 10 // Last 10 messages for context
          })
          conversationHistory = previousMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
        // For anonymous users, no conversation history from database
        // The client handles conversation context through localStorage

        // Generate AI response using smart system
        const aiResponse = await generateResponse(input.content, conversationHistory);

        // Save messages to database only for authenticated users
        let dbUserMessage, dbAiMessage;
        
        if (!isAnonymous) {
          // Save user message to database (authenticated users only)
          dbUserMessage = await prisma.message.create({
            data: {
              content: input.content,
              role: 'user',
              sessionId: input.sessionId,
              isAnonymous: false,
            },
          });

          // Save AI response to database (authenticated users only)
          dbAiMessage = await prisma.message.create({
            data: {
              content: aiResponse.content,
              role: 'assistant',
              sessionId: input.sessionId,
              isAnonymous: false,
              responseType: aiResponse.responseType,
              category: aiResponse.category,
            },
          });
        } else {
          // For anonymous users, create temporary message objects without saving to DB
          dbUserMessage = {
            id: `temp_user_${Date.now()}`,
            content: input.content,
            role: 'user',
            createdAt: new Date(),
          };

          dbAiMessage = {
            id: `temp_ai_${Date.now()}`,
            content: aiResponse.content,
            role: 'assistant',
            createdAt: new Date(),
          };
        }

        // Update session title if this is the first message (authenticated users only)
        if (!isAnonymous) {
          const messageCount = await prisma.message.count({
            where: { sessionId: input.sessionId }
          });

          if (messageCount === 2) { // 2 because we just added user + AI message
            const rawMessages = await prisma.message.findMany({
              where: { sessionId: input.sessionId },
              orderBy: { createdAt: 'asc' },
            });
            
            // Convert Prisma messages to Message format
            const messages = rawMessages.map(msg => ({
              id: msg.id,
              content: msg.content,
              role: msg.role as 'user' | 'assistant',
              timestamp: msg.createdAt,
              sessionId: msg.sessionId || input.sessionId,
            }));
            
            await prisma.chatSession.update({
              where: { id: input.sessionId },
              data: { 
                title: generateSmartTitle(messages),
              },
            });
          }
        }

        const userMessage = {
          id: dbUserMessage.id,
          content: dbUserMessage.content,
          role: dbUserMessage.role,
          timestamp: dbUserMessage.createdAt,
          sessionId: input.sessionId,
        }

        const aiMessage = {
          id: dbAiMessage.id,
          content: dbAiMessage.content,
          role: dbAiMessage.role,
          timestamp: dbAiMessage.createdAt,
          sessionId: input.sessionId,
          responseType: aiResponse.responseType,
          category: aiResponse.category,
        }

        return {
          userMessage,
          aiMessage,
          rateLimitInfo
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to send message');
      }
    }),

  getMessages: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        // For anonymous sessions, return empty array since messages are handled client-side
        if (isAnonymousSession(input.sessionId)) {
          return [];
        }

        const messages = await prisma.message.findMany({
          where: {
            sessionId: input.sessionId,
          },
          orderBy: {
            createdAt: 'asc',
          },
        });

        return messages.map(message => ({
          id: message.id,
          content: message.content,
          role: message.role as 'user' | 'assistant',
          timestamp: message.createdAt,
          sessionId: message.sessionId,
        }));
      } catch (error) {
        throw new Error('Failed to fetch messages');
      }
    }),
});