"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, Zap, Shield, Sparkles, Users, Brain, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <GradientBackground />
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI Chat
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/chat">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Try Demo
                </Button>
              </Link>
              <Link href="/chat">
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Intelligent
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Conversations
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
              Experience the future of AI-powered conversations with our premium chat platform. 
              Built with cutting-edge technology for seamless, intelligent, and secure interactions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
              <Link href="/chat">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-xl text-lg px-8 py-6 transform hover:scale-105 transition-all duration-200">
                  Start Chatting
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-2 hover:border-primary/50 transform hover:scale-105 transition-all duration-200"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose Our AI Chat Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern technologies and designed for the best user experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 premium-card group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Optimized performance with real-time responses, virtualized message lists, and intelligent caching for seamless conversations.
              </p>
            </Card>
            
            <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 premium-card group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
              <p className="text-muted-foreground leading-relaxed">
                Enterprise-grade security with NextAuth integration, rate limiting, and privacy-focused design to protect your conversations.
              </p>
            </Card>
            
            <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 premium-card group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered</h3>
              <p className="text-muted-foreground leading-relaxed">
                Powered by Google's Gemini AI with intelligent career counseling, contextual responses, and advanced natural language processing.
              </p>
            </Card>
            
            <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 premium-card group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">User-Centric</h3>
              <p className="text-muted-foreground leading-relaxed">
                Designed with accessibility in mind, featuring keyboard navigation, screen reader support, and mobile-optimized interactions.
              </p>
            </Card>
            
            <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 premium-card group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Modern Stack</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built with Next.js 15, React 19, TypeScript, Prisma, and tRPC for a robust, scalable, and maintainable architecture.
              </p>
            </Card>
            
            <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 premium-card group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Rich Experience</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced features including session management, typing indicators, error handling, and seamless theme switching.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">&lt;100ms</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built with Premium Technologies
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive overview of the technologies and features powering this platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Core Technologies</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-lg"><strong>Next.js 15</strong> - Latest React framework with App Router</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-lg"><strong>React 19</strong> - Cutting-edge React features</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-lg"><strong>TypeScript</strong> - Type-safe development</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-lg"><strong>Tailwind CSS</strong> - Modern utility-first styling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-lg"><strong>tRPC</strong> - End-to-end type safety</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-lg"><strong>Prisma</strong> - Modern database toolkit</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-6">Advanced Features</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-lg">Real-time message streaming</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-lg">Virtualized message lists for performance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-lg">Comprehensive accessibility support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-lg">Mobile-optimized interactions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-lg">Dark/light theme switching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-lg">Advanced error handling & recovery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what developers are saying about our AI chat platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "The performance is incredible. Real-time responses and the UI is so smooth. 
                This is exactly what modern AI chat should feel like."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">A</span>
                </div>
                <div>
                  <div className="font-semibold">Alex Chen</div>
                  <div className="text-sm text-muted-foreground">Frontend Developer</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "Amazing accessibility features and mobile optimization. 
                The attention to detail in the UX is outstanding."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">S</span>
                </div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">UX Designer</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "The tech stack is impressive. Next.js 15, React 19, TypeScript - 
                everything is cutting-edge and well implemented."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">M</span>
                </div>
                <div>
                  <div className="font-semibold">Mike Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Full Stack Developer</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our AI chat platform
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 border-2 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3">What makes this AI chat platform different?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our platform is built with the latest technologies including Next.js 15, React 19, and TypeScript. 
                We focus on performance, accessibility, and user experience with features like real-time streaming, 
                virtualized message lists, and comprehensive mobile optimization.
              </p>
            </Card>
            
            <Card className="p-6 border-2 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3">Is my data secure and private?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes, we implement enterprise-grade security with NextAuth integration, rate limiting, 
                and privacy-focused design. Your conversations are protected with industry-standard encryption 
                and security practices.
              </p>
            </Card>
            
            <Card className="p-6 border-2 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3">What AI model powers the conversations?</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use Google's Gemini AI for intelligent, contextual responses. The platform also includes 
                specialized features for career counseling and professional development guidance.
              </p>
            </Card>
            
            <Card className="p-6 border-2 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3">Is the platform accessible?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Absolutely! We've built comprehensive accessibility features including keyboard navigation, 
                screen reader support, high contrast mode, and mobile-optimized interactions to ensure 
                everyone can use our platform effectively.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the power of intelligent AI conversations.
          </p>
          <Link href="/chat">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-xl text-lg px-12 py-6">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">AI Chat</span>
            </div>
            <div className="text-muted-foreground">
              <p>&copy; 2024 AI Chat Platform. Built with ❤️ using modern web technologies.</p>
            </div>
          </div>
        </div>
      </footer>
      
      <ScrollToTop />
    </div>
  );
}
