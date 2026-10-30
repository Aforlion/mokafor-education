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

    // Parse email or userId from query params or cookie
    let userParam = searchParams.get('email') || searchParams.get('userId')
    if (!userParam) {
      const cookieHeader = request.headers.get('cookie') || ''
      const match = cookieHeader.match(/mokafor_user_email=([^;]+)/)
      if (match && match[1]) {
        userParam = decodeURIComponent(match[1])
      }
    }

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
    let unlockedVideoIds: string[] = []

    if (userParam && course.id) {
      const cleanParam = userParam.trim()
      const profile = await db.profile.findFirst({
        where: {
          OR: [
            { id: cleanParam },
            { email: cleanParam.toLowerCase() },
            { clerkId: cleanParam }
          ]
        }
      })

      const candidateUserIds = Array.from(new Set([
        cleanParam,
        cleanParam.toLowerCase(),
        ...(profile ? [profile.id, profile.email] : [])
      ])).filter(Boolean)

      // 1. Check full course bundle purchase
      const bundleEnrollment = await db.courseEnrollment.findFirst({
        where: {
          courseId: course.id,
          videoId: null,
          userId: { in: candidateUserIds }
        }
      })

      if (bundleEnrollment) {
        isEnrolled = true
      }

      // 2. Check individual lesson unlocks
      const lessonEnrollments = await db.courseEnrollment.findMany({
        where: {
          videoId: { not: null },
          userId: { in: candidateUserIds }
        },
        select: { videoId: true }
      })

      unlockedVideoIds = lessonEnrollments.map((e: any) => e.videoId).filter(Boolean)
    }

    // Process syllabus: if user is not enrolled and lesson not unlocked, sanitize full video stream URLs except for free snippets
    const rawModules = Array.isArray(course.modules) ? course.modules : []
    const sanitizedModules = rawModules.map((moduleItem: any) => ({
      ...moduleItem,
      videos: (Array.isArray(moduleItem.videos) ? moduleItem.videos : []).map((video: any) => {
        const isVideoUnlocked = isEnrolled || unlockedVideoIds.includes(video.id) || video.isSnippet
        return {
          ...video,
          isUnlocked: isVideoUnlocked,
          videoUrl: isVideoUnlocked ? video.videoUrl : '' // Full stream URL locked until enrollment
        }
      })
    }))

    // Compute dynamic base price and bundle discounted price based on video lessons and discountPercent
    const allVideos = rawModules.flatMap((m: any) => m.videos || [])
    const sumOfLessons = allVideos.reduce((sum: number, v: any) => sum + (v.price || 2000), 0)
    const basePrice = sumOfLessons > 0 ? sumOfLessons : (course.price > 0 ? course.price : 2000)
    const discountPercent = course.discountPercent !== null && course.discountPercent !== undefined && Number(course.discountPercent) > 0
      ? Number(course.discountPercent)
      : (course.discountPrice && course.discountPrice < basePrice ? Math.round(((basePrice - course.discountPrice) / basePrice) * 100) : 0)
    const computedDiscountPrice = discountPercent > 0 
      ? Math.round(basePrice * (1 - discountPercent / 100)) 
      : (course.discountPrice && course.discountPrice < basePrice ? course.discountPrice : basePrice)

    return NextResponse.json({
      success: true,
      course: {
        ...course,
        price: basePrice,
        discountPercent,
        discountPrice: discountPercent > 0 && computedDiscountPrice < basePrice ? computedDiscountPrice : (course.discountPrice && course.discountPrice < basePrice ? course.discountPrice : null),
        computedBasePrice: basePrice,
        computedDiscountPrice: computedDiscountPrice,
        computedDiscountPercent: discountPercent,
        modules: sanitizedModules,
        isEnrolled,
        unlockedVideoIds
      }
    })
  } catch (error: any) {
    console.error('Error fetching course detail:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
