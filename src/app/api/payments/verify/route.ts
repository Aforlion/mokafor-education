export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { fulfillPaymentEntitlements } from '@/lib/fulfillment'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    const queryCourseSlug = searchParams.get('courseSlug')

    if (!reference) {
      return NextResponse.redirect(`${origin}/?payment=error&message=Missing+reference`)
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_LIVE_SECRET_KEY

    let verifiedCustomerEmail = ''
    let verifiedAmountKobo = 0
    let verifiedMetadata: any = {}
    let isPaymentValid = false

    if (paystackSecretKey) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`
          }
        })
        const verifyData = await verifyRes.json()

        if (verifyData.status && verifyData.data?.status === 'success') {
          isPaymentValid = true
          verifiedCustomerEmail = verifyData.data?.customer?.email || ''
          verifiedAmountKobo = verifyData.data?.amount || 0
          verifiedMetadata = verifyData.data?.metadata || {}
        } else {
          console.warn('Paystack transaction was not successful:', verifyData)
        }
      } catch (err) {
        console.error('Paystack verification request error:', err)
      }
    }

    // Fallback: check transaction table in DB if already logged
    if (!isPaymentValid) {
      const existingTx = await db.transaction.findUnique({
        where: { paystackReference: reference },
        include: { parent: true }
      })
      if (existingTx) {
        isPaymentValid = true
        verifiedCustomerEmail = existingTx.parent?.email || ''
        verifiedAmountKobo = (existingTx.amount || 0) * 100
        verifiedMetadata = (existingTx.metadata as any) || {}
      }
    }

    // Merge URL courseSlug into metadata if present
    if (queryCourseSlug && !verifiedMetadata.courseSlug) {
      verifiedMetadata.courseSlug = queryCourseSlug
    }

    // If verified, execute complete idempotent entitlement fulfillment
    if (isPaymentValid && verifiedCustomerEmail) {
      await fulfillPaymentEntitlements({
        reference,
        email: verifiedCustomerEmail,
        amountInKobo: verifiedAmountKobo,
        metadata: verifiedMetadata
      })
    }

    // Construct smart destination redirect
    let targetRedirect = `${origin}/?payment=success&ref=${encodeURIComponent(reference)}`
    
    const targetSlug = verifiedMetadata.courseSlug || queryCourseSlug
    if (targetSlug) {
      targetRedirect = `${origin}/courses/${encodeURIComponent(targetSlug)}?payment=success&email=${encodeURIComponent(verifiedCustomerEmail)}&ref=${encodeURIComponent(reference)}`
    } else if (verifiedMetadata.studentName || verifiedMetadata.planTitle) {
      targetRedirect = `${origin}/?tab=portals&payment=success&email=${encodeURIComponent(verifiedCustomerEmail)}&ref=${encodeURIComponent(reference)}`
    }

    const response = NextResponse.redirect(targetRedirect)
    
    if (verifiedCustomerEmail) {
      response.cookies.set('mokafor_user_email', verifiedCustomerEmail, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
      })
    }

    return response
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.redirect(`${new URL(request.url).origin}/?payment=error`)
  }
}
