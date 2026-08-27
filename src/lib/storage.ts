import fs from 'fs'
import path from 'path'
import { db } from './db'

const DATA_DIR = path.join(process.cwd(), '.data')
const FILE_PATH = path.join(DATA_DIR, 'records.json')

interface LocalStore {
  assessments: any[]
  transactions: any[]
}

const inMemoryStore: LocalStore = {
  assessments: [
    {
      id: 'BOOK-MOK-889102',
      parentName: 'Mr. Amadi Adebayo',
      parentEmail: 'amadi.adebayo@gmail.com',
      parentPhone: '+2348030000004',
      studentName: 'Toby Adebayo',
      grade: 'JSS 3 (BECE)',
      curriculum: 'Common Entrance & Loyola Prep',
      tutorName: 'Mark Okafor',
      scheduledAt: new Date().toISOString(),
      meetingLink: 'https://meet.google.com/mock-mokafor-consultation',
      notes: 'Placement consultation requested by parent',
      status: 'scheduled',
      createdAt: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: 'MOK-PAY-778822',
      parentName: 'Mrs. Amadi Adebayo',
      parentEmail: 'amadi.adebayo@gmail.com',
      studentName: 'Toby Adebayo',
      amount: 100000,
      currency: 'NGN',
      paystackReference: 'MOK-PAY-778822',
      paystackStatus: 'success',
      type: 'subscription',
      description: 'Payment for Common Entrance & Loyola Prep plan',
      createdAt: new Date().toISOString()
    }
  ]
}

function getLocalStore(): LocalStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(inMemoryStore, null, 2))
      return inMemoryStore
    }
    const data = fs.readFileSync(FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    return inMemoryStore
  }
}

function saveLocalStore(store: LocalStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2))
  } catch (e) {
    // In-memory fallback for read-only hosts like Vercel
  }
}

// ------------------- ASSESSMENT / CONSULTATION BOOKING -------------------

export async function saveAssessmentBooking(data: {
  parentName: string
  parentEmail?: string
  parentPhone?: string
  studentName: string
  grade: string
  curriculum: string
  date: string
  time: string
}) {
  const bookingRef = 'BOOK-MOK-' + Math.floor(100000 + Math.random() * 900000)
  const scheduledDate = new Date(`${data.date}T${data.time || '10:00'}`)

  const record = {
    id: bookingRef,
    parentName: data.parentName || 'Parent',
    parentEmail: data.parentEmail || `${(data.parentName || 'parent').toLowerCase().replace(/\s+/g, '')}@mokafor.com`,
    parentPhone: data.parentPhone || 'N/A',
    studentName: data.studentName || 'Student',
    grade: data.grade || 'Primary/Secondary',
    curriculum: data.curriculum || 'General',
    tutorName: 'Mark Okafor',
    scheduledAt: isNaN(scheduledDate.getTime()) ? new Date().toISOString() : scheduledDate.toISOString(),
    meetingLink: 'https://meet.google.com/mock-mokafor-consultation',
    notes: `Placement consultation requested by parent ${data.parentName} for student ${data.studentName}`,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  }

  // Save in memory & local store safely
  inMemoryStore.assessments.unshift(record)
  const store = getLocalStore()
  store.assessments.unshift(record)
  saveLocalStore(store)

  // Attempt DB write safely if DB is online
  try {
    const parentEmail = record.parentEmail
    let parent = await db.profile.findUnique({ where: { email: parentEmail } })
    if (!parent) {
      const splitName = (data.parentName || 'Parent').split(' ')
      parent = await db.profile.create({
        data: {
          clerkId: `clerk_p_${Math.floor(Math.random() * 100000)}`,
          role: 'parent',
          firstName: splitName[0] || 'Parent',
          lastName: splitName.slice(1).join(' ') || 'Parent',
          email: parentEmail,
          phone: data.parentPhone || null
        }
      })
    }

    const splitStudentName = (data.studentName || 'Student').split(' ')
    const student = await db.student.create({
      data: {
        parentId: parent.id,
        firstName: splitStudentName[0] || 'Student',
        lastName: splitStudentName.slice(1).join(' ') || 'Student',
        gradeLevel: data.grade || 'General',
        curriculum: data.curriculum || 'General'
      }
    })

    let defaultTutor = await db.tutorProfile.findFirst()
    if (!defaultTutor) {
      let adminProf = await db.profile.findFirst({ where: { role: 'admin' } })
      if (!adminProf) {
        adminProf = await db.profile.create({
          data: {
            clerkId: `clerk_master_admin`,
            role: 'admin',
            firstName: 'Mark',
            lastName: 'Okafor',
            email: 'aforlion007@gmail.com'
          }
        })
      }
      defaultTutor = await db.tutorProfile.create({
        data: {
          id: adminProf.id,
          bio: 'Lead Education Specialist & Chief Executive Officer',
          subjects: ['Mathematics', 'Physics', 'Exam Prep'],
          levels: ['Primary', 'Junior Secondary', 'Senior Secondary'],
          curricula: ['WAEC', 'NECO', 'JAMB', 'British / IGCSE'],
          hourlyRate: 25000,
          rating: 5.0,
          verified: true,
          status: 'active'
        }
      })
    }

    await db.booking.create({
      data: {
        id: bookingRef,
        studentId: student.id,
        tutorId: defaultTutor.id,
        subject: 'Placement Assessment',
        lessonType: 'improvement',
        scheduledAt: isNaN(scheduledDate.getTime()) ? new Date() : scheduledDate,
        meetingLink: 'https://meet.google.com/mock-mokafor-consultation',
        notes: record.notes
      }
    })
  } catch (err) {
    console.warn('PostgreSQL DB write fallback active for assessment:', err)
  }

  return { success: true, bookingId: bookingRef }
}

export async function getAllAssessments() {
  const store = getLocalStore()
  let dbAssessments: any[] = []

  try {
    const bookings = await db.booking.findMany({
      include: {
        student: { include: { parent: true } },
        tutor: { include: { profile: true } }
      },
      orderBy: { scheduledAt: 'desc' }
    })

    dbAssessments = bookings.map(b => ({
      id: b.id,
      parentName: b.student?.parent ? `${b.student.parent.firstName} ${b.student.parent.lastName}` : 'Parent',
      parentEmail: b.student?.parent?.email || 'N/A',
      parentPhone: b.student?.parent?.phone || 'N/A',
      studentName: b.student ? `${b.student.firstName} ${b.student.lastName}` : 'Student',
      grade: b.student?.gradeLevel || 'Primary/Secondary',
      curriculum: b.student?.curriculum || 'National/British',
      tutorName: b.tutor?.profile ? `${b.tutor.profile.firstName} ${b.tutor.profile.lastName}` : 'Unassigned',
      scheduledAt: b.scheduledAt,
      meetingLink: b.meetingLink,
      notes: b.notes,
      status: b.status
    }))
  } catch (e) {
    console.warn('PostgreSQL offline, serving in-memory & local assessments store')
  }

  const map = new Map()
  for (const item of [...inMemoryStore.assessments, ...store.assessments, ...dbAssessments]) {
    if (item && item.id && !map.has(item.id)) {
      map.set(item.id, item)
    }
  }
  return Array.from(map.values())
}

// ------------------- ENROLLMENT & PAYSTACK TRANSACTIONS -------------------

export async function saveTransaction(data: {
  name: string
  email: string
  amount: string | number
  plan: string
  studentName?: string
  grade?: string
  status?: string
  reference?: string
}) {
  const parsedNaira = typeof data.amount === 'number' 
    ? data.amount 
    : (parseInt(String(data.amount).replace(/[^0-9]/g, '')) || 100000)

  const paystackRef = data.reference || ('MOK-PAY-' + Math.floor(100000 + Math.random() * 900000))

  const record = {
    id: paystackRef,
    parentName: data.name || 'Parent',
    parentEmail: data.email || 'parent@example.com',
    studentName: data.studentName || 'Student',
    grade: data.grade || 'General',
    amount: parsedNaira,
    currency: 'NGN',
    paystackReference: paystackRef,
    paystackStatus: data.status || 'success',
    type: 'subscription',
    description: `Payment for ${data.plan || 'Educational Programme'} plan`,
    createdAt: new Date().toISOString()
  }

  // Memory & Local save
  inMemoryStore.transactions.unshift(record)
  const store = getLocalStore()
  const existingIdx = store.transactions.findIndex(t => t && t.paystackReference === paystackRef)
  if (existingIdx >= 0) {
    store.transactions[existingIdx] = record
  } else {
    store.transactions.unshift(record)
  }
  saveLocalStore(store)

  // DB save attempt
  try {
    let parent = await db.profile.findUnique({ where: { email: data.email } })
    if (!parent) {
      const splitName = (data.name || 'Parent').split(' ')
      parent = await db.profile.create({
        data: {
          clerkId: `clerk_pay_${Math.floor(Math.random() * 100000)}`,
          role: 'parent',
          firstName: splitName[0] || 'Parent',
          lastName: splitName.slice(1).join(' ') || 'Parent',
          email: data.email
        }
      })
    }

    await db.transaction.upsert({
      where: { paystackReference: paystackRef },
      update: { paystackStatus: data.status || 'success', amount: parsedNaira },
      create: {
        parentId: parent.id,
        amount: parsedNaira,
        currency: 'NGN',
        paystackReference: paystackRef,
        paystackStatus: data.status || 'success',
        type: 'subscription',
        description: record.description
      }
    })
  } catch (err) {
    console.warn('PostgreSQL DB write fallback active for transaction:', err)
  }

  return { success: true, reference: paystackRef }
}

export async function getAllTransactions() {
  const store = getLocalStore()
  let dbTxs: any[] = []

  try {
    const transactions = await db.transaction.findMany({
      include: {
        parent: true,
        student: true
      },
      orderBy: { createdAt: 'desc' }
    })

    dbTxs = transactions.map(t => ({
      id: t.id,
      parentName: t.parent ? `${t.parent.firstName} ${t.parent.lastName}` : 'Parent',
      parentEmail: t.parent?.email || 'N/A',
      studentName: t.student ? `${t.student.firstName} ${t.student.lastName}` : 'N/A',
      amount: t.amount,
      currency: t.currency,
      paystackReference: t.paystackReference,
      paystackStatus: t.paystackStatus,
      type: t.type,
      description: t.description,
      createdAt: t.createdAt
    }))
  } catch (e) {
    console.warn('PostgreSQL offline, serving in-memory & local transactions store')
  }

  const map = new Map()
  for (const item of [...inMemoryStore.transactions, ...store.transactions, ...dbTxs]) {
    if (item && (item.paystackReference || item.id)) {
      const key = item.paystackReference || item.id
      if (!map.has(key)) {
        map.set(key, item)
      }
    }
  }
  return Array.from(map.values())
}
