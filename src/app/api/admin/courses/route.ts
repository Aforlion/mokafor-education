import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/courses - Fetch all courses for admin view (including unpublished)
export async function GET() {
  try {
    const courses = await db.course.findMany({
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            videos: {
              orderBy: { order: 'asc' }
            }
          }
        },
        shortLinks: true,
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, courses })
  } catch (error: any) {
    console.error('Error fetching admin courses:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/admin/courses - Create course, module, or video
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    // 1. Action: create_module
    if (action === 'create_module') {
      const { courseId, title, description, order } = body
      if (!courseId || !title) {
        return NextResponse.json({ success: false, error: 'Course ID and title required' }, { status: 400 })
      }
      const moduleItem = await db.courseModule.create({
        data: {
          courseId,
          title,
          description: description || null,
          order: order || 0
        }
      })
      return NextResponse.json({ success: true, module: moduleItem })
    }

    // 2. Action: create_video
    if (action === 'create_video') {
      const { moduleId, title, description, videoUrl, snippetUrl, durationSeconds, isSnippet, order } = body
      if (!moduleId || !title || !videoUrl) {
        return NextResponse.json({ success: false, error: 'Module ID, title, and video URL required' }, { status: 400 })
      }
      const video = await db.courseVideo.create({
        data: {
          moduleId,
          title,
          description: description || null,
          videoUrl,
          snippetUrl: snippetUrl || videoUrl, // Fallback to main video URL if snippet URL not provided
          durationSeconds: durationSeconds ? Number(durationSeconds) : 0,
          isSnippet: isSnippet !== undefined ? Boolean(isSnippet) : true,
          order: order || 0
        }
      })
      return NextResponse.json({ success: true, video })
    }

    // 3. Action: update_course_pricing
    if (action === 'update_course_pricing') {
      const { courseId, price, discountPrice, isPublished, featured } = body
      if (!courseId || price === undefined) {
        return NextResponse.json({ success: false, error: 'Course ID and price required' }, { status: 400 })
      }
      const updated = await db.course.update({
        where: { id: courseId },
        data: {
          price: Number(price),
          discountPrice: discountPrice !== null && discountPrice !== '' ? Number(discountPrice) : null,
          isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
          featured: featured !== undefined ? Boolean(featured) : false
        }
      })
      return NextResponse.json({ success: true, course: updated })
    }

    return NextResponse.json({ success: false, error: 'Invalid admin action' }, { status: 400 })
  } catch (error: any) {
    console.error('Error in admin courses action:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
