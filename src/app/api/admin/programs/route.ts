export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_PROGRAMS = [
  {
    id: 'common-entrance-loyola',
    slug: 'common-entrance-loyola',
    title: 'Common Entrance & Loyola Preparation',
    category: 'Exam Prep',
    badge: 'Intensive Entrance Bootcamp',
    desc: 'An intensive preparation program for pupils seeking admission into Loyola Jesuit College and other top secondary schools.',
    schedule: 'Flexible Weekly Sessions',
    duration: 'Monthly Intensive Track',
    fee: '₦100,000 per month',
    rawPrice: '₦100,000',
    popular: true,
    highlights: ['Mathematics & English', 'Verbal & Quantitative Reasoning', 'Mock Interview Prep'],
    order: 1
  },
  {
    id: 'waec-neco-jamb',
    slug: 'waec-neco-jamb',
    title: 'WAEC, NECO & JAMB Preparation',
    category: 'Exam Prep',
    badge: 'National Examination Coaching',
    desc: 'Focused coaching that helps students master the examination syllabus, solve past questions, improve speed and accuracy.',
    schedule: 'Flexible Weekly Classes',
    duration: 'Monthly Intensive Track',
    fee: '₦100,000 per month',
    rawPrice: '₦100,000',
    popular: false,
    highlights: ['Syllabus Mastery', 'Past Question Drills', 'Timed Exam Strategies'],
    order: 2
  },
  {
    id: 'math-mastery',
    slug: 'math-mastery',
    title: 'Mathematics Mastery Program',
    category: 'Subject Mastery',
    badge: 'Weekly Live Class',
    desc: 'A weekly live Mathematics program designed to help students build a strong foundation, strengthen problem-solving skills.',
    schedule: 'Every Saturday',
    duration: '2 Hours per Class',
    fee: '₦10,000 per student',
    rawPrice: '₦10,000',
    popular: true,
    highlights: ['Primary, Junior & Senior Secondary', 'Problem-Solving Focus', 'Entrance & Exam Prep'],
    order: 3
  },
  {
    id: 'english-mastery',
    slug: 'english-mastery',
    title: 'English Mastery Program',
    category: 'Subject Mastery',
    badge: 'Weekly Live Class',
    desc: 'A weekly live English program designed to help students develop strong communication, reading, writing, and grammar skills.',
    schedule: 'Every Saturday',
    duration: '2 Hours per Class',
    fee: '₦10,000 per student',
    rawPrice: '₦10,000',
    popular: false,
    highlights: ['Grammar & Composition', 'Vocabulary & Comprehension', 'Live Interactive Practice'],
    order: 4
  },
  {
    id: 'sat-math-prep',
    slug: 'sat-math-prep',
    title: 'SAT Mathematics Preparation',
    category: 'International',
    badge: 'International Standards',
    desc: 'A specialized program that prepares students for the SAT Mathematics section using international standards and test strategies.',
    schedule: 'Bi-Weekly / Weekend Sessions',
    duration: 'Monthly Preparation',
    fee: '₦100,000 per month',
    rawPrice: '₦100,000',
    popular: true,
    highlights: ['SAT Test Strategies', 'Algebra & Advanced Math', 'Full-Length Mock Practice'],
    order: 5
  },
  {
    id: 'ielts-prep',
    slug: 'ielts-prep',
    title: 'IELTS Preparation',
    category: 'International',
    badge: 'Language Proficiency',
    desc: 'Professional coaching for the IELTS examination, covering Listening, Reading, Writing, and Speaking.',
    schedule: 'Flexible Timetable',
    duration: 'Monthly Coaching',
    fee: 'Starting from ₦100,000 per month',
    rawPrice: '₦100,000',
    popular: false,
    highlights: ['Listening & Reading Mastery', 'Writing & Essay Feedback', 'Live Speaking Sessions'],
    order: 6
  },
  {
    id: 'int-scholarship-placement',
    slug: 'international-scholarship-placement',
    title: 'International Scholarship & University Placement Programme',
    category: 'International',
    badge: 'Global University & Financial Aid',
    desc: 'Turning Academic Potential into Global Opportunities. We help ambitious students discover international university opportunities and scholarships.',
    schedule: 'Personalized Application Timetable',
    duration: 'Full Placement Track',
    fee: 'Available on request',
    rawPrice: 'Available on request',
    popular: true,
    highlights: ['Global Scholarship Search', 'Exam Prep (SAT, IELTS)', 'Application & SOP Review'],
    order: 7
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let programs: any[] = []
    try {
      const whereClause = category && category !== 'All' ? { category } : {}
      programs = await db.program.findMany({
        where: whereClause,
        orderBy: { order: 'asc' }
      })
    } catch (dbErr) {
      console.warn('DB fetch programs fallback active')
    }

    if (!programs || programs.length === 0) {
      programs = category && category !== 'All' 
        ? DEFAULT_PROGRAMS.filter(p => p.category === category)
        : DEFAULT_PROGRAMS
    }

    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching admin programs:', error)
    return NextResponse.json(DEFAULT_PROGRAMS)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, category, badge, desc, schedule, duration, fee, rawPrice, popular, highlights } = body

    if (!title || !category || !desc || !fee) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    try {
      const program = await db.program.create({
        data: {
          slug,
          title,
          category,
          badge: badge || 'Official Curriculum',
          desc,
          schedule: schedule || 'Flexible Schedule',
          duration: duration || 'Monthly Program',
          fee,
          rawPrice: rawPrice || fee,
          popular: Boolean(popular),
          highlights: Array.isArray(highlights) ? highlights : ['Personalized Guidance', 'Expert Instruction']
        }
      })
      return NextResponse.json(program)
    } catch (e) {
      return NextResponse.json({
        id: slug,
        slug,
        title,
        category,
        badge: badge || 'Official Curriculum',
        desc,
        schedule: schedule || 'Flexible Schedule',
        duration: duration || 'Monthly Program',
        fee,
        rawPrice: rawPrice || fee,
        popular: Boolean(popular),
        highlights: Array.isArray(highlights) ? highlights : ['Personalized Guidance']
      })
    }
  } catch (error) {
    console.error('Error creating program:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
