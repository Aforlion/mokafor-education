import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { parentName, studentName, grade, curriculum, date, time } = body

    if (!parentName || !studentName || !grade || !curriculum || !date || !time) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // 1. Create or Find Parent Profile
    const parentEmail = `${parentName.toLowerCase().replace(/\s+/g, '')}@example.com`
    let parent = await db.profile.findUnique({
      where: { email: parentEmail }
    })

    if (!parent) {
      const splitName = parentName.split(' ')
      parent = await db.profile.create({
        data: {
          clerkId: `clerk_mock_p_${Math.floor(Math.random() * 100000)}`,
          role: 'parent',
          firstName: splitName[0] || parentName,
          lastName: splitName.slice(1).join(' ') || 'Parent',
          email: parentEmail
        }
      })
    }

    // 2. Create Student profile
    const splitStudentName = studentName.split(' ')
    const student = await db.student.create({
      data: {
        parentId: parent.id,
        firstName: splitStudentName[0] || studentName,
        lastName: splitStudentName.slice(1).join(' ') || 'Student',
        gradeLevel: grade,
        curriculum: curriculum
      }
    })

    // 3. Find default tutor (e.g. Mark Okafor CEO)
    const defaultTutor = await db.tutorProfile.findFirst()

    if (!defaultTutor) {
      return NextResponse.json({ error: 'No active tutor available to book consultation' }, { status: 400 })
    }

    // 4. Create Booking entry
    const bookingDate = new Date(`${date}T${time}`)
    const booking = await db.booking.create({
      data: {
        studentId: student.id,
        tutorId: defaultTutor.id,
        subject: 'Placement Assessment',
        lessonType: 'improvement',
        scheduledAt: bookingDate,
        meetingLink: 'https://meet.google.com/mock-mokafor-consultation',
        notes: `Diagnostic placement requested by parent ${parentName} for student ${studentName}`
      }
    })

    return NextResponse.json({ success: true, bookingId: booking.id })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
