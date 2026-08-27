export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAllTransactions } from '@/lib/storage'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let transactions = await getAllTransactions()

    if (status && status !== 'All') {
      transactions = transactions.filter(t => t.paystackStatus === status)
    }

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching admin transactions:', error)
    return NextResponse.json([], { status: 200 })
  }
}
