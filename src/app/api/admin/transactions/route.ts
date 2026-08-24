export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''

    let whereClause: any = {}

    if (query) {
      whereClause = {
        OR: [
          { paystackReference: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { parent: { firstName: { contains: query, mode: 'insensitive' } } },
          { parent: { lastName: { contains: query, mode: 'insensitive' } } },
          { parent: { email: { contains: query, mode: 'insensitive' } } }
        ]
      }
    }

    const transactions = await db.transaction.findMany({
      where: whereClause,
      include: {
        parent: true,
        student: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const formatted = transactions.map(tx => ({
      id: tx.id,
      reference: tx.paystackReference,
      parentName: `${tx.parent.firstName} ${tx.parent.lastName}`,
      parentEmail: tx.parent.email,
      studentName: tx.student ? `${tx.student.firstName} ${tx.student.lastName}` : 'N/A',
      amount: `₦${tx.amount.toLocaleString()}`,
      rawAmount: tx.amount,
      type: tx.type,
      description: tx.description || 'Subscription Payment',
      status: tx.paystackStatus || 'success',
      createdAt: tx.createdAt
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching admin transactions:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
