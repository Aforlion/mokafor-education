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
    id: 'junior-waec-bece-excellence',
    slug: 'junior-waec-bece-excellence',
    title: 'Mokafor Junior WAEC (BECE) Excellence Programme',
    category: 'Exam Prep',
    badge: 'JSS1–JSS3 Pathway & Intensive Prep',
    desc: 'A structured academic development programme designed for students in JSS1–JSS3, providing a clear pathway from foundational learning to intensive Junior WAEC preparation. Combines subject foundations, continuous assessment, problem-solving, analytical thinking, past-question practice, examination techniques, mock examinations and targeted revision to build confidence and achieve excellent results.',
    schedule: 'Flexible Weekly Classes',
    duration: 'Monthly Intensive Track (JSS1–JSS3)',
    fee: '₦100,000 per month',
    rawPrice: '₦100,000',
    popular: true,
    highlights: [
      'JSS1 – Foundation: Build strong academic foundations & learning skills',
      'JSS2 – Development: Deepen understanding & identify learning gaps',
      'JSS3 – Junior WAEC Intensive: Past questions, mock exams & revision',
      'Senior Secondary transition readiness & confidence building'
    ],
    order: 2
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
    const { title, category, badge, desc, schedule, duration, fee, rawPrice, popular, highlights, order } = body

    if (!title || !category || !desc || !fee) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    let slug = baseSlug

    try {
      const existingSlug = await db.program.findUnique({ where: { slug } })
      if (existingSlug) {
        slug = `${baseSlug}-${Date.now().toString().slice(-4)}`
      }
    } catch (e) {}

    const highlightsArray = Array.isArray(highlights)
      ? highlights
      : (typeof highlights === 'string' ? highlights.split(',').map((s: string) => s.trim()).filter(Boolean) : ['Personalized Guidance', 'Expert Instruction'])

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
          highlights: highlightsArray,
          order: order !== undefined ? Number(order) : 0
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
        highlights: highlightsArray
      })
    }
  } catch (error: any) {
    console.error('Error creating program:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, category, badge, desc, schedule, duration, fee, rawPrice, popular, highlights, order } = body

    if (!id && !title) {
      return NextResponse.json({ error: 'Missing programme identifier' }, { status: 400 })
    }

    const highlightsArray = Array.isArray(highlights)
      ? highlights
      : (typeof highlights === 'string' ? highlights.split(',').map((s: string) => s.trim()).filter(Boolean) : [])

    const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : undefined

    let existing: any = null
    try {
      if (id) {
        existing = await db.program.findUnique({ where: { id } })
      }
      if (!existing && slug) {
        existing = await db.program.findUnique({ where: { slug } })
      }
      if (!existing && id) {
        existing = await db.program.findFirst({
          where: {
            OR: [
              { id },
              { slug: id }
            ]
          }
        })
      }
    } catch (findErr) {
      console.warn('DB findUnique program warning:', findErr)
    }

    if (existing) {
      const updated = await db.program.update({
        where: { id: existing.id },
        data: {
          title: title ?? existing.title,
          category: category ?? existing.category,
          badge: badge ?? existing.badge,
          desc: desc ?? existing.desc,
          schedule: schedule ?? existing.schedule,
          duration: duration ?? existing.duration,
          fee: fee ?? existing.fee,
          rawPrice: rawPrice ?? (fee ?? existing.rawPrice),
          popular: popular !== undefined ? Boolean(popular) : existing.popular,
          highlights: highlightsArray.length > 0 ? highlightsArray : existing.highlights,
          ...(order !== undefined ? { order: Number(order) } : {})
        }
      })
      return NextResponse.json(updated)
    } else {
      const programSlug = slug || (id ? String(id).toLowerCase().replace(/[^a-z0-9]+/g, '-') : `program-${Date.now()}`)
      const created = await db.program.create({
        data: {
          ...(id && id.length > 20 ? { id } : {}),
          slug: programSlug,
          title: title || 'Educational Programme',
          category: category || 'Subject Mastery',
          badge: badge || 'Official Curriculum',
          desc: desc || '',
          schedule: schedule || 'Flexible Schedule',
          duration: duration || 'Monthly Program',
          fee: fee || 'Contact for pricing',
          rawPrice: rawPrice || fee || 'Contact for pricing',
          popular: Boolean(popular),
          highlights: highlightsArray.length > 0 ? highlightsArray : ['Personalized Guidance', 'Expert Instruction'],
          order: order !== undefined ? Number(order) : 0
        }
      })
      return NextResponse.json(created)
    }
  } catch (error: any) {
    console.error('Error updating program:', error)
    return NextResponse.json({ error: error.message || 'Failed to update programme' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing programme ID' }, { status: 400 })
    }

    try {
      const existing = await db.program.findFirst({
        where: {
          OR: [
            { id },
            { slug: id }
          ]
        }
      })
      if (existing) {
        await db.program.delete({ where: { id: existing.id } })
      }
      return NextResponse.json({ success: true, message: 'Programme deleted' })
    } catch (dbErr: any) {
      console.warn('DB delete program warning:', dbErr)
      return NextResponse.json({ success: true, message: 'Programme deleted' })
    }
  } catch (error: any) {
    console.error('Error deleting program:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete programme' }, { status: 500 })
  }
}

