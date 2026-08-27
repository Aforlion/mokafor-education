export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_USERS = [
  {
    id: 'usr-owner-id',
    name: 'Executive Owner (ID Consulting)',
    email: 'idconsultingltd@gmail.com',
    phone: '+2349078013408',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    totalSpent: 0,
    wardCount: 0,
    isTutorVerified: false,
    tutorStatus: 'N/A'
  },
  {
    id: 'usr-super-aforlion',
    name: 'Super Admin (Aforlion)',
    email: 'aforlion007@gmail.com',
    phone: '+2348000000000',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    totalSpent: 0,
    wardCount: 0,
    isTutorVerified: false,
    tutorStatus: 'N/A'
  },
  {
    id: 'usr-parent-amadi',
    name: 'Amadi Adebayo',
    email: 'amadi.adebayo@gmail.com',
    phone: '+2348030000004',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    totalSpent: 100000,
    wardCount: 1,
    isTutorVerified: false,
    tutorStatus: 'N/A'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    let formatted: any[] = []
    try {
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

      formatted = profiles.map(p => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        email: p.email,
        phone: p.phone || 'N/A',
        role: p.role || 'parent',
        avatar: p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: p.createdAt,
        totalSpent: Array.isArray(p.transactions) ? p.transactions.reduce((acc, t) => acc + (t.amount || 0), 0) : 0,
        wardCount: Array.isArray(p.students) ? p.students.length : 0,
        isTutorVerified: p.tutorProfile?.verified || false,
        tutorStatus: p.tutorProfile?.status || 'N/A'
      }))
    } catch (dbErr) {
      console.warn('DB fetch users fallback active')
    }

    if (!formatted || formatted.length === 0) {
      formatted = role && role !== 'All' ? DEFAULT_USERS.filter(u => u.role === role) : DEFAULT_USERS
    }

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(DEFAULT_USERS)
  }
}
