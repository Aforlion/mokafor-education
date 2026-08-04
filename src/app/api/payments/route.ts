import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, amount, plan } = body

    if (!name || !email || !amount || !plan) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // 1. Create or Find Parent Profile
    let parent = await db.profile.findUnique({
      where: { email }
    })

    if (!parent) {
      const splitName = name.split(' ')
      parent = await db.profile.create({
        data: {
          clerkId: `clerk_mock_pay_${Math.floor(Math.random() * 100000)}`,
          role: 'parent',
          firstName: splitName[0] || name,
          lastName: splitName.slice(1).join(' ') || 'Parent',
          email
        }
      })
    }

    // Convert amount string (e.g. ₦96,000) to integer
    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, '')) || 96000

    // 2. Create Transaction
    const transaction = await db.transaction.create({
      data: {
        parentId: parent.id,
        amount: parsedAmount,
        currency: 'NGN',
        paystackReference: 'MOK-PAY-' + Math.floor(100000 + Math.random() * 900000),
        paystackStatus: 'success',
        type: 'subscription',
        description: `Payment for ${plan} plan`
      }
    })

    return NextResponse.json({ success: true, reference: transaction.paystackReference })
  } catch (error) {
    console.error('Error creating payment transaction:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
