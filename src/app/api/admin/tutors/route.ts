export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_TUTORS = [
  {
    id: 'tutor-mark-okafor',
    profileId: 'prof-mark-1',
    name: 'Mark Okafor (CEO)',
    email: 'mark@mokafor.com',
    phone: '+2348030000001',
    avatar: '/founder.jpg',
    bio: 'Founder & Chief Educator. Loyola Jesuit & Junior WAEC Master Educator passionate about simplifying complex equations.',
    subjects: ['Mathematics', 'Physics', 'Exam Prep'],
    levels: ['Junior Secondary', 'Senior Secondary'],
    curricula: ['Loyola Jesuit', 'Junior WAEC', 'WAEC', 'IGCSE', 'JAMB'],
    hourlyRate: 30000,
    fee: '₦30,000/hr',
    rating: 5.0,
    totalReviews: 12,
    verified: true,
    status: 'active'
  },
  {
    id: 'tutor-jane-alabi',
    profileId: 'prof-jane-2',
    name: 'Jane Alabi',
    email: 'jane.alabi@mokafor.com',
    phone: '+2348030000002',
    avatar: '/tutors/jane_alabi.png',
    bio: 'Loyola Jesuit Entrance & Junior WAEC (BECE) Specialist. 10+ years experience guiding students through Loyola Jesuit mock drills and IGCSE Mathematics mastery.',
    subjects: ['Mathematics', 'Physics'],
    levels: ['Junior & Senior Secondary'],
    curricula: ['Loyola Jesuit', 'Junior WAEC', 'IGCSE', 'A Levels', 'WAEC'],
    hourlyRate: 20000,
    fee: '₦20,000/hr',
    rating: 4.9,
    totalReviews: 8,
    verified: true,
    status: 'active'
  },
  {
    id: 'tutor-victor-elendu',
    profileId: 'prof-victor-3',
    name: 'Victor Elendu',
    email: 'victor.elendu@mokafor.com',
    phone: '+2348030000003',
    avatar: '/tutors/victor_elendu.png',
    bio: 'Loyola Jesuit & Junior WAEC (BECE) English Specialist. Expert in Verbal Reasoning, IELTS, TOEFL, SAT Reading & Writing, and WAEC English Literature mastery.',
    subjects: ['English Language', 'Literature'],
    levels: ['Junior & Senior Secondary'],
    curricula: ['Loyola Jesuit', 'Junior WAEC', 'SAT', 'IELTS', 'WAEC'],
    hourlyRate: 20000,
    fee: '₦20,000/hr',
    rating: 4.8,
    totalReviews: 6,
    verified: true,
    status: 'active'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let tutors: any[] = []
    try {
      const whereClause = status ? { status } : {}
      const dbTutors = await db.tutorProfile.findMany({
        where: whereClause,
        include: { profile: true },
        orderBy: { rating: 'desc' }
      })

      tutors = dbTutors.map((t: any) => ({
        id: t.id,
        profileId: t.profile?.id || t.id,
        name: t.profile ? `${t.profile.firstName} ${t.profile.lastName}` : 'Tutor',
        email: t.profile?.email || 'N/A',
        phone: t.profile?.phone || 'N/A',
        avatar: t.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: t.bio || 'Vetted Mokafor Educator',
        subjects: t.subjects || ['Mathematics'],
        levels: t.levels || ['Secondary'],
        curricula: t.curricula || ['WAEC'],
        hourlyRate: t.hourlyRate || 20000,
        fee: `₦${(t.hourlyRate || 20000).toLocaleString()}/hr`,
        rating: t.rating || 5.0,
        totalReviews: t.totalReviews || 5,
        verified: t.verified,
        status: t.status || 'active'
      }))
    } catch (e) {
      console.warn('DB fetch tutors fallback active')
    }

    if (!tutors || tutors.length === 0) {
      tutors = status ? DEFAULT_TUTORS.filter(t => t.status === status) : DEFAULT_TUTORS
    }

    return NextResponse.json(tutors)
  } catch (error) {
    console.error('Error fetching admin tutors:', error)
    return NextResponse.json(DEFAULT_TUTORS)
  }
}
