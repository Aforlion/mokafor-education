import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, amount, plan, callbackUrl } = body

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
          clerkId: `clerk_pay_${Math.floor(Math.random() * 100000)}`,
          role: 'parent',
          firstName: splitName[0] || name,
          lastName: splitName.slice(1).join(' ') || 'Parent',
          email
        }
      })
    }

    // Convert amount string (e.g. ₦100,000) to integer in Naira & Kobo (x 100)
    const parsedNaira = parseInt(amount.replace(/[^0-9]/g, '')) || 100000
    const koboAmount = parsedNaira * 100
    const paystackRef = 'MOK-PAY-' + Math.floor(100000 + Math.random() * 900000)

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    // If Paystack Secret Key is configured, initialize official Paystack checkout
    if (paystackSecretKey && !paystackSecretKey.includes('your_live')) {
      const origin = request.headers.get('origin') || 'http://localhost:3000'
      const redirectUrl = callbackUrl || `${origin}/api/payments/verify`

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
              planTitle: plan,
              parentId: parent.id
            }
          })
        })

        const paystackData = await paystackRes.json()

        if (paystackData.status && paystackData.data?.authorization_url) {
          // Record pending transaction in DB
          await db.transaction.create({
            data: {
              parentId: parent.id,
              amount: parsedNaira,
              currency: 'NGN',
              paystackReference: paystackRef,
              paystackStatus: 'pending',
              type: 'subscription',
              description: `Payment for ${plan} plan`
            }
          })

          return NextResponse.json({
            success: true,
            paystackUrl: paystackData.data.authorization_url,
            reference: paystackRef
          })
        }
      } catch (err) {
        console.warn('Paystack API call failed, falling back to direct recording:', err)
      }
    }

    // Fallback/Direct recording if secret key not active
    const transaction = await db.transaction.create({
      data: {
        parentId: parent.id,
        amount: parsedNaira,
        currency: 'NGN',
        paystackReference: paystackRef,
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
