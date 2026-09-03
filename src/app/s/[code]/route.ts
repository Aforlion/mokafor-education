import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /s/[code] - Shortlink redirect handler with click counter
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    const shortLink = await db.shortLink.findUnique({
      where: { code: code.toLowerCase() }
    })

    if (!shortLink) {
      // If code not found, redirect to main courses page
      return NextResponse.redirect(new URL('/courses', request.url))
    }

    // Asynchronously increment click count
    db.shortLink.update({
      where: { id: shortLink.id },
      data: { clicks: { increment: 1 } }
    }).catch(err => console.error('Failed to increment shortlink clicks:', err))

    // Determine target redirect URL
    let targetUrl = shortLink.targetUrl
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = new URL(targetUrl, request.url).toString()
    }

    return NextResponse.redirect(targetUrl, 307)
  } catch (error: any) {
    console.error('Error handling shortlink redirect:', error)
    return NextResponse.redirect(new URL('/courses', request.url))
  }
}
