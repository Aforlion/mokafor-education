import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY || ''
const resend = new Resend(resendApiKey)

// Sender Email Address
const FROM_EMAIL = 'Mokafor Global Education <notifications@mokafor.com>'
const FALLBACK_FROM_EMAIL = 'Mokafor Global Education <onboarding@resend.dev>'
const ADMIN_EMAIL = 'idconsultingltd@gmail.com'

/**
 * Shared HTML Email Layout Wrapper
 */
function getEmailTemplateWrapper(title: string, bodyContent: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; text-align: center; border-bottom: 4px solid #10b981; }
        .logo-text { color: #ffffff; font-size: 24px; font-weight: 800; tracking: -0.5px; }
        .sub-logo { color: #10b981; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-top: 4px; }
        .content { padding: 40px; text-align: left; line-height: 1.6; }
        .heading { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
        .card { background: #f1f5f9; border-radius: 16px; padding: 20px; margin: 20px 0; border: 1px solid #cbd5e1; font-size: 13px; }
        .card p { margin: 6px 0; color: #334155; }
        .card strong { color: #0f172a; }
        .badge { display: inline-block; background: #10b981; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; }
        .button { display: inline-block; background: linear-gradient(90deg, #10b981 0%, #0d9488 100%); color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 14px; font-weight: 800; font-size: 13px; margin: 20px 0; text-align: center; box-shadow: 0 4px 12px rgba(16,185,129,0.25); }
        .footer { background: #f8fafc; padding: 24px 40px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .footer a { color: #10b981; text-decoration: none; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-text">Mokafor Global Education</div>
          <div class="sub-logo">Academic Excellence & Global Placement</div>
        </div>
        <div class="content">
          ${bodyContent}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Mokafor Global Education. All rights reserved.</p>
          <p>3, Compassion road, Dagbana Estate, Karu Abuja • <a href="https://www.mokafor.com">www.mokafor.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Safe Resend Dispatch Wrapper
 */
async function safeSendEmail(params: { to: string; subject: string; html: string }) {
  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html
    })
    return res
  } catch (err: any) {
    console.warn('Sending via primary domain failed, attempting fallback sender:', err?.message)
    try {
      const fallbackRes = await resend.emails.send({
        from: FALLBACK_FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html
      })
      return fallbackRes
    } catch (fallbackErr) {
      console.error('Email dispatch error:', fallbackErr)
      return null
    }
  }
}

// ==================== TEMPLATE 1: PARENT CONSULTATION CONFIRMATION ====================
export async function sendConsultationConfirmationEmail(data: {
  parentName: string
  parentEmail: string
  studentName: string
  grade: string
  curriculum: string
  date: string
  time: string
  bookingRef: string
  meetingLink?: string
}) {
  const html = getEmailTemplateWrapper(
    'Consultation Confirmed - Mokafor Global Education',
    `
      <span class="badge">Placement Consultation</span>
      <h2 class="heading">Dear ${data.parentName},</h2>
      <p>Thank you for scheduling an academic placement consultation with <strong>Mokafor Global Education</strong>.</p>
      <p>Our senior education specialists have reserved your session for <strong>${data.studentName}</strong>. Below are your consultation details:</p>
      
      <div class="card">
        <p><strong>Booking Reference:</strong> <span style="color:#10b981; font-family:monospace; font-weight:bold;">${data.bookingRef}</span></p>
        <p><strong>Student Name:</strong> ${data.studentName} (${data.grade})</p>
        <p><strong>Target Curriculum/Track:</strong> ${data.curriculum}</p>
        <p><strong>Scheduled Date & Time:</strong> ${data.date} at ${data.time}</p>
        <p><strong>Consultation Link:</strong> <a href="${data.meetingLink || 'https://meet.google.com/mock-mokafor-consultation'}" style="color:#10b981;">Join Google Meet Call</a></p>
      </div>

      <p>Our lead educator will guide you through your child's academic roadmap, diagnostic assessment requirements, and tailored tutor matching.</p>
      <a href="${data.meetingLink || 'https://meet.google.com/mock-mokafor-consultation'}" class="button">Join Virtual Consultation Room</a>
      <p style="font-size:12px; color:#64748b;">If you need to adjust your scheduled time, please reply directly to this email or contact us at <a href="mailto:notifications@mokafor.com">notifications@mokafor.com</a>.</p>
    `
  )

  return safeSendEmail({
    to: data.parentEmail,
    subject: `Consultation Confirmed: ${data.studentName} (${data.bookingRef})`,
    html
  })
}

// ==================== TEMPLATE 2: EXECUTIVE ADMIN CONSULTATION ALERT ====================
export async function sendAdminConsultationAlertEmail(data: {
  parentName: string
  parentEmail: string
  parentPhone: string
  studentName: string
  grade: string
  curriculum: string
  date: string
  time: string
  bookingRef: string
}) {
  const html = getEmailTemplateWrapper(
    'New Placement Consultation Request',
    `
      <span class="badge" style="background:#6366f1;">New Lead Alert</span>
      <h2 class="heading">New Placement Consultation Submitted</h2>
      <p>A new consultation request has been placed on the website and recorded in the Executive Admin Portal.</p>
      
      <div class="card">
        <p><strong>Booking Ref:</strong> ${data.bookingRef}</p>
        <p><strong>Parent Name:</strong> ${data.parentName}</p>
        <p><strong>Parent Email:</strong> ${data.parentEmail}</p>
        <p><strong>Phone Number:</strong> ${data.parentPhone}</p>
        <p><strong>Student Name:</strong> ${data.studentName} (${data.grade})</p>
        <p><strong>Target Track:</strong> ${data.curriculum}</p>
        <p><strong>Requested Time:</strong> ${data.date} at ${data.time}</p>
      </div>

      <a href="https://www.mokafor.com/admin" class="button">Open Admin Control Center</a>
    `
  )

  return safeSendEmail({
    to: ADMIN_EMAIL,
    subject: `🚨 New Consultation: ${data.parentName} - ${data.studentName}`,
    html
  })
}

// ==================== TEMPLATE 3: ENROLLMENT & PAYSTACK TUITION RECEIPT ====================
export async function sendEnrollmentReceiptEmail(data: {
  parentName: string
  parentEmail: string
  studentName: string
  programTitle: string
  amountPaid: string
  paystackRef: string
  date: string
}) {
  const html = getEmailTemplateWrapper(
    'Payment Receipt & Enrollment Confirmation',
    `
      <span class="badge" style="background:#10b981;">Payment Received</span>
      <h2 class="heading">Enrollment Confirmed!</h2>
      <p>Dear <strong>${data.parentName}</strong>,</p>
      <p>We have successfully received your tuition payment for <strong>${data.programTitle}</strong>. ${data.studentName}'s slot is now secured.</p>
      
      <div class="card">
        <p><strong>Paystack Reference:</strong> <span style="color:#10b981; font-family:monospace;">${data.paystackRef}</span></p>
        <p><strong>Programme Enrolled:</strong> ${data.programTitle}</p>
        <p><strong>Student Name:</strong> ${data.studentName}</p>
        <p><strong>Amount Paid:</strong> <strong style="font-size:16px; color:#10b981;">${data.amountPaid}</strong></p>
        <p><strong>Payment Status:</strong> Successful (Paystack Live)</p>
        <p><strong>Date:</strong> ${data.date}</p>
      </div>

      <p>Our academic coordinator is setting up ${data.studentName}'s portal access and custom timetable.</p>
      <a href="https://www.mokafor.com" class="button">Access Student & Parent Portal</a>
    `
  )

  return safeSendEmail({
    to: data.parentEmail,
    subject: `Payment Receipt: ${data.programTitle} (${data.paystackRef})`,
    html
  })
}

// ==================== TEMPLATE 4: EXECUTIVE ADMIN REVENUE ALERT ====================
export async function sendAdminRevenueAlertEmail(data: {
  parentName: string
  parentEmail: string
  amountPaid: string
  programTitle: string
  paystackRef: string
}) {
  const html = getEmailTemplateWrapper(
    'Revenue Alert - Paystack Payment Successful',
    `
      <span class="badge" style="background:#059669;">Revenue Alert</span>
      <h2 class="heading">Tuition Payment Received!</h2>
      <p>A new live payment has been processed via Paystack and recorded in the Revenue Ledger.</p>
      
      <div class="card">
        <p><strong>Amount Received:</strong> <strong style="font-size:18px; color:#10b981;">${data.amountPaid}</strong></p>
        <p><strong>Parent Name:</strong> ${data.parentName} (${data.parentEmail})</p>
        <p><strong>Programme:</strong> ${data.programTitle}</p>
        <p><strong>Paystack Ref:</strong> ${data.paystackRef}</p>
      </div>

      <a href="https://www.mokafor.com/admin" class="button">View Revenue Ledger</a>
    `
  )

  return safeSendEmail({
    to: ADMIN_EMAIL,
    subject: `💰 Payment Received: ${data.amountPaid} from ${data.parentName}`,
    html
  })
}

// ==================== TEMPLATE 5: TUTOR STUDENT ASSIGNMENT NOTICE ====================
export async function sendTutorAssignmentEmail(data: {
  tutorName: string
  tutorEmail: string
  studentName: string
  grade: string
  curriculum: string
  schedule: string
  meetingLink: string
}) {
  const html = getEmailTemplateWrapper(
    'New Student Assignment Notice',
    `
      <span class="badge" style="background:#6366f1;">New Student Match</span>
      <h2 class="heading">Hello ${data.tutorName},</h2>
      <p>You have been assigned a new student for academic instruction under Mokafor Global Education.</p>
      
      <div class="card">
        <p><strong>Student Name:</strong> ${data.studentName}</p>
        <p><strong>Grade Level:</strong> ${data.grade}</p>
        <p><strong>Target Curriculum:</strong> ${data.curriculum}</p>
        <p><strong>Schedule:</strong> ${data.schedule}</p>
        <p><strong>Classroom Link:</strong> <a href="${data.meetingLink}" style="color:#10b981;">${data.meetingLink}</a></p>
      </div>

      <a href="${data.meetingLink}" class="button">Open Virtual Classroom</a>
    `
  )

  return safeSendEmail({
    to: data.tutorEmail,
    subject: `New Student Assignment: ${data.studentName} (${data.grade})`,
    html
  })
}

// ==================== TEMPLATE 6: MONTHLY STUDENT PROGRESS REPORT ====================
export async function sendProgressReportEmail(data: {
  parentName: string
  parentEmail: string
  studentName: string
  attendanceRate: number
  overallScore: number
  tutorNotes: string
}) {
  const html = getEmailTemplateWrapper(
    'Monthly Academic Progress Report',
    `
      <span class="badge" style="background:#0284c7;">Progress Report</span>
      <h2 class="heading">Dear ${data.parentName},</h2>
      <p>Your monthly academic progress report for <strong>${data.studentName}</strong> is now available.</p>
      
      <div class="card">
        <p><strong>Student Name:</strong> ${data.studentName}</p>
        <p><strong>Attendance Rate:</strong> ${data.attendanceRate}%</p>
        <p><strong>Overall Score:</strong> ${data.overallScore}%</p>
        <p><strong>Educator Remarks:</strong> "${data.tutorNotes}"</p>
      </div>

      <a href="https://www.mokafor.com" class="button">View Complete Report in Portal</a>
    `
  )

  return safeSendEmail({
    to: data.parentEmail,
    subject: `Academic Progress Report: ${data.studentName}`,
    html
  })
}
