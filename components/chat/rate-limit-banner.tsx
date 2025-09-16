'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, User, Zap, Clock, Gift } from 'lucide-react'

interface RateLimitBannerProps {
  remainingMessages: number
  onSignIn: () => void
}

export function RateLimitBanner({ remainingMessages, onSignIn }: RateLimitBannerProps) {
  const { data: session } = useSession()

  if (session) return null

  const getMessageColor = (remaining: number) => {
    if (remaining === 0) return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
    if (remaining <= 2) return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950'
    return 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
  }

  const getIconColor = (remaining: number) => {
    if (remaining === 0) return 'text-red-600 dark:text-red-400'
    if (remaining <= 2) return 'text-orange-600 dark:text-orange-400'
    return 'text-amber-600 dark:text-amber-400'
  }

  const getTextColor = (remaining: number) => {
    if (remaining === 0) return 'text-red-800 dark:text-red-200'
    if (remaining <= 2) return 'text-orange-800 dark:text-orange-200'
    return 'text-amber-800 dark:text-amber-200'
  }

  const getButtonStyle = (remaining: number) => {
    if (remaining === 0) return 'border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900'
    if (remaining <= 2) return 'border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900'
    return 'border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900'
  }

  return (
    <Alert className={`mx-4 mb-4 ${getMessageColor(remainingMessages)} transition-all duration-300 animate-in slide-in-from-top-2`}>
      <div className="flex items-center gap-2">
        {remainingMessages === 0 ? (
          <AlertTriangle className={`h-4 w-4 ${getIconColor(remainingMessages)}`} />
        ) : remainingMessages <= 2 ? (
          <Clock className={`h-4 w-4 ${getIconColor(remainingMessages)}`} />
        ) : (
          <Gift className={`h-4 w-4 ${getIconColor(remainingMessages)}`} />
        )}
      </div>
      
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={getTextColor(remainingMessages)}>
            {remainingMessages > 0 ? (
              <>
                <span className="font-semibold">{remainingMessages}</span> free message{remainingMessages === 1 ? '' : 's'} remaining today
              </>
            ) : (
              'Daily message limit reached'
            )}
          </span>
          
          {remainingMessages > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs opacity-75">
              <Zap className="h-3 w-3" />
              <span>Sign in for unlimited access</span>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onSignIn}
          className={`ml-4 transition-all duration-200 hover:scale-105 ${getButtonStyle(remainingMessages)}`}
        >
          <User className="h-4 w-4 mr-2" />
          {remainingMessages === 0 ? 'Sign In to Continue' : 'Get Unlimited'}
        </Button>
      </AlertDescription>
    </Alert>
  )
}