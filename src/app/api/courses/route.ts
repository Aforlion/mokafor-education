import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/courses - List all published courses with modules & video listings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const featured = searchParams.get('featured')

    const where: any = {
      isPublished: true
    }

    if (category && category !== 'All') {
      where.category = category
    }

    if (level && level !== 'All') {
      where.level = level
    }

    if (featured === 'true') {
      where.featured = true
    }

    const courses = await db.course.findMany({
      where,
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            videos: {
              orderBy: { order: 'asc' }
            }
          }
        },
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, courses })
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/courses - Create a new video course (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, subtitle, description, thumbnailUrl, level, category, price, discountPrice, featured } = body

    if (!title || !description || price === undefined) {
      return NextResponse.json({ success: false, error: 'Title, description, and price are required' }, { status: 400 })
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    const course = await db.course.create({
      data: {
        slug,
        title,
        subtitle: subtitle || null,
        description,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        level: level || 'General',
        category: category || 'Mathematics',
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        featured: featured || false,
        isPublished: true
      }
    })

    return NextResponse.json({ success: true, course })
  } catch (error: any) {
    console.error('Error creating course:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
