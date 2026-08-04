export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject') || ''
    const grade = searchParams.get('grade') || ''
    const curriculum = searchParams.get('curriculum') || ''

    // Build conditional where clause for arrays
    const whereClause: any = {
      status: 'active'
    }

    if (subject) {
      whereClause.subjects = {
        has: subject
      }
    }
    if (grade) {
      whereClause.levels = {
        has: grade
      }
    }
    if (curriculum) {
      whereClause.curricula = {
        has: curriculum
      }
    }

    const tutors = await db.tutorProfile.findMany({
      where: whereClause,
      include: {
        profile: true
      }
    })

    const formattedTutors = tutors.map((t) => ({
      id: t.id,
      name: `${t.profile.firstName} ${t.profile.lastName}`,
      subject: t.subjects[0] || 'General',
      grade: t.levels[0] || 'All Levels',
      curriculum: t.curricula[0] || 'National',
      availability: 'Weekdays/Weekends',
      language: 'English',
      rating: t.rating,
      rate: `₦${t.hourlyRate.toLocaleString()}/hr`,
      bio: t.bio,
      avatar: t.profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    }))

    return NextResponse.json(formattedTutors)
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
