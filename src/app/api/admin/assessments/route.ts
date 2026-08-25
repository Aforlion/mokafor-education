export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const whereClause: any = {}
    if (status && status !== 'All') {
      whereClause.status = status
    }

    const bookings = await db.booking.findMany({
      where: whereClause,
      include: {
        student: {
          include: { parent: true }
        },
        tutor: {
          include: { profile: true }
        }
      },
      orderBy: { scheduledAt: 'desc' }
    })

    const formatted = bookings.map(b => ({
      id: b.id,
      parentName: b.student?.parent ? `${b.student.parent.firstName} ${b.student.parent.lastName}` : 'Parent',
      parentEmail: b.student?.parent?.email || 'N/A',
      parentPhone: b.student?.parent?.phone || 'N/A',
      studentName: b.student ? `${b.student.firstName} ${b.student.lastName}` : 'Student',
      grade: b.student?.gradeLevel || 'Primary/Secondary',
      curriculum: b.student?.curriculum || 'National/British',
      tutorName: b.tutor?.profile ? `${b.tutor.profile.firstName} ${b.tutor.profile.lastName}` : 'Unassigned',
      scheduledAt: b.scheduledAt,
      meetingLink: b.meetingLink,
      notes: b.notes,
      status: b.status
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching admin assessments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, notes, meetingLink } = body

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    const updated = await db.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes && { notes }),
        ...(meetingLink && { meetingLink })
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating assessment booking:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
