import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, courseSlug } = body

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // 1. Find profile by email
    const profile = await db.profile.findFirst({
      where: { email: cleanEmail }
    })

    const candidateUserIds = Array.from(new Set([
      cleanEmail,
      ...(profile ? [profile.id] : [])
    ])).filter(Boolean)

    // 2. Find course by slug if provided
    let targetCourse = null
    if (courseSlug) {
      targetCourse = await db.course.findUnique({
        where: { slug: courseSlug }
      })
    }

    // 3. Search for active enrollments
    const enrollments = await db.courseEnrollment.findMany({
      where: {
        userId: { in: candidateUserIds },
        ...(targetCourse ? { courseId: targetCourse.id } : {})
      }
    })

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No purchase record found for "${cleanEmail}". Please ensure you entered the exact email used during checkout.`
      }, { status: 404 })
    }

    const isFullCourse = enrollments.some((e: any) => !e.videoId)
    const unlockedVideoIds = enrollments.map((e: any) => e.videoId).filter(Boolean)

    const response = NextResponse.json({
      success: true,
      message: 'Access verified and restored successfully!',
      email: cleanEmail,
      isFullCourse,
      unlockedVideoIds,
      totalPurchases: enrollments.length
    })

    // Set 1-year silent session cookie
    response.cookies.set('mokafor_user_email', cleanEmail, {
      maxAge: 60 * 60 * 24 * 365, // 1 year silent access
      path: '/',
      sameSite: 'lax'
    })

    return response
  } catch (error: any) {
    console.error('Error in restore-access endpoint:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
