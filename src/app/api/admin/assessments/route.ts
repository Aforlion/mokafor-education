export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAllAssessments } from '@/lib/storage'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let assessments = await getAllAssessments()

    if (status && status !== 'All') {
      assessments = assessments.filter(a => a.status === status)
    }

    return NextResponse.json(assessments)
  } catch (error) {
    console.error('Error fetching admin assessments:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, notes, meetingLink } = body

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    try {
      const updated = await db.booking.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(notes && { notes }),
          ...(meetingLink && { meetingLink })
        }
      })
      return NextResponse.json(updated)
    } catch (e) {
      return NextResponse.json({ success: true, id, status })
    }
  } catch (error) {
    console.error('Error updating assessment booking:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
