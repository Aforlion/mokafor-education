import fs from 'fs'
import path from 'path'
import { db } from './db'

const DATA_DIR = path.join(process.cwd(), '.data')
const FILE_PATH = path.join(DATA_DIR, 'records.json')

interface LocalStore {
  assessments: any[]
  transactions: any[]
  tutors: any[]
}

export const DEFAULT_STORED_TUTORS = [
  {
    id: 'tutor-mark-okafor',
    profileId: 'prof-mark-1',
    name: 'Mark Okafor',
    specialty: 'Loyola Jesuit & Junior WAEC Specialist',
    email: 'mark@mokafor.com',
    phone: '+2348030000001',
    avatar: '/founder.jpg',
    bio: 'Founder & Chief Educator. Loyola Jesuit & Junior WAEC Master Educator passionate about simplifying complex equations and guiding learners to top exam rankings.',
    subject: 'Mathematics',
    grade: 'Primary',
    curriculum: 'Loyola Jesuit',
    subjects: ['Mathematics', 'Further Mathematics', 'Quantitative Reasoning'],
    levels: ['Primary', 'Junior Secondary', 'Senior Secondary'],
    curricula: ['Loyola Jesuit', 'Junior WAEC', 'WAEC', 'IGCSE', 'JAMB', 'SAT'],
    hourlyRate: 30000,
    fee: '₦30,000/hr',
    rating: 5.0,
    totalReviews: 12,
    verified: true,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tutor-jane-alabi',
    profileId: 'prof-jane-2',
    name: 'Jane Alabi',
    specialty: 'Loyola Jesuit & Junior WAEC Specialist',
    email: 'jane.alabi@mokafor.com',
    phone: '+2348030000002',
    avatar: '/tutors/jane_alabi.png',
    bio: 'Loyola Jesuit Entrance & Junior WAEC (BECE) Specialist. 10+ years experience guiding students through Loyola Jesuit mock drills, Junior WAEC excellence, and IGCSE Mathematics mastery.',
    subject: 'Mathematics',
    grade: 'Junior Secondary',
    curriculum: 'Loyola Jesuit',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    levels: ['Junior Secondary', 'Senior Secondary'],
    curricula: ['Loyola Jesuit', 'Junior WAEC', 'IGCSE', 'A Levels', 'WAEC'],
    hourlyRate: 20000,
    fee: '₦20,000/hr',
    rating: 4.9,
    totalReviews: 8,
    verified: true,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tutor-victor-elendu',
    profileId: 'prof-victor-3',
    name: 'Victor Elendu',
    specialty: 'Loyola Jesuit & Junior WAEC Specialist',
    email: 'victor.elendu@mokafor.com',
    phone: '+2348030000003',
    avatar: '/tutors/victor_elendu.png',
    bio: 'Loyola Jesuit & Junior WAEC (BECE) English Specialist. Expert in Verbal Reasoning, IELTS, TOEFL, SAT Reading & Writing, and WAEC English Literature mastery.',
    subject: 'English Language',
    grade: 'Junior Secondary',
    curriculum: 'Loyola Jesuit',
    subjects: ['English Language', 'Verbal Reasoning', 'Literature in English'],
    levels: ['Junior Secondary', 'Senior Secondary'],
    curricula: ['Loyola Jesuit', 'Junior WAEC', 'SAT', 'IELTS', 'WAEC'],
    hourlyRate: 20000,
    fee: '₦20,000/hr',
    rating: 4.8,
    totalReviews: 6,
    verified: true,
    status: 'active',
    createdAt: new Date().toISOString()
  }
]

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
  ],
  tutors: [...DEFAULT_STORED_TUTORS]
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
    const parsed = JSON.parse(data)
    if (!parsed.tutors || !Array.isArray(parsed.tutors) || parsed.tutors.length === 0) {
      parsed.tutors = [...DEFAULT_STORED_TUTORS]
      saveLocalStore(parsed)
    }
    return parsed
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

    dbAssessments = bookings.map((b: any) => ({
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
  const existingIdx = store.transactions.findIndex((t: any) => t && t.paystackReference === paystackRef)
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

    dbTxs = transactions.map((t: any) => ({
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

// ------------------- VETTED EDUCATORS / TUTORS -------------------

export async function getAllTutors(filterStatus?: string) {
  const store = getLocalStore()
  let dbTutors: any[] = []

  try {
    const tutors = await db.tutorProfile.findMany({
      include: { profile: true },
      orderBy: { rating: 'desc' }
    })

    dbTutors = tutors.map((t: any) => ({
      id: t.id,
      profileId: t.profile?.id || t.id,
      name: t.profile ? `${t.profile.firstName} ${t.profile.lastName}`.trim() : 'Tutor',
      specialty: t.qualifications?.specialty || 'Loyola Jesuit & Junior WAEC Specialist',
      email: t.profile?.email || 'N/A',
      phone: t.profile?.phone || 'N/A',
      avatar: t.profile?.avatarUrl || '/founder.jpg',
      bio: t.bio || '',
      subject: t.subjects?.[0] || 'Mathematics',
      grade: t.levels?.[0] || 'Primary',
      curriculum: t.curricula?.[0] || 'Loyola Jesuit',
      subjects: t.subjects || ['Mathematics'],
      levels: t.levels || ['Primary'],
      curricula: t.curricula || ['Loyola Jesuit'],
      hourlyRate: t.hourlyRate || 25000,
      fee: `₦${(t.hourlyRate || 25000).toLocaleString()}/hr`,
      rating: t.rating || 5.0,
      totalReviews: t.totalReviews || 1,
      verified: t.verified !== undefined ? t.verified : true,
      status: t.status || 'active',
      createdAt: t.profile?.createdAt?.toISOString?.() || new Date().toISOString()
    }))
  } catch (e) {
    // DB offline or unreachable, fallback to file & in-memory store
  }

  const map = new Map<string, any>()
  for (const t of DEFAULT_STORED_TUTORS) {
    map.set(t.id, { ...t })
  }
  for (const t of inMemoryStore.tutors || []) {
    if (t && t.id) map.set(t.id, { ...t })
  }
  for (const t of store.tutors || []) {
    if (t && t.id) map.set(t.id, { ...t })
  }
  for (const t of dbTutors) {
    if (t && t.id) map.set(t.id, { ...t })
  }

  let result = Array.from(map.values())
  if (filterStatus && filterStatus !== 'All') {
    result = result.filter(t => t.status === filterStatus)
  }
  return result
}

export async function saveTutor(data: {
  name: string
  specialty?: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  subjects?: string[]
  levels?: string[]
  curricula?: string[]
  hourlyRate?: number
  rating?: number
  verified?: boolean
  status?: string
}) {
  const tutorId = `tutor-${(data.name || 'educator').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`
  const hourlyRate = data.hourlyRate ? Number(data.hourlyRate) : 25000
  const subjects = data.subjects && data.subjects.length > 0 ? data.subjects : ['Mathematics']
  const levels = data.levels && data.levels.length > 0 ? data.levels : ['Primary']
  const curricula = data.curricula && data.curricula.length > 0 ? data.curricula : ['Loyola Jesuit']
  const specialty = data.specialty || 'Loyola Jesuit & Junior WAEC Specialist'

  const newTutor = {
    id: tutorId,
    profileId: tutorId,
    name: data.name.trim(),
    specialty,
    email: data.email.trim(),
    phone: data.phone?.trim() || '',
    avatar: data.avatar || '/founder.jpg',
    bio: data.bio || '',
    subject: subjects[0] || 'Mathematics',
    grade: levels[0] || 'Primary',
    curriculum: curricula[0] || 'Loyola Jesuit',
    subjects,
    levels,
    curricula,
    hourlyRate,
    fee: `₦${hourlyRate.toLocaleString()}/hr`,
    rating: data.rating !== undefined ? Number(data.rating) : 5.0,
    totalReviews: 1,
    verified: data.verified !== undefined ? Boolean(data.verified) : true,
    status: data.status || 'active',
    createdAt: new Date().toISOString()
  }

  if (!inMemoryStore.tutors) inMemoryStore.tutors = [...DEFAULT_STORED_TUTORS]
  inMemoryStore.tutors.unshift(newTutor)

  const store = getLocalStore()
  if (!store.tutors) store.tutors = [...DEFAULT_STORED_TUTORS]
  store.tutors.unshift(newTutor)
  saveLocalStore(store)

  try {
    const splitName = newTutor.name.split(' ')
    const firstName = splitName[0] || 'Tutor'
    const lastName = splitName.slice(1).join(' ') || ''

    await db.profile.create({
      data: {
        id: tutorId,
        clerkId: `clerk_${tutorId}`,
        role: 'tutor',
        firstName,
        lastName,
        email: newTutor.email || `${tutorId}@mokafor.com`,
        phone: newTutor.phone || null,
        avatarUrl: newTutor.avatar,
        tutorProfile: {
          create: {
            bio: newTutor.bio,
            subjects: newTutor.subjects,
            levels: newTutor.levels,
            curricula: newTutor.curricula,
            hourlyRate: newTutor.hourlyRate,
            rating: newTutor.rating,
            totalReviews: newTutor.totalReviews,
            verified: newTutor.verified,
            status: newTutor.status,
            qualifications: { specialty: newTutor.specialty }
          }
        }
      }
    })
  } catch (err) {
    console.warn('PostgreSQL write fallback active for tutor:', err)
  }

  return { success: true, tutor: newTutor }
}

export async function updateTutor(id: string, data: any) {
  const store = getLocalStore()
  if (!store.tutors) store.tutors = [...DEFAULT_STORED_TUTORS]
  if (!inMemoryStore.tutors) inMemoryStore.tutors = [...DEFAULT_STORED_TUTORS]

  let existing = store.tutors.find((t: any) => t.id === id) || inMemoryStore.tutors.find((t: any) => t.id === id)
  if (!existing) {
    existing = DEFAULT_STORED_TUTORS.find(t => t.id === id)
  }

  const subjects = data.subjects ? (Array.isArray(data.subjects) ? data.subjects : data.subjects.split(',').map((s: string) => s.trim()).filter(Boolean)) : existing?.subjects || ['Mathematics']
  const levels = data.levels ? (Array.isArray(data.levels) ? data.levels : data.levels.split(',').map((s: string) => s.trim()).filter(Boolean)) : existing?.levels || ['Primary']
  const curricula = data.curricula ? (Array.isArray(data.curricula) ? data.curricula : data.curricula.split(',').map((s: string) => s.trim()).filter(Boolean)) : existing?.curricula || ['Loyola Jesuit']
  const hourlyRate = data.hourlyRate !== undefined ? Number(data.hourlyRate) : existing?.hourlyRate || 25000

  const updatedTutor = {
    ...existing,
    id,
    profileId: existing?.profileId || id,
    name: data.name !== undefined ? data.name.trim() : (existing?.name || 'Tutor'),
    specialty: data.specialty !== undefined ? data.specialty : (existing?.specialty || 'Loyola Jesuit & Junior WAEC Specialist'),
    email: data.email !== undefined ? data.email.trim() : (existing?.email || ''),
    phone: data.phone !== undefined ? data.phone.trim() : (existing?.phone || ''),
    avatar: data.avatar !== undefined ? data.avatar : (existing?.avatar || '/founder.jpg'),
    bio: data.bio !== undefined ? data.bio : (existing?.bio || ''),
    subject: subjects[0] || 'Mathematics',
    grade: levels[0] || 'Primary',
    curriculum: curricula[0] || 'Loyola Jesuit',
    subjects,
    levels,
    curricula,
    hourlyRate,
    fee: `₦${hourlyRate.toLocaleString()}/hr`,
    rating: data.rating !== undefined ? Number(data.rating) : (existing?.rating || 5.0),
    totalReviews: data.totalReviews !== undefined ? Number(data.totalReviews) : (existing?.totalReviews || 1),
    verified: data.verified !== undefined ? Boolean(data.verified) : (existing?.verified ?? true),
    status: data.status !== undefined ? data.status : (existing?.status || 'active'),
    updatedAt: new Date().toISOString()
  }

  const memIdx = inMemoryStore.tutors.findIndex((t: any) => t.id === id)
  if (memIdx >= 0) inMemoryStore.tutors[memIdx] = updatedTutor
  else inMemoryStore.tutors.unshift(updatedTutor)

  const storeIdx = store.tutors.findIndex((t: any) => t.id === id)
  if (storeIdx >= 0) store.tutors[storeIdx] = updatedTutor
  else store.tutors.unshift(updatedTutor)
  saveLocalStore(store)

  try {
    const splitName = (updatedTutor.name || '').split(' ')
    const firstName = splitName[0] || 'Tutor'
    const lastName = splitName.slice(1).join(' ') || ''

    await db.profile.update({
      where: { id: updatedTutor.profileId || id },
      data: {
        firstName,
        lastName,
        email: updatedTutor.email,
        phone: updatedTutor.phone,
        avatarUrl: updatedTutor.avatar,
        tutorProfile: {
          upsert: {
            create: {
              bio: updatedTutor.bio,
              subjects: updatedTutor.subjects,
              levels: updatedTutor.levels,
              curricula: updatedTutor.curricula,
              hourlyRate: updatedTutor.hourlyRate,
              rating: updatedTutor.rating,
              verified: updatedTutor.verified,
              status: updatedTutor.status,
              qualifications: { specialty: updatedTutor.specialty }
            },
            update: {
              bio: updatedTutor.bio,
              subjects: updatedTutor.subjects,
              levels: updatedTutor.levels,
              curricula: updatedTutor.curricula,
              hourlyRate: updatedTutor.hourlyRate,
              rating: updatedTutor.rating,
              verified: updatedTutor.verified,
              status: updatedTutor.status,
              qualifications: { specialty: updatedTutor.specialty }
            }
          }
        }
      }
    })
  } catch (err) {
    console.warn('PostgreSQL update fallback active for tutor:', err)
  }

  return { success: true, tutor: updatedTutor }
}

export async function deleteTutor(id: string) {
  const store = getLocalStore()
  if (!store.tutors) store.tutors = [...DEFAULT_STORED_TUTORS]
  if (!inMemoryStore.tutors) inMemoryStore.tutors = [...DEFAULT_STORED_TUTORS]

  store.tutors = store.tutors.filter((t: any) => t.id !== id)
  inMemoryStore.tutors = inMemoryStore.tutors.filter((t: any) => t.id !== id)
  saveLocalStore(store)

  try {
    await db.tutorProfile.delete({ where: { id } }).catch(() => {})
    await db.profile.delete({ where: { id } }).catch(() => {})
  } catch (err) {
    console.warn('PostgreSQL delete fallback active for tutor:', err)
  }

  return { success: true, message: 'Tutor deleted successfully' }
}
