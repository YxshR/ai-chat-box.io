import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "../components/providers/trpc-provider";
import { ThemeProvider } from "../components/providers/theme-provider";
import { AuthSessionProvider } from "../components/providers/session-provider";
import { ErrorBoundary } from "../components/error/error-boundary";
import { PerformanceMonitor } from "../components/performance/performance-monitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Chat - Intelligent Conversations",
    template: "%s | AI Chat"
  },
  description: "Experience the future of AI-powered conversations with our premium chat platform. Built with cutting-edge technology for seamless, intelligent, and secure interactions.",
  keywords: [
    "AI chat", 
    "artificial intelligence", 
    "chat platform", 
    "intelligent conversations",
    "AI assistant", 
    "machine learning", 
    "natural language processing",
    "conversational AI",
    "smart chat"
  ],
  authors: [{ name: "AI Chat Team" }],
  creator: "AI Chat Platform",
  publisher: "AI Chat Platform",
  category: "Technology",
  classification: "AI Chat Platform",
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-chat.app",
    siteName: "AI Chat Platform",
    title: "AI Chat - Intelligent Conversations",
    description: "Experience the future of AI-powered conversations with our premium chat platform. Built with cutting-edge technology for seamless, intelligent, and secure interactions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Chat - Intelligent Conversations",
        type: "image/png",
      }
    ],
  },
  
  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    site: "@aichat",
    creator: "@aichat",
    title: "AI Chat - Intelligent Conversations",
    description: "Experience the future of AI-powered conversations with our premium chat platform. Built with cutting-edge technology for seamless, intelligent, and secure interactions.",
    images: ["/twitter-image.png"],
  },
  
  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  
  // App metadata
  applicationName: "AI Chat Platform",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL('https://ai-chat.app'),
  
  // Manifest
  manifest: "/manifest.json",
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
    ],
  },
  
  // Additional tags
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Fonts are loaded via Next.js font optimization */}
        
        {/* Security headers - X-Frame-Options removed as it should be set via HTTP headers only */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance hints */}
        <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI Chat Platform",
              "description": "Premium AI-powered chat platform for intelligent conversations",
              "url": "https://ai-chat.app",
              "applicationCategory": "CommunicationApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "AI Chat Team"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PerformanceMonitor />
        <AuthSessionProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <TRPCProvider>
                {children}
              </TRPCProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
