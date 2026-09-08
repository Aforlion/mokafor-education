import { NextResponse } from 'next/server'

// POST /api/admin/upload - Upload and process thumbnail image file
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Please upload an image file.' }, { status: 400 })
    }

    // Limit image size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image size exceeds 5MB limit.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64Image}`

    return NextResponse.json({
      success: true,
      url: dataUrl
    })
  } catch (error: any) {
    console.error('Error processing image upload:', error)
    return NextResponse.json({ success: false, error: error.message || 'Image upload failed' }, { status: 500 })
  }
}
