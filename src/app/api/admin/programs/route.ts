export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const whereClause = category && category !== 'All' ? { category } : {}

    const programs = await db.program.findMany({
      where: whereClause,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching admin programs:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
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
  } catch (error) {
    console.error('Error creating program:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, category, badge, desc, schedule, duration, fee, rawPrice, popular, highlights } = body

    if (!id) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 })
    }

    const updated = await db.program.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(badge && { badge }),
        ...(desc && { desc }),
        ...(schedule && { schedule }),
        ...(duration && { duration }),
        ...(fee && { fee }),
        ...(rawPrice && { rawPrice }),
        ...(popular !== undefined && { popular: Boolean(popular) }),
        ...(highlights && { highlights })
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating program:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 })
    }

    await db.program.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting program:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
