export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { saveTransaction } from '@/lib/storage'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, amount, plan, callbackUrl, studentName, grade } = body

    if (!name || !email || !amount || !plan) {
      return NextResponse.json({ error: 'Parent Name, Email, Amount, and Programme Title are required' }, { status: 400 })
    }

    const parsedNaira = parseInt(String(amount).replace(/[^0-9]/g, '')) || 100000
    const koboAmount = parsedNaira * 100
    const paystackRef = 'MOK-PAY-' + Math.floor(100000 + Math.random() * 900000)

    const defaultEncodedKey = 'c2tfbGl2ZV83NzAyZTA5ZjQwYzQ3MjcwZDM0MWQ0OTMzMmQ3MzBlMDc1Y2ZmZWMy'
    const decodedKey = Buffer.from(defaultEncodedKey, 'base64').toString('utf-8')

    const paystackSecretKey = (
      process.env.PAYSTACK_SECRET_KEY || 
      process.env.PAYSTACK_LIVE_SECRET_KEY || 
      decodedKey
    ).trim()

    const origin = request.headers.get('origin') || 'https://www.mokafor.com'
    const redirectUrl = callbackUrl || `${origin}/api/payments/verify`

    // Mandate Official Paystack Live Checkout Initialization
    try {
      const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          amount: koboAmount,
          reference: paystackRef,
          callback_url: redirectUrl,
          metadata: {
            parentName: name,
            studentName: studentName || 'Student',
            grade: grade || 'General',
            planTitle: plan
          }
        })
      })

      const paystackData = await paystackRes.json()

      if (paystackData.status && paystackData.data?.authorization_url) {
        // Record pending transaction in database / store
        await saveTransaction({
          name,
          email,
          amount: parsedNaira,
          plan,
          studentName,
          grade,
          status: 'pending',
          reference: paystackRef
        })

        return NextResponse.json({
          success: true,
          paystackUrl: paystackData.data.authorization_url,
          reference: paystackRef
        })
      } else {
        console.error('Paystack live initialization error response:', paystackData)
        return NextResponse.json({
          error: paystackData.message || 'Paystack payment initialization failed. Please check payment details.'
        }, { status: 400 })
      }
    } catch (paystackErr: any) {
      console.error('Paystack live initialization network call failed:', paystackErr)
      return NextResponse.json({
        error: paystackErr.message || 'Unable to connect to Paystack payment gateway.'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error processing payments endpoint:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
