'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [])

  if (!providers) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Sign in to continue your conversations and get unlimited access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.values(providers).map((provider: any) => (
            <Button
              key={provider.name}
              onClick={() => signIn(provider.id, { callbackUrl: '/chat' })}
              className="w-full"
              variant="outline"
            >
              Sign in with {provider.name}
            </Button>
          ))}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Anonymous users get 3 free messages per day</p>
            <p>Sign in for unlimited conversations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}