import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Mokafor Global Education | World-Class Learning Platform',
    template: '%s | Mokafor Global Education'
  },
  description: 'Personalized 1-on-1 tutoring, Loyola & Junior WAEC entrance bootcamps, recorded video courses, and global university scholarship placements.',
  keywords: ['Mokafor Education', 'Loyola Jesuit Entrance Prep', 'Junior WAEC BECE', 'WAEC Mathematics', 'IGCSE Physics', 'Tutor Nigeria', 'SAT Prep Lagos'],
  authors: [{ name: 'Mark Okafor', url: 'https://www.mokafor.com' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://www.mokafor.com',
    title: 'Mokafor Global Education | World-Class Learning Platform',
    description: 'Personalized 1-on-1 tutoring, entrance bootcamps, self-paced courses, and comprehensive academic support worldwide.',
    siteName: 'Mokafor Global Education',
    images: [
      {
        url: 'https://www.mokafor.com/founder.jpg',
        width: 1200,
        height: 630,
        alt: 'Mark Okafor - Mokafor Global Education',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mokafor Global Education | World-Class Learning Platform',
    description: 'Personalized 1-on-1 tutoring, entrance bootcamps, and self-paced video courses.',
    creator: '@MarkOkafor1',
    images: ['https://www.mokafor.com/founder.jpg'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <main id="app-root">{children}</main>
      </body>
    </html>
  )
}
