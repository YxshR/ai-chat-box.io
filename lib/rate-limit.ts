import { prisma } from './prisma'

const ANONYMOUS_LIMIT = parseInt(process.env.ANONYMOUS_REQUEST_LIMIT || '3')
const RESET_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function checkRateLimit(ipAddress: string): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date()
  const resetTime = new Date(now.getTime() + RESET_INTERVAL)

  // Find or create anonymous request record
  let record = await prisma.anonymousRequest.findUnique({
    where: { ipAddress }
  })

  if (!record) {
    // Create new record with count 0 (will be incremented when message is actually sent)
    record = await prisma.anonymousRequest.create({
      data: {
        ipAddress,
        count: 0,
        resetAt: resetTime
      }
    })
    return { allowed: true, remaining: ANONYMOUS_LIMIT }
  }

  // Check if reset time has passed
  if (now > record.resetAt) {
    // Reset the counter
    record = await prisma.anonymousRequest.update({
      where: { ipAddress },
      data: {
        count: 0,
        resetAt: resetTime
      }
    })
    return { allowed: true, remaining: ANONYMOUS_LIMIT }
  }

  // Check if limit exceeded
  if (record.count >= ANONYMOUS_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  return { 
    allowed: true, 
    remaining: ANONYMOUS_LIMIT - record.count 
  }
}

export async function incrementRateLimit(ipAddress: string): Promise<{ remaining: number }> {
  const now = new Date()
  const resetTime = new Date(now.getTime() + RESET_INTERVAL)

  // Find or create anonymous request record
  let record = await prisma.anonymousRequest.findUnique({
    where: { ipAddress }
  })

  if (!record) {
    // Create new record
    record = await prisma.anonymousRequest.create({
      data: {
        ipAddress,
        count: 1,
        resetAt: resetTime
      }
    })
    return { remaining: ANONYMOUS_LIMIT - 1 }
  }

  // Check if reset time has passed
  if (now > record.resetAt) {
    // Reset the counter
    record = await prisma.anonymousRequest.update({
      where: { ipAddress },
      data: {
        count: 1,
        resetAt: resetTime
      }
    })
    return { remaining: ANONYMOUS_LIMIT - 1 }
  }

  // Increment counter
  record = await prisma.anonymousRequest.update({
    where: { ipAddress },
    data: {
      count: record.count + 1
    }
  })

  return { 
    remaining: ANONYMOUS_LIMIT - record.count 
  }
}

export async function getRateLimitStatus(ipAddress: string): Promise<{ remaining: number }> {
  const now = new Date()

  // Find anonymous request record
  const record = await prisma.anonymousRequest.findUnique({
    where: { ipAddress }
  })

  if (!record) {
    return { remaining: ANONYMOUS_LIMIT }
  }

  // Check if reset time has passed
  if (now > record.resetAt) {
    return { remaining: ANONYMOUS_LIMIT }
  }

  return { 
    remaining: Math.max(0, ANONYMOUS_LIMIT - record.count)
  }
}

export async function resetRateLimit(ipAddress: string): Promise<void> {
  try {
    await prisma.anonymousRequest.delete({
      where: { ipAddress }
    })
  } catch (error) {
    // Ignore if record doesn't exist
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}