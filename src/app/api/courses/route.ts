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
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })

    // Compute dynamic base price (sum of lessons) and discounted package price
    const enrichedCourses = courses.map((c: any) => {
      const allVideos = c.modules.flatMap((m: any) => m.videos)
      const sumOfLessons = allVideos.reduce((sum: number, v: any) => sum + (v.price || 2000), 0)
      const basePrice = sumOfLessons > 0 ? sumOfLessons : (c.price > 0 ? c.price : 2000)
      const discountPercent = c.discountPercent || (c.discountPrice && c.discountPrice < basePrice ? Math.round(((basePrice - c.discountPrice) / basePrice) * 100) : 0)
      const computedDiscountPrice = discountPercent > 0 ? Math.round(basePrice * (1 - discountPercent / 100)) : (c.discountPrice || basePrice)

      return {
        ...c,
        computedBasePrice: basePrice,
        computedDiscountPrice: computedDiscountPrice,
        computedDiscountPercent: discountPercent
      }
    })

    return NextResponse.json({ success: true, courses: enrichedCourses })
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/courses - Create a new video course (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, subtitle, description, thumbnailUrl, level, category, discountPercent, featured } = body

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description are required' }, { status: 400 })
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
        category: category || 'General',
        price: 0,
        discountPercent: discountPercent ? Number(discountPercent) : 0,
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
