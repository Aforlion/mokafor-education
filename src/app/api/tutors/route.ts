export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAllTutors } from '@/lib/storage'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = (searchParams.get('subject') || '').trim().toLowerCase()
    const grade = (searchParams.get('grade') || '').trim().toLowerCase()
    const curriculum = (searchParams.get('curriculum') || '').trim().toLowerCase()

    const activeTutors = await getAllTutors('active')

    const filtered = activeTutors.filter(t => {
      // 1. Subject filter
      if (subject && subject !== 'all') {
        const primarySubj = (t.subject || '').toLowerCase()
        const subjectsList = (t.subjects || []).map((s: string) => s.toLowerCase())
        const matchesSubj = primarySubj.includes(subject) || subjectsList.some((s: string) => s.includes(subject))
        if (!matchesSubj) return false
      }

      // 2. Grade filter
      if (grade && grade !== 'all') {
        const primaryGrade = (t.grade || '').toLowerCase()
        const levelsList = (t.levels || []).map((l: string) => l.toLowerCase())
        const matchesGrade = primaryGrade.includes(grade) || levelsList.some((l: string) => l.includes(grade))
        if (!matchesGrade) return false
      }

      // 3. Curriculum filter
      if (curriculum && curriculum !== 'all') {
        const primaryCurr = (t.curriculum || '').toLowerCase()
        const curriculaList = (t.curricula || []).map((c: string) => c.toLowerCase())
        const matchesCurr = primaryCurr.includes(curriculum) || curriculaList.some((c: string) => c.includes(curriculum))
        if (!matchesCurr) return false
      }

      return true
    })

    const formattedTutors = filtered.map(t => ({
      id: t.id,
      name: t.name,
      specialty: t.specialty || 'Loyola Jesuit & Junior WAEC Specialist',
      subject: t.subject || t.subjects?.[0] || 'Mathematics',
      grade: t.grade || (t.levels && t.levels.length > 0 ? t.levels.join(', ') : 'Primary'),
      curriculum: t.curriculum || (t.curricula && t.curricula.length > 0 ? t.curricula.join(' / ') : 'Loyola Jesuit'),
      subjects: t.subjects || ['Mathematics'],
      levels: t.levels || ['Primary'],
      curricula: t.curricula || ['Loyola Jesuit'],
      availability: t.availability || 'Weekdays/Weekends',
      language: t.language || 'English',
      rating: t.rating || 5.0,
      rate: t.fee || `₦${(t.hourlyRate || 25000).toLocaleString()}/hr`,
      hourlyRate: t.hourlyRate || 25000,
      bio: t.bio || '',
      avatar: t.avatar || '/founder.jpg',
      verified: t.verified !== undefined ? t.verified : true
    }))

    return NextResponse.json(formattedTutors)
  } catch (error) {
    console.error('Error fetching public tutors:', error)
    return NextResponse.json([])
  }
}
