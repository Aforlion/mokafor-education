import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/payments/checkout-course - Process or verify course purchase
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { courseId, videoId, userId, userEmail, paystackReference, amount } = body

    if (!userId || (!courseId && !videoId)) {
      return NextResponse.json({ success: false, error: 'User ID and Course/Video ID are required' }, { status: 400 })
    }

    const reference = paystackReference || `COURSE_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    // Ensure profile exists for userEmail to prevent Foreign Key constraint errors
    let targetUserId = userId
    if (userEmail) {
      let existingProfile = await db.profile.findFirst({
        where: { email: userEmail }
      })
      if (!existingProfile) {
        existingProfile = await db.profile.create({
          data: {
            clerkId: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            role: 'parent',
            firstName: userEmail.split('@')[0] || 'Guest',
            lastName: 'Parent',
            email: userEmail
          }
        })
      }
      targetUserId = existingProfile.id
    }

    // Check existing enrollment
    const existingEnrollment = await db.courseEnrollment.findFirst({
      where: videoId
        ? { videoId, userId: targetUserId }
        : { courseId, userId: targetUserId, videoId: null }
    })

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        message: 'Already enrolled / unlocked',
        enrollment: existingEnrollment
      })
    }

    // Record enrollment
    const enrollment = await db.courseEnrollment.create({
      data: {
        courseId: courseId || null,
        videoId: videoId || null,
        userId: targetUserId,
        amountPaid: amount || 2000,
        paystackReference: reference
      }
    })

    // Log transaction
    await db.transaction.create({
      data: {
        parentId: targetUserId,
        amount: amount || 2000,
        currency: 'NGN',
        paystackReference: reference,
        paystackStatus: 'success',
        type: 'one_time',
        description: videoId ? `Single Lesson Unlock: ${videoId}` : `Full Course Package Unlock: ${courseId}`,
        metadata: { courseId, videoId }
      }
    }).catch((err: any) => console.error('Transaction log notice:', err))

    return NextResponse.json({
      success: true,
      message: 'Purchase successful! Video access unlocked.',
      enrollment
    })
  } catch (error: any) {
    console.error('Error processing course checkout:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
