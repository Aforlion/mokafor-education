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

      const { fulfillPaymentEntitlements } = await import('@/lib/fulfillment')
      await fulfillPaymentEntitlements({
        reference,
        email: customer.email,
        amountInKobo: amount,
        metadata: metadata || {}
      })
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error processing Paystack webhook:', error)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
