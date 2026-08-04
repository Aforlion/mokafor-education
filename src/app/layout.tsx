import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mokafor Global Education | World-Class Learning Platform',
  description: 'Personalized tutoring, exam prep, self-paced courses, and comprehensive academic support worldwide.',
  robots: 'index, follow',
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
