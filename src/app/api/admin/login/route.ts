export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Check default Superadmin credentials fallback or DB Profile
    const normalizedEmail = email.toLowerCase().trim()

    if (normalizedEmail === 'aforlion007@gmail.com' && password === 'Aforlion123!@#') {
      return NextResponse.json({
        success: true,
        user: {
          name: 'Super Admin (Aforlion)',
          email: 'aforlion007@gmail.com',
          role: 'superadmin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        }
      })
    }

    // Try finding admin profile in DB
    try {
      const userProfile = await db.profile.findFirst({
        where: { email: normalizedEmail, role: { in: ['admin', 'superadmin'] } }
      })

      if (userProfile && userProfile.password === password) {
        return NextResponse.json({
          success: true,
          user: {
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            email: userProfile.email,
            role: userProfile.role,
            avatar: userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          }
        })
      }
    } catch (e) {
      console.warn('DB check fallback used')
    }

    return NextResponse.json({ error: 'Invalid Superadmin credentials' }, { status: 401 })
  } catch (error) {
    console.error('Error during admin login:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
