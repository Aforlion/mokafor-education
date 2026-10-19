import { db } from './db'

export interface FulfillmentInput {
  reference: string
  email: string
  amountInKobo?: number
  amountInNaira?: number
  metadata?: {
    parentName?: string
    name?: string
    studentName?: string
    grade?: string
    curriculum?: string
    planTitle?: string
    plan?: string
    courseId?: string
    courseSlug?: string
    videoId?: string
    videoTitle?: string
    type?: string
    [key: string]: any
  }
}

export interface FulfillmentResult {
  success: boolean
  profileId: string
  parentEmail: string
  enrollmentId?: string
  studentId?: string
  subscriptionId?: string
  transactionId?: string
  error?: string
}

/**
 * Fulfills all access entitlements across the platform idempotently upon verified Paystack payment.
 * Invoked by both synchronous verification redirect (/api/payments/verify) and asynchronous webhook (/api/payments/webhook).
 */
export async function fulfillPaymentEntitlements(input: FulfillmentInput): Promise<FulfillmentResult> {
  const { reference, email, metadata = {} } = input
  
  if (!reference || !email) {
    return { success: false, profileId: '', parentEmail: email || '', error: 'Missing reference or customer email' }
  }

  const cleanEmail = email.toLowerCase().trim()
  const amountInNaira = input.amountInNaira ?? Math.round((input.amountInKobo || 0) / 100)

  try {
    // 1. Find or create Customer/Parent Profile
    let parent = await db.profile.findUnique({
      where: { email: cleanEmail }
    })

    const rawParentName = (metadata.parentName || metadata.name || cleanEmail.split('@')[0] || 'Customer').trim()
    const nameParts = rawParentName.split(' ')
    const firstName = nameParts[0] || 'Customer'
    const lastName = nameParts.slice(1).join(' ') || 'Parent'

    if (!parent) {
      parent = await db.profile.create({
        data: {
          clerkId: `clerk_paystack_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          role: 'parent',
          firstName,
          lastName,
          email: cleanEmail
        }
      })
    }

    // 2. Upsert Transaction in DB
    const planDescription = metadata.planTitle || metadata.plan || (metadata.videoId ? 'Video Lesson Unlock' : (metadata.courseId ? 'Full Course Unlock' : 'Tuition Payment'))
    const txType = metadata.courseId || metadata.videoId ? 'one_time' : 'subscription'

    const existingTx = await db.transaction.findUnique({
      where: { paystackReference: reference }
    })

    let transaction
    if (existingTx) {
      transaction = await db.transaction.update({
        where: { paystackReference: reference },
        data: {
          paystackStatus: 'success',
          amount: amountInNaira > 0 ? amountInNaira : existingTx.amount,
          metadata: metadata
        }
      })
    } else {
      transaction = await db.transaction.create({
        data: {
          parentId: parent.id,
          amount: amountInNaira,
          currency: 'NGN',
          paystackReference: reference,
          paystackStatus: 'success',
          type: txType,
          description: `Payment for ${planDescription}`,
          metadata: metadata
        }
      })
    }

    let enrollmentId: string | undefined
    let studentId: string | undefined
    let subscriptionId: string | undefined

    // 3. Grant Video Course / Lesson Access if courseId or videoId provided
    const targetCourseId = metadata.courseId || null
    const targetVideoId = metadata.videoId || null

    if (targetCourseId || targetVideoId) {
      // Check existing enrollment by reference, or (courseId/videoId with user's ID/email)
      const existingEnrollment = await db.courseEnrollment.findFirst({
        where: {
          OR: [
            { paystackReference: reference },
            targetVideoId
              ? { videoId: targetVideoId, userId: parent.id }
              : { courseId: targetCourseId, userId: parent.id, videoId: null }
          ]
        }
      })

      if (existingEnrollment) {
        enrollmentId = existingEnrollment.id
      } else {
        const newEnrollment = await db.courseEnrollment.create({
          data: {
            courseId: targetCourseId,
            videoId: targetVideoId,
            userId: parent.id,
            amountPaid: amountInNaira,
            paystackReference: reference
          }
        })
        enrollmentId = newEnrollment.id
      }
    }

    // 4. Grant Educational Programme Access (Create Student & Active Subscription) if applicable
    const studentFullName = (metadata.studentName || '').trim()
    const isProgramTuition = studentFullName.length > 0 || (!targetCourseId && !targetVideoId)

    if (isProgramTuition) {
      const studentNameParts = (studentFullName || 'Student').split(' ')
      const studentFirstName = studentNameParts[0] || 'Student'
      const studentLastName = studentNameParts.slice(1).join(' ') || lastName || 'Learner'

      let student = await db.student.findFirst({
        where: {
          parentId: parent.id,
          firstName: studentFirstName
        }
      })

      if (!student) {
        student = await db.student.create({
          data: {
            parentId: parent.id,
            firstName: studentFirstName,
            lastName: studentLastName,
            gradeLevel: metadata.grade || 'General',
            curriculum: metadata.curriculum || 'WAEC'
          }
        })
      }
      studentId = student.id

      // Find or create PaymentPlan
      const planTitle = metadata.planTitle || metadata.plan || 'Educational Programme'
      let plan = await db.paymentPlan.findFirst({
        where: { name: planTitle }
      })

      if (!plan) {
        plan = await db.paymentPlan.create({
          data: {
            name: planTitle,
            amount: amountInNaira > 0 ? amountInNaira : 100000,
            billingInterval: 'monthly',
            isActive: true
          }
        })
      }

      // Ensure active Subscription exists
      let subscription = await db.subscription.findFirst({
        where: {
          parentId: parent.id,
          studentId: student.id
        }
      })

      if (!subscription) {
        subscription = await db.subscription.create({
          data: {
            parentId: parent.id,
            studentId: student.id,
            planId: plan.id,
            status: 'active',
            startedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days active
          }
        })
      } else if (subscription.status !== 'active') {
        subscription = await db.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        })
      }
      subscriptionId = subscription.id
    }

    // 5. Send confirmation emails safely
    try {
      const { sendEnrollmentReceiptEmail, sendAdminRevenueAlertEmail } = await import('@/lib/email')
      const formattedAmount = `₦${amountInNaira.toLocaleString()}`
      const studentNameDisplay = studentFullName || `${firstName}'s Student`
      const programDisplay = planDescription

      await sendEnrollmentReceiptEmail({
        parentName: rawParentName,
        parentEmail: cleanEmail,
        studentName: studentNameDisplay,
        programTitle: programDisplay,
        amountPaid: formattedAmount,
        paystackRef: reference,
        date: new Date().toLocaleDateString()
      }).catch(err => console.warn('Enrollment receipt email notice:', err))

      await sendAdminRevenueAlertEmail({
        parentName: rawParentName,
        parentEmail: cleanEmail,
        amountPaid: formattedAmount,
        programTitle: programDisplay,
        paystackRef: reference
      }).catch(err => console.warn('Admin revenue alert email notice:', err))
    } catch (emailErr) {
      console.warn('Email dispatch warning during fulfillment:', emailErr)
    }

    return {
      success: true,
      profileId: parent.id,
      parentEmail: cleanEmail,
      enrollmentId,
      studentId,
      subscriptionId,
      transactionId: transaction?.id
    }
  } catch (err: any) {
    console.error('Fatal error fulfilling payment entitlements:', err)
    return {
      success: false,
      profileId: '',
      parentEmail: cleanEmail,
      error: err.message || 'Fulfillment error'
    }
  }
}
