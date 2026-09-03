import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/shortlinks - Fetch all shortlinks with click analytics
export async function GET() {
  try {
    const shortLinks = await db.shortLink.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const totalClicks = shortLinks.reduce((acc: number, curr: any) => acc + (curr.clicks || 0), 0)

    return NextResponse.json({
      success: true,
      shortLinks,
      stats: {
        totalLinks: shortLinks.length,
        totalClicks
      }
    })
  } catch (error: any) {
    console.error('Error fetching shortlinks:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/admin/shortlinks - Generate shortlink for advertisement campaigns
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, courseId, targetUrl, campaign } = body

    if (!targetUrl) {
      return NextResponse.json({ success: false, error: 'Target URL is required' }, { status: 400 })
    }

    // Generate code if not provided
    let shortCode = code ? code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') : ''
    if (!shortCode) {
      shortCode = Math.random().toString(36).substring(2, 8)
    }

    // Ensure code uniqueness
    const existing = await db.shortLink.findUnique({
      where: { code: shortCode }
    })

    if (existing) {
      return NextResponse.json({ success: false, error: `Short code '${shortCode}' already exists` }, { status: 400 })
    }

    const shortLink = await db.shortLink.create({
      data: {
        code: shortCode,
        courseId: courseId || null,
        targetUrl,
        campaign: campaign || 'General Social Media',
        clicks: 0
      },
      include: {
        course: {
          select: { title: true, slug: true }
        }
      }
    })

    return NextResponse.json({ success: true, shortLink })
  } catch (error: any) {
    console.error('Error creating shortlink:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
