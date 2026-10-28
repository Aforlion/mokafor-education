export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAllTutors, saveTutor, updateTutor, deleteTutor } from '@/lib/storage'

// GET /api/admin/tutors - Fetch all tutors with optional ?status= filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const tutors = await getAllTutors(status)
    return NextResponse.json(tutors)
  } catch (error: any) {
    console.error('Error fetching admin tutors:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch tutors' }, { status: 500 })
  }
}

// POST /api/admin/tutors - Add a new vetted educator
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      name, 
      firstName, 
      lastName, 
      specialty, 
      email, 
      phone, 
      avatar, 
      bio, 
      subjects, 
      levels, 
      curricula, 
      hourlyRate, 
      rating, 
      verified, 
      status 
    } = body

    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim()
    if (!fullName) {
      return NextResponse.json({ error: 'Educator full name is required.' }, { status: 400 })
    }

    const subjectsArray = Array.isArray(subjects) 
      ? subjects 
      : (typeof subjects === 'string' ? subjects.split(',').map((s: string) => s.trim()).filter(Boolean) : ['Mathematics'])

    const levelsArray = Array.isArray(levels)
      ? levels
      : (typeof levels === 'string' ? levels.split(',').map((s: string) => s.trim()).filter(Boolean) : ['Primary'])

    const curriculaArray = Array.isArray(curricula)
      ? curricula
      : (typeof curricula === 'string' ? curricula.split(',').map((s: string) => s.trim()).filter(Boolean) : ['Loyola Jesuit'])

    const result = await saveTutor({
      name: fullName,
      specialty: specialty || 'Loyola Jesuit & Junior WAEC Specialist',
      email: email || `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@mokafor.com`,
      phone: phone || '',
      avatar: avatar || '/founder.jpg',
      bio: bio || '',
      subjects: subjectsArray,
      levels: levelsArray,
      curricula: curriculaArray,
      hourlyRate: hourlyRate ? parseInt(String(hourlyRate).replace(/[^0-9]/g, '')) || 25000 : 25000,
      rating: rating ? parseFloat(String(rating)) || 5.0 : 5.0,
      verified: verified !== undefined ? Boolean(verified) : true,
      status: status || 'active'
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error creating admin tutor:', error)
    return NextResponse.json({ error: error.message || 'Failed to create tutor profile' }, { status: 500 })
  }
}

// PUT /api/admin/tutors - Edit educator profile, picture, rate, status, or verification
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Tutor ID is required for editing.' }, { status: 400 })
    }

    if (data.name === undefined && (data.firstName || data.lastName)) {
      data.name = `${data.firstName || ''} ${data.lastName || ''}`.trim()
    }

    if (data.hourlyRate !== undefined) {
      data.hourlyRate = parseInt(String(data.hourlyRate).replace(/[^0-9]/g, '')) || 25000
    }

    if (data.rating !== undefined) {
      data.rating = parseFloat(String(data.rating)) || 5.0
    }

    if (data.subjects !== undefined && !Array.isArray(data.subjects)) {
      data.subjects = String(data.subjects).split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    if (data.levels !== undefined && !Array.isArray(data.levels)) {
      data.levels = String(data.levels).split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    if (data.curricula !== undefined && !Array.isArray(data.curricula)) {
      data.curricula = String(data.curricula).split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    const result = await updateTutor(id, data)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error updating admin tutor:', error)
    return NextResponse.json({ error: error.message || 'Failed to update tutor profile' }, { status: 500 })
  }
}

// DELETE /api/admin/tutors - Remove educator profile
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let id = searchParams.get('id')

    if (!id) {
      try {
        const body = await request.json()
        id = body.id
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json({ error: 'Tutor ID is required for deletion.' }, { status: 400 })
    }

    const result = await deleteTutor(id)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error deleting admin tutor:', error)
    return NextResponse.json({ error: error.message || 'Failed to remove tutor' }, { status: 500 })
  }
}
