export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const whereClause = role && role !== 'All' ? { role } : {}

    const profiles = await db.profile.findMany({
      where: whereClause,
      include: {
        students: true,
        tutorProfile: true,
        transactions: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const formatted = profiles.map(p => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email,
      phone: p.phone || 'N/A',
      role: p.role,
      avatar: p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: p.createdAt,
      totalSpent: p.transactions.reduce((acc, t) => acc + t.amount, 0),
      wardCount: p.students.length,
      isTutorVerified: p.tutorProfile?.verified || false,
      tutorStatus: p.tutorProfile?.status || 'N/A'
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, role, firstName, lastName, phone } = body

    if (!id) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
    }

    const updated = await db.profile.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone })
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
