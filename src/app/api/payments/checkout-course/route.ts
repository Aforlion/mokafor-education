import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/payments/checkout-course - Process or verify course purchase
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { courseId, userId, userEmail, paystackReference, amount } = body

    if (!courseId || !userId) {
      return NextResponse.json({ success: false, error: 'Course ID and User ID are required' }, { status: 400 })
    }

    // Verify course exists
    const course = await db.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    // Calculate effective price (discountPrice if set, else regular price)
    const payableAmount = course.discountPrice ? course.discountPrice : course.price
    const reference = paystackReference || `COURSE_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    // Check if user already enrolled
    const existingEnrollment = await db.courseEnrollment.findFirst({
      where: {
        courseId,
        userId
      }
    })

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        message: 'Already enrolled in this course',
        enrollment: existingEnrollment
      })
    }

    // Record enrollment
    const enrollment = await db.courseEnrollment.create({
      data: {
        courseId,
        userId,
        amountPaid: amount || payableAmount,
        paystackReference: reference
      },
      include: {
        course: {
          select: { title: true, slug: true }
        }
      }
    })

    // Also record transaction in transaction history
    await db.transaction.create({
      data: {
        parentId: userId,
        amount: amount || payableAmount,
        currency: 'NGN',
        paystackReference: reference,
        paystackStatus: 'success',
        type: 'one_time',
        description: `Enrollment in course: ${course.title}`,
        metadata: { courseId, courseSlug: course.slug }
      }
    }).catch((err: any) => console.error('Transaction log notice:', err))

    return NextResponse.json({
      success: true,
      message: 'Course purchase successful! You now have full access to all recorded videos.',
      enrollment
    })
  } catch (error: any) {
    console.error('Error processing course checkout:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
