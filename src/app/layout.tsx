import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import './globals.css'

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const heading = Syne({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['600', '700', '800'],
})

const SITE_URL = 'https://gayduosa.org'
const ORG_NAME = 'Gayduo Sports Academy'
const DESCRIPTION =
  'Gayduo Sports Academy is a non-governmental organisation empowering youth in Monrovia, Liberia through sport, education, and healthcare.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${ORG_NAME} | Monrovia, Liberia`,
    template: `%s | ${ORG_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    'Gayduo Sports Academy',
    'sports NGO Liberia',
    'youth sport Monrovia',
    'Liberia football academy',
    'NGO Monrovia',
    'youth development Liberia',
    'sport for development Africa',
    'Liberia education sport',
  ],
  authors: [{ name: ORG_NAME, url: SITE_URL }],
  creator: ORG_NAME,
  publisher: ORG_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: ORG_NAME,
    title: `${ORG_NAME} | Sport, Education & Health in Monrovia, Liberia`,
    description: DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg', // Add a 1200×630 OG image to /public when available
        width: 1200,
        height: 630,
        alt: `${ORG_NAME} — Monrovia, Liberia`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${ORG_NAME} | Sport, Education & Health`,
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/favicon.png', type: 'image/png' }],
    shortcut: '/favicon.png',
  },
  verification: {
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
