import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/session-provider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Faster text rendering
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AI Music Studio - Create Professional Music with AI',
  description: 'Generate studio-quality music with AI in seconds. Create custom tracks, instrumentals, and vocals for content creators, agencies, and musicians.',
  keywords: 'AI music, music generation, artificial intelligence, audio creation, music production',
  authors: [{ name: 'AI Music Studio' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'AI Music Studio - Create Professional Music with AI',
    description: 'Generate studio-quality music with AI in seconds',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Music Studio - Create Professional Music with AI',
    description: 'Generate studio-quality music with AI in seconds',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.sunoapi.com" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-white">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
