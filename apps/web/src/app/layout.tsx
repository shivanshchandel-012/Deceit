import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { APP_CONFIG } from '@deceit/config';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});
const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#050505',
};

export const metadata: Metadata = {
  title: APP_CONFIG.seo.title,
  description: APP_CONFIG.description,
  keywords: [...APP_CONFIG.seo.keywords],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DECEIT',
  },
  openGraph: {
    title: APP_CONFIG.seo.title,
    description: APP_CONFIG.description,
    type: 'website',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${display.variable} dark`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#050505] text-white font-sans antialiased overflow-x-hidden">
        <main className="relative z-10 min-h-dvh flex flex-col">
          {children}
        </main>
        <ServiceWorkerRegistration />
        <Analytics />
      </body>
    </html>
  );
}
