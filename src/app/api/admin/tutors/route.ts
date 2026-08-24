export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const whereClause = status ? { status } : {}

    const tutors = await db.tutorProfile.findMany({
      where: whereClause,
      include: { profile: true },
      orderBy: { rating: 'desc' }
    })

    const formatted = tutors.map(t => ({
      id: t.id,
      profileId: t.profile.id,
      name: `${t.profile.firstName} ${t.profile.lastName}`,
      email: t.profile.email,
      phone: t.profile.phone || 'N/A',
      avatar: t.profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: t.bio || 'Vetted Mokafor Educator',
      subjects: t.subjects,
      levels: t.levels,
      curricula: t.curricula,
      hourlyRate: t.hourlyRate,
      fee: `₦${t.hourlyRate.toLocaleString()}/hr`,
      rating: t.rating,
      totalReviews: t.totalReviews,
      verified: t.verified,
      status: t.status
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching admin tutors:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subjects, levels, curricula, hourlyRate, bio } = body

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const profile = await db.profile.create({
      data: {
        clerkId: `clerk_tutor_${Math.floor(100000 + Math.random() * 900000)}`,
        role: 'tutor',
        firstName,
        lastName,
        email,
        phone,
        tutorProfile: {
          create: {
            bio: bio || 'Vetted Mokafor Educator specializing in core academic curricula.',
            subjects: Array.isArray(subjects) ? subjects : ['Mathematics'],
            levels: Array.isArray(levels) ? levels : ['Senior Secondary'],
            curricula: Array.isArray(curricula) ? curricula : ['WAEC', 'IGCSE'],
            hourlyRate: typeof hourlyRate === 'number' ? hourlyRate : 12000,
            verified: true,
            status: 'active'
          }
        }
      },
      include: { tutorProfile: true }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error creating tutor:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, verified, status, hourlyRate, subjects, levels } = body

    if (!id) {
      return NextResponse.json({ error: 'Tutor profile ID required' }, { status: 400 })
    }

    const updated = await db.tutorProfile.update({
      where: { id },
      data: {
        ...(verified !== undefined && { verified: Boolean(verified) }),
        ...(status && { status }),
        ...(hourlyRate !== undefined && { hourlyRate: Number(hourlyRate) }),
        ...(subjects && { subjects }),
        ...(levels && { levels })
      },
      include: { profile: true }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating tutor profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Tutor profile ID required' }, { status: 400 })
    }

    const tutor = await db.tutorProfile.findUnique({ where: { id } })
    if (tutor) {
      await db.profile.delete({ where: { id: tutor.id } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tutor:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
