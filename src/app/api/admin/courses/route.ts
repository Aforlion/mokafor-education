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

    // 1b. Action: update_module
    if (action === 'update_module') {
      const { moduleId, title, description, order } = body
      if (!moduleId) {
        return NextResponse.json({ success: false, error: 'Module ID is required' }, { status: 400 })
      }
      const updatedModule = await db.courseModule.update({
        where: { id: moduleId },
        data: {
          title: title || undefined,
          description: description !== undefined ? description : undefined,
          order: order !== undefined ? Number(order) : undefined
        }
      })
      return NextResponse.json({ success: true, module: updatedModule })
    }

    // 1c. Action: delete_module
    if (action === 'delete_module') {
      const { moduleId } = body
      if (!moduleId) {
        return NextResponse.json({ success: false, error: 'Module ID is required' }, { status: 400 })
      }
      await db.courseModule.delete({ where: { id: moduleId } })
      return NextResponse.json({ success: true, message: 'Module deleted successfully' })
    }

    // 2. Action: create_video
    if (action === 'create_video') {
      const { moduleId, title, description, videoUrl, snippetUrl, price, durationSeconds, isSnippet, order } = body
      if (!moduleId || !title || !videoUrl) {
        return NextResponse.json({ success: false, error: 'Module ID, title, and video URL required' }, { status: 400 })
      }
      const video = await db.courseVideo.create({
        data: {
          moduleId,
          title,
          description: description || null,
          videoUrl,
          snippetUrl: snippetUrl || null,
          price: price ? Number(price) : 2000,
          durationSeconds: durationSeconds ? Number(durationSeconds) : 0,
          isSnippet: isSnippet !== undefined ? Boolean(isSnippet) : true,
          order: order || 0
        }
      })
      return NextResponse.json({ success: true, video })
    }

    // 2b. Action: update_video
    if (action === 'update_video') {
      const { videoId, title, description, videoUrl, snippetUrl, price, durationSeconds, isSnippet, order } = body
      if (!videoId) {
        return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 })
      }
      const updatedVideo = await db.courseVideo.update({
        where: { id: videoId },
        data: {
          title: title || undefined,
          description: description !== undefined ? description : undefined,
          videoUrl: videoUrl || undefined,
          snippetUrl: snippetUrl !== undefined ? (snippetUrl || null) : undefined,
          price: price !== undefined ? Number(price) : undefined,
          durationSeconds: durationSeconds !== undefined ? Number(durationSeconds) : undefined,
          isSnippet: isSnippet !== undefined ? Boolean(isSnippet) : undefined,
          order: order !== undefined ? Number(order) : undefined
        }
      })
      return NextResponse.json({ success: true, video: updatedVideo })
    }

    // 2c. Action: delete_video
    if (action === 'delete_video') {
      const { videoId } = body
      if (!videoId) {
        return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 })
      }
      await db.courseVideo.delete({ where: { id: videoId } })
      return NextResponse.json({ success: true, message: 'Video deleted successfully' })
    }

    // 3. Action: update_course
    if (action === 'update_course') {
      const { courseId, title, subtitle, description, category, level, price, discountPrice, thumbnailUrl, isPublished, featured } = body
      if (!courseId) {
        return NextResponse.json({ success: false, error: 'Course ID required' }, { status: 400 })
      }
      const updated = await db.course.update({
        where: { id: courseId },
        data: {
          title: title || undefined,
          subtitle: subtitle !== undefined ? subtitle : undefined,
          description: description || undefined,
          category: category || undefined,
          level: level || undefined,
          price: price !== undefined ? Number(price) : undefined,
          discountPrice: discountPrice !== undefined ? (discountPrice !== null && discountPrice !== '' ? Number(discountPrice) : null) : undefined,
          thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : undefined,
          isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
          featured: featured !== undefined ? Boolean(featured) : undefined
        }
      })
      return NextResponse.json({ success: true, course: updated })
    }

    // 3b. Action: delete_course
    if (action === 'delete_course') {
      const { courseId } = body
      if (!courseId) {
        return NextResponse.json({ success: false, error: 'Course ID required' }, { status: 400 })
      }
      await db.course.delete({ where: { id: courseId } })
      return NextResponse.json({ success: true, message: 'Course deleted successfully' })
    }

    return NextResponse.json({ success: false, error: 'Invalid admin action' }, { status: 400 })
  } catch (error: any) {
    console.error('Error in admin courses action:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
