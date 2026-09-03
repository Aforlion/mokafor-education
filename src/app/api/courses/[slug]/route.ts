import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/courses/[slug] - Get course detail, modules, videos & enrollment check
export async function GET(
  request: Request,
  context: { params: { slug: string } | Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await context.params
    const slug = resolvedParams.slug
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const courseObj = await db.course.findUnique({
      where: { slug },
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
      }
    })

    if (!courseObj) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    const course: any = courseObj

    let isEnrolled = false
    if (userId && course.id) {
      const enrollment = await db.courseEnrollment.findFirst({
        where: {
          courseId: course.id,
          userId
        }
      })
      isEnrolled = !!enrollment
    }

    // Process syllabus: if user is not enrolled, sanitize full video stream URLs except for free snippets
    const rawModules = Array.isArray(course.modules) ? course.modules : []
    const sanitizedModules = rawModules.map((moduleItem: any) => ({
      ...moduleItem,
      videos: (Array.isArray(moduleItem.videos) ? moduleItem.videos : []).map((video: any) => {
        if (isEnrolled || video.isSnippet) {
          return video
        }
        // Mask full video URL for non-enrolled users unless it's a snippet preview
        return {
          ...video,
          videoUrl: '' // Full stream URL locked until enrollment
        }
      })
    }))

    return NextResponse.json({
      success: true,
      course: {
        ...course,
        modules: sanitizedModules,
        isEnrolled
      }
    })
  } catch (error: any) {
    console.error('Error fetching course detail:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
