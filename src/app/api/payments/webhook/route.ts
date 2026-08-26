export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const paystackSignature = request.headers.get('x-paystack-signature')
    const secretKey = process.env.PAYSTACK_SECRET_KEY

    // Verify Paystack Signature if secret key is present
    if (secretKey && paystackSignature) {
      const hash = crypto.createHmac('sha512', secretKey).update(body).digest('hex')
      if (hash !== paystackSignature) {
        return NextResponse.json({ error: 'Invalid Paystack signature' }, { status: 400 })
      }
    }

    const event = JSON.parse(body)

    if (event.event === 'charge.success') {
      const { reference, amount, customer, metadata } = event.data
      const amountInNaira = Math.round((amount || 0) / 100)

      // 1. Find or Create Parent Profile
      let parent = await db.profile.findUnique({
        where: { email: customer.email }
      })

      if (!parent) {
        parent = await db.profile.create({
          data: {
            clerkId: `clerk_paystack_${Math.floor(Math.random() * 100000)}`,
            role: 'parent',
            firstName: metadata?.parentName || customer.first_name || 'Customer',
            lastName: customer.last_name || 'Parent',
            email: customer.email,
            phone: customer.phone || null
          }
        })
      }

      // 2. Upsert Transaction in DB
      const existing = await db.transaction.findUnique({
        where: { paystackReference: reference }
      })

      if (existing) {
        await db.transaction.update({
          where: { paystackReference: reference },
          data: { paystackStatus: 'success', amount: amountInNaira }
        })
      } else {
        await db.transaction.create({
          data: {
            parentId: parent.id,
            amount: amountInNaira,
            currency: 'NGN',
            paystackReference: reference,
            paystackStatus: 'success',
            type: 'subscription',
            description: `Payment for ${metadata?.planTitle || 'Programme Tuition'}`
          }
        })
      }
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error processing Paystack webhook:', error)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
