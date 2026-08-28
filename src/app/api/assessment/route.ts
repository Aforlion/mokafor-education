export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { saveAssessmentBooking } from '@/lib/storage'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { parentName, parentEmail, parentPhone, studentName, grade, curriculum, date, time } = body

    if (!parentName || !studentName || !grade || !curriculum) {
      return NextResponse.json({ error: 'Parent Name, Student Name, Grade, and Curriculum are required' }, { status: 400 })
    }

    const result = await saveAssessmentBooking({
      parentName,
      parentEmail,
      parentPhone,
      studentName,
      grade,
      curriculum,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '10:00'
    })

    // Async Email Dispatch
    try {
      const { sendConsultationConfirmationEmail, sendAdminConsultationAlertEmail } = await import('@/lib/email')
      const targetParentEmail = parentEmail || `${parentName.toLowerCase().replace(/\s+/g, '')}@mokafor.com`
      
      sendConsultationConfirmationEmail({
        parentName,
        parentEmail: targetParentEmail,
        studentName,
        grade,
        curriculum,
        date: date || 'Upcoming Date',
        time: time || '10:00 AM',
        bookingRef: result.bookingId
      })

      sendAdminConsultationAlertEmail({
        parentName,
        parentEmail: targetParentEmail,
        parentPhone: parentPhone || 'N/A',
        studentName,
        grade,
        curriculum,
        date: date || 'Upcoming Date',
        time: time || '10:00 AM',
        bookingRef: result.bookingId
      })
    } catch (emailErr) {
      console.warn('Email notification dispatch warning:', emailErr)
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error handling assessment booking POST:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
