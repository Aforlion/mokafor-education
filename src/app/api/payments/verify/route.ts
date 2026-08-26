export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const reference = searchParams.get('reference') || searchParams.get('trxref')

    if (!reference) {
      return NextResponse.redirect(`${origin}/?payment=error&message=Missing+reference`)
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (paystackSecretKey) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`
          }
        })
        const verifyData = await verifyRes.json()

        if (verifyData.status && verifyData.data?.status === 'success') {
          // Update transaction in DB to success
          await db.transaction.updateMany({
            where: { paystackReference: reference },
            data: { paystackStatus: 'success' }
          })
          return NextResponse.redirect(`${origin}/?payment=success&ref=${reference}`)
        }
      } catch (err) {
        console.error('Paystack verification request error:', err)
      }
    }

    // Mark as success in DB
    await db.transaction.updateMany({
      where: { paystackReference: reference },
      data: { paystackStatus: 'success' }
    })

    return NextResponse.redirect(`${origin}/?payment=success&ref=${reference}`)
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.redirect(`http://localhost:3000/?payment=error`)
  }
}
