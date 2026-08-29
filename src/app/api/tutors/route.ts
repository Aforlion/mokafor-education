export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_TUTORS_LIST = [
  {
    id: 'tutor-mark-1',
    name: 'Mark Okafor (CEO)',
    subject: 'Mathematics',
    grade: 'Junior Secondary',
    curriculum: 'WAEC / IGCSE',
    availability: 'Weekdays/Weekends',
    language: 'English',
    rating: 5.0,
    rate: '₦30,000/hr',
    bio: 'Founder & Chief Educator. Math Specialist & Consultant passionate about simplifying complex equations.',
    avatar: '/founder.jpg'
  },
  {
    id: 'tutor-jane-2',
    name: 'Jane Alabi',
    subject: 'Mathematics',
    grade: 'Senior Secondary',
    curriculum: 'WAEC / A Levels',
    availability: 'Weekdays',
    language: 'English',
    rating: 4.9,
    rate: '₦20,000/hr',
    bio: 'Experienced Mathematics teacher. Specializes in WAEC, IGCSE, A-Levels & Problem-Solving mastery.',
    avatar: '/tutors/jane_alabi.png'
  },
  {
    id: 'tutor-victor-3',
    name: 'Victor Elendu',
    subject: 'English & Literature',
    grade: 'Senior Secondary',
    curriculum: 'SAT / IELTS',
    availability: 'Weekends',
    language: 'English',
    rating: 4.8,
    rate: '₦20,000/hr',
    bio: 'Experienced English Language & Literature teacher. Specializes in IELTS, TOEFL & SAT prep.',
    avatar: '/tutors/victor_elendu.png'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject') || ''
    const grade = searchParams.get('grade') || ''
    const curriculum = searchParams.get('curriculum') || ''

    let formattedTutors: any[] = []

    try {
      const whereClause: any = { status: 'active' }
      if (subject) whereClause.subjects = { has: subject }
      if (grade) whereClause.levels = { has: grade }
      if (curriculum) whereClause.curricula = { has: curriculum }

      const tutors = await db.tutorProfile.findMany({
        where: whereClause,
        include: { profile: true }
      })

      formattedTutors = tutors.map((t) => ({
        id: t.id,
        name: t.profile ? `${t.profile.firstName} ${t.profile.lastName}` : 'Tutor',
        subject: t.subjects[0] || 'General',
        grade: t.levels[0] || 'All Levels',
        curriculum: t.curricula[0] || 'National',
        availability: 'Weekdays/Weekends',
        language: 'English',
        rating: t.rating,
        rate: `₦${t.hourlyRate.toLocaleString()}/hr`,
        bio: t.bio,
        avatar: t.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }))
    } catch (e) {
      console.warn('DB fetch tutors fallback active')
    }

    if (!formattedTutors || formattedTutors.length === 0) {
      formattedTutors = DEFAULT_TUTORS_LIST
    }

    return NextResponse.json(formattedTutors)
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return NextResponse.json(DEFAULT_TUTORS_LIST)
  }
}
