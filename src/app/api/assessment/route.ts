import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { parentName, parentEmail: inputEmail, parentPhone, studentName, grade, curriculum, date, time } = body

    if (!parentName || !studentName || !grade || !curriculum) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // 1. Create or Find Parent Profile
    const parentEmail = inputEmail || `${parentName.toLowerCase().replace(/\s+/g, '')}@mokafor.com`
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
          email: parentEmail,
          phone: parentPhone || null
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

    // 3. Find or Create default tutor (e.g. Mark Okafor CEO)
    let defaultTutor = await db.tutorProfile.findFirst()

    if (!defaultTutor) {
      // Find or create admin profile
      let adminProf = await db.profile.findFirst({ where: { role: 'admin' } })
      if (!adminProf) {
        adminProf = await db.profile.create({
          data: {
            clerkId: `clerk_master_admin`,
            role: 'admin',
            firstName: 'Mark',
            lastName: 'Okafor',
            email: 'aforlion007@gmail.com'
          }
        })
      }
      defaultTutor = await db.tutorProfile.create({
        data: {
          id: adminProf.id,
          bio: 'Lead Education Specialist & Chief Executive Officer',
          subjects: ['Mathematics', 'Physics', 'Exam Prep'],
          levels: ['Primary', 'Junior Secondary', 'Senior Secondary'],
          curricula: ['WAEC', 'NECO', 'JAMB', 'British / IGCSE'],
          hourlyRate: 25000,
          rating: 5.0,
          verified: true,
          status: 'active'
        }
      })
    }

    // 4. Safely Parse Booking Date
    let bookingDate = new Date()
    try {
      if (date) {
        const dateStr = time ? `${date}T${time}` : date
        const parsed = new Date(dateStr)
        if (!isNaN(parsed.getTime())) {
          bookingDate = parsed
        }
      }
    } catch (e) {}

    // 5. Create Booking entry
    const booking = await db.booking.create({
      data: {
        studentId: student.id,
        tutorId: defaultTutor.id,
        subject: 'Placement Assessment',
        lessonType: 'improvement',
        scheduledAt: bookingDate,
        meetingLink: 'https://meet.google.com/mock-mokafor-consultation',
        notes: `Placement consultation requested by parent ${parentName} for student ${studentName}`
      }
    })

    return NextResponse.json({ success: true, bookingId: booking.id })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
