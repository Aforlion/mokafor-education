export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || 'student'

    if (role === 'student') {
      // Fetch Toby Adebayo (seeded student)
      const student = await db.student.findFirst({
        include: {
          bookings: {
            include: {
              tutor: {
                include: {
                  profile: true
                }
              }
            }
          },
          progressReports: true,
          submissions: true
        }
      })

      if (!student) {
        return NextResponse.json({ error: 'No student found' }, { status: 404 })
      }

      // Fetch pending assignment
      const assignment = await db.assignment.findFirst({
        orderBy: { createdAt: 'desc' }
      })

      const progress = student.progressReports[0] || { attendanceRate: 94, overallScore: 85 }
      const nextBooking = student.bookings[0] || null

      return NextResponse.json({
        name: `${student.firstName} ${student.lastName}`,
        grade: student.gradeLevel,
        curriculum: student.curriculum || 'WAEC',
        attendance: progress.attendanceRate || 94,
        score: progress.overallScore || 85,
        nextLesson: nextBooking ? {
          tutor: `${nextBooking.tutor.profile.firstName} ${nextBooking.tutor.profile.lastName}`,
          scheduledAt: nextBooking.scheduledAt,
          meetingLink: nextBooking.meetingLink
        } : null,
        assignment: assignment ? {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate
        } : null
      })
    }

    if (role === 'parent') {
      // Fetch Amadi Adebayo (seeded parent)
      const parent = await db.profile.findFirst({
        where: { role: 'parent' },
        include: {
          students: true,
          transactions: true
        }
      })

      if (!parent) {
        return NextResponse.json({ error: 'No parent profile found' }, { status: 404 })
      }

      const student = parent.students[0]
      let progressReport = null
      if (student) {
        progressReport = await db.progressReport.findFirst({
          where: { studentId: student.id }
        })
      }

      return NextResponse.json({
        parentName: `${parent.firstName} ${parent.lastName}`,
        wardName: student ? `${student.firstName} ${student.lastName}` : 'N/A',
        progress: progressReport ? {
          score: progressReport.overallScore,
          notes: progressReport.tutorNotes
        } : { score: 85, notes: 'Exceptional aptitude. Ready for WAEC trials.' },
        transactions: parent.transactions.map(tx => ({
          reference: tx.paystackReference,
          amount: `₦${tx.amount.toLocaleString()}`,
          date: tx.createdAt,
          status: tx.paystackStatus
        }))
      })
    }

    if (role === 'tutor') {
      // Fetch Mark Okafor (seeded tutor)
      const tutor = await db.tutorProfile.findFirst({
        include: {
          profile: true,
          bookings: {
            include: {
              student: true
            }
          }
        }
      })

      if (!tutor) {
        return NextResponse.json({ error: 'No tutor profile found' }, { status: 404 })
      }

      const activeStudentsCount = new Set(tutor.bookings.map(b => b.studentId)).size

      return NextResponse.json({
        tutorName: `${tutor.profile.firstName} ${tutor.profile.lastName}`,
        activeStudents: activeStudentsCount || 4,
        earnings: '₦420,000',
        rating: tutor.rating,
        reviewsCount: tutor.totalReviews,
        agenda: tutor.bookings.map(b => ({
          studentName: `${b.student.firstName} ${b.student.lastName}`,
          subject: b.subject,
          scheduledAt: b.scheduledAt,
          meetingLink: b.meetingLink
        }))
      })
    }

    return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching portal data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Simulates homework submissions logging
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { assignmentId, fileName } = body

    if (!assignmentId || !fileName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const student = await db.student.findFirst()
    if (!student) {
      return NextResponse.json({ error: 'No student profile found' }, { status: 404 })
    }

    const submission = await db.submission.create({
      data: {
        assignmentId,
        studentId: student.id,
        fileUrl: `/uploads/${fileName}`,
        notes: 'Submitted via student responsive drawer portal.'
      }
    })

    return NextResponse.json({ success: true, submissionId: submission.id })
  } catch (error) {
    console.error('Error logging submission:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
