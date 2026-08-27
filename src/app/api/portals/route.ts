export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const FALLBACK_STUDENT_PORTAL = {
  name: 'Toby Adebayo',
  grade: 'JSS 3 (BECE)',
  curriculum: 'WAEC / Common Entrance',
  attendance: 94,
  score: 85,
  nextLesson: {
    tutor: 'Mark Okafor (CEO)',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    meetingLink: 'https://meet.google.com/mock-mokafor-lesson'
  },
  assignment: {
    id: 'asg-mock-1',
    title: 'Quadratic Equations Homework Sheet 3',
    description: 'Solve problems 1 to 10. Show all workings clearly.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  }
}

const FALLBACK_PARENT_PORTAL = {
  parentName: 'Amadi Adebayo',
  wardName: 'Toby Adebayo',
  progress: {
    score: 85,
    notes: 'Exceptional aptitude. Ready for WAEC trials.'
  },
  transactions: [
    {
      reference: 'MOK-PAY-778822',
      amount: '₦100,000',
      date: new Date().toISOString(),
      status: 'success'
    }
  ]
}

const FALLBACK_TUTOR_PORTAL = {
  tutorName: 'Mark Okafor',
  activeStudents: 4,
  earnings: '₦420,000',
  rating: 5.0,
  reviewsCount: 12,
  agenda: [
    {
      studentName: 'Toby Adebayo',
      subject: 'Mathematics',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      meetingLink: 'https://meet.google.com/mock-mokafor-lesson'
    }
  ]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || 'student'

    if (role === 'student') {
      try {
        const student = await db.student.findFirst({
          include: {
            bookings: { include: { tutor: { include: { profile: true } } } },
            progressReports: true,
            submissions: true
          }
        })
        const assignment = await db.assignment.findFirst({ orderBy: { createdAt: 'desc' } })

        if (student) {
          const progress = student.progressReports[0] || { attendanceRate: 94, overallScore: 85 }
          const nextBooking = student.bookings[0] || null

          return NextResponse.json({
            name: `${student.firstName} ${student.lastName}`,
            grade: student.gradeLevel,
            curriculum: student.curriculum || 'WAEC',
            attendance: progress.attendanceRate || 94,
            score: progress.overallScore || 85,
            nextLesson: nextBooking ? {
              tutor: nextBooking.tutor?.profile ? `${nextBooking.tutor.profile.firstName} ${nextBooking.tutor.profile.lastName}` : 'Mark Okafor',
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
      } catch (e) {
        console.warn('DB student portal fetch fallback active')
      }
      return NextResponse.json(FALLBACK_STUDENT_PORTAL)
    }

    if (role === 'parent') {
      try {
        const parent = await db.profile.findFirst({
          where: { role: 'parent' },
          include: { students: true, transactions: true }
        })
        if (parent) {
          const student = parent.students[0]
          let progressReport = null
          if (student) {
            progressReport = await db.progressReport.findFirst({ where: { studentId: student.id } })
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
      } catch (e) {
        console.warn('DB parent portal fetch fallback active')
      }
      return NextResponse.json(FALLBACK_PARENT_PORTAL)
    }

    if (role === 'tutor') {
      try {
        const tutor = await db.tutorProfile.findFirst({
          include: { profile: true, bookings: { include: { student: true } } }
        })
        if (tutor) {
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
      } catch (e) {
        console.warn('DB tutor portal fetch fallback active')
      }
      return NextResponse.json(FALLBACK_TUTOR_PORTAL)
    }

    return NextResponse.json(FALLBACK_STUDENT_PORTAL)
  } catch (error) {
    console.error('Error fetching portal data:', error)
    return NextResponse.json(FALLBACK_STUDENT_PORTAL)
  }
}
