import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QUEET WEED - DEJA DE FUMAR MARIHUANA',
  description: 'APP PARA AYUDAR A DEJAR DE FUMAR MARIHUANA CON SEGUIMIENTO, CONSEJOS Y APOYO PERSONALIZADO',
  keywords: 'DEJAR DE FUMAR, MARIHUANA, CANNABIS, ADICCIÓN, RECUPERACIÓN, SALUD',
  authors: [{ name: 'QUEET WEED TEAM' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'QUEET WEED',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="QUEET WEED" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-orientations" content="portrait" />
        <link rel="apple-touch-startup-image" href="/icon.svg" />
      </head>
      <body className="font-mono bg-black text-white">
        <div className="min-h-screen bg-black">
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#000000',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '0px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              },
            }}
          />
        </div>
      </body>
    </html>
  )
}
