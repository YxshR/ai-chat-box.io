"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MessageCircle, Sparkles, Brain, Target, Zap, Crown, Gift } from "lucide-react";
import { signIn } from "next-auth/react";

interface RateLimitLoginPromptProps {
  onSignIn?: () => void;
  remainingMessages?: number;
}

export function RateLimitLoginPrompt({ onSignIn, remainingMessages = 0 }: RateLimitLoginPromptProps) {
  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      signIn();
    }
  };

  const benefits = [
    {
      icon: MessageCircle,
      title: "Unlimited Conversations",
      description: "Chat as much as you need without daily limits"
    },
    {
      icon: Brain,
      title: "Advanced AI Insights",
      description: "Get deeper, more personalized career guidance"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and track your career milestones"
    },
    {
      icon: Sparkles,
      title: "Premium Features",
      description: "Access exclusive tools and resources"
    }
  ];

  return (
    <div className="fixed bottom-4 left-2.5 right-2.5 z-50 mx-auto max-w-2xl">
      <div className="border border-border/50 bg-gradient-to-br from-background via-background to-primary/5 p-6 theme-transition rounded-xl shadow-2xl backdrop-blur-sm">
        {/* Header with animated icon */}
        <div className="text-center mb-6">
          <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 animate-pulse"></div>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Unlock Your Career Potential
          </h2>
          
          <p className="text-muted-foreground text-lg">
            {remainingMessages === 0 
              ? "You've reached your daily message limit. Sign in to continue your career journey!"
              : `${remainingMessages} messages remaining today. Sign in for unlimited access!`
            }
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card/80 transition-all duration-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Gift className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Limited Time Offer</span>
              </div>
              
              <Button
                onClick={handleSignIn}
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] mb-4"
                size="lg"
              >
                <User className="mr-2 h-5 w-5" />
                Sign In & Get Unlimited Access
                <Zap className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>100% Free Forever</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional context */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground/70">
            Join thousands of professionals advancing their careers with AI-powered guidance
          </p>
        </div>
      </div>
    </div>
  );
}