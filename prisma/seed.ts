import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Clean existing records
  await prisma.program.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.payout.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.lessonMaterial.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.student.deleteMany()
  await prisma.tutorProfile.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.paymentPlan.deleteMany()

  console.log('Cleared old database records.')

  // 1.5. Seed Programs
  const programsData = [
    {
      slug: 'common-entrance-loyola',
      title: 'Common Entrance & Loyola Preparation',
      category: 'Exam Prep',
      badge: 'Intensive Entrance Bootcamp',
      desc: 'An intensive preparation program for pupils seeking admission into Loyola Jesuit College and other top secondary schools. Covers Mathematics, English, Verbal Reasoning, Quantitative Reasoning, and interview preparation.',
      schedule: 'Flexible Weekly Sessions',
      duration: 'Monthly Intensive Track',
      fee: '₦100,000 per month',
      rawPrice: '₦100,000',
      popular: true,
      highlights: ['Mathematics & English', 'Verbal & Quantitative Reasoning', 'Mock Interview Prep'],
      order: 1
    },
    {
      slug: 'waec-neco-jamb',
      title: 'WAEC, NECO & JAMB Preparation',
      category: 'Exam Prep',
      badge: 'National Examination Coaching',
      desc: 'Focused coaching that helps students master the examination syllabus, solve past questions, improve speed and accuracy, and maximize their scores.',
      schedule: 'Flexible Weekly Classes',
      duration: 'Monthly Intensive Track',
      fee: '₦100,000 per month',
      rawPrice: '₦100,000',
      popular: false,
      highlights: ['Syllabus Mastery', 'Past Question Drills', 'Timed Exam Strategies'],
      order: 2
    },
    {
      slug: 'math-mastery',
      title: 'Mathematics Mastery Program',
      category: 'Subject Mastery',
      badge: 'Weekly Live Class',
      desc: 'A weekly live Mathematics program designed to help students build a strong foundation, strengthen problem-solving skills, and develop confidence in Mathematics. Suitable for Primary, Junior Secondary, and Senior Secondary students, and prepares learners for school examinations and competitive entrance exams.',
      schedule: 'Every Saturday',
      duration: '2 Hours per Class',
      fee: '₦10,000 per student',
      rawPrice: '₦10,000',
      popular: true,
      highlights: ['Primary, Junior & Senior Secondary', 'Problem-Solving Focus', 'Entrance & Exam Prep'],
      order: 3
    },
    {
      slug: 'english-mastery',
      title: 'English Mastery Program',
      category: 'Subject Mastery',
      badge: 'Weekly Live Class',
      desc: 'A weekly live English program designed to help students develop strong communication, reading, writing, grammar, vocabulary, and comprehension skills. Equips learners with the confidence and language proficiency needed to excel in school examinations and competitive entrance exams.',
      schedule: 'Every Saturday',
      duration: '2 Hours per Class',
      fee: '₦10,000 per student',
      rawPrice: '₦10,000',
      popular: false,
      highlights: ['Grammar & Composition', 'Vocabulary & Comprehension', 'Live Interactive Practice'],
      order: 4
    },
    {
      slug: 'sat-math-prep',
      title: 'SAT Mathematics Preparation',
      category: 'International',
      badge: 'International Standards',
      desc: 'A specialized program that prepares students for the SAT Mathematics section using international standards, test strategies, and extensive practice.',
      schedule: 'Bi-Weekly / Weekend Sessions',
      duration: 'Monthly Preparation',
      fee: '₦100,000 per month',
      rawPrice: '₦100,000',
      popular: true,
      highlights: ['SAT Test Strategies', 'Algebra & Advanced Math', 'Full-Length Mock Practice'],
      order: 5
    },
    {
      slug: 'ielts-prep',
      title: 'IELTS Preparation',
      category: 'International',
      badge: 'Language Proficiency',
      desc: 'Professional coaching for the IELTS examination, covering Listening, Reading, Writing, and Speaking with practical exercises and mock tests.',
      schedule: 'Flexible Timetable',
      duration: 'Monthly Coaching',
      fee: 'Starting from ₦100,000 per month',
      rawPrice: '₦100,000',
      popular: false,
      highlights: ['Listening & Reading Mastery', 'Writing & Essay Feedback', 'Live Speaking Sessions'],
      order: 6
    },
    {
      slug: 'one-on-one-tutoring',
      title: 'One-on-One Home & Online Tutoring',
      category: '1-on-1 & Bootcamps',
      badge: 'Personalized Tuition',
      desc: 'Personalized lessons tailored to each student’s learning needs, pace, and academic goals. Available both online and at home.',
      schedule: 'Customized Schedule',
      duration: 'Tailored Duration',
      fee: 'Available on request',
      rawPrice: 'Available on request',
      popular: false,
      highlights: ['Dedicated Vetted Educator', 'Home & Virtual Learning', 'Custom Pace & Materials'],
      order: 7
    },
    {
      slug: 'holiday-intensive',
      title: 'Holiday Intensive Program',
      category: '1-on-1 & Bootcamps',
      badge: 'Seasonal Bootcamp',
      desc: 'An engaging holiday learning program that strengthens students’ understanding of core subjects while preparing them for the next academic session.',
      schedule: 'Summer & Winter Breaks',
      duration: 'Full Session Bootcamp',
      fee: '₦100,000',
      rawPrice: '₦100,000',
      popular: false,
      highlights: ['Core Subject Reinforcement', 'Next Academic Term Prep', 'Interactive Projects'],
      order: 8
    },
    {
      slug: 'teacher-training',
      title: 'Teacher Training & Professional Development',
      category: 'Institutional',
      badge: 'Professional Development',
      desc: 'Training workshops for teachers on modern teaching strategies, classroom management, effective mathematics instruction, and educational technology.',
      schedule: 'Scheduled Workshops',
      duration: 'Module-based Training',
      fee: 'Available on request',
      rawPrice: 'Available on request',
      popular: false,
      highlights: ['Modern Pedagogy', 'Classroom Management', 'EdTech Tool Mastery'],
      order: 9
    },
    {
      slug: 'educational-consulting',
      title: 'Educational Consulting',
      category: 'Institutional',
      badge: 'Strategic Advisory',
      desc: 'Expert consulting services for parents, schools, and educational organizations on curriculum planning, academic improvement, staff development, and learning solutions.',
      schedule: 'By Appointment',
      duration: 'Consulting Engagement',
      fee: 'Available on request',
      rawPrice: 'Available on request',
      popular: false,
      highlights: ['Curriculum Design', 'Academic Performance Audit', 'Staff Development'],
      order: 10
    }
  ]

  for (const prog of programsData) {
    await prisma.program.create({ data: prog })
  }
  console.log('Seeded Educational Programs.')

  // 2. Create Payment Plans
  await prisma.paymentPlan.create({
    data: {
      name: 'Monthly 4-Session Plan',
      description: '4 sessions per month, ideal for midterm support.',
      amount: 52000,
      billingInterval: 'monthly',
      sessionCount: 4
    }
  })

  await prisma.paymentPlan.create({
    data: {
      name: 'Monthly 8-Session Plan',
      description: '8 sessions per month, standard learning support.',
      amount: 96000,
      billingInterval: 'monthly',
      sessionCount: 8
    }
  })

  await prisma.paymentPlan.create({
    data: {
      name: 'Termly 24-Session Package',
      description: '24 sessions per term, full semester backup.',
      amount: 270000,
      billingInterval: 'term',
      sessionCount: 24
    }
  })

  console.log('Seeded Payment Plans.')

  // 3. Create Profiles
  // Owner Admin Profile
  await prisma.profile.create({
    data: {
      clerkId: 'user_superadmin_owner',
      role: 'admin',
      firstName: 'ID Consulting',
      lastName: 'Owner',
      email: 'idconsultingltd@gmail.com',
      password: 'Brotherjohn77@',
      phone: '+2349078013408',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  })

  // Superadmin Profile
  await prisma.profile.create({
    data: {
      clerkId: 'user_superadmin_aforlion',
      role: 'admin',
      firstName: 'Super',
      lastName: 'Admin',
      email: 'aforlion007@gmail.com',
      password: 'Aforlion123!@#',
      phone: '+2348000000000',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  })

  // Tutor: Mark Okafor (CEO)
  const profileMark = await prisma.profile.create({
    data: {
      clerkId: 'user_tutor_mark',
      role: 'tutor',
      firstName: 'Mark',
      lastName: 'Okafor',
      email: 'mark@mokafor.com',
      phone: '+2348030000001',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      tutorProfile: {
        create: {
          bio: 'Founder & Chief Educator. Math Specialist & Consultant passionate about simplifying complex equations.',
          subjects: ['Mathematics'],
          levels: ['Junior Secondary', 'Senior Secondary'],
          curricula: ['WAEC', 'IGCSE', 'JAMB'],
          hourlyRate: 15000,
          verified: true,
          status: 'active',
          rating: 5.0,
          totalReviews: 12
        }
      }
    }
  })

  // Tutor: Jane Adebayo
  await prisma.profile.create({
    data: {
      clerkId: 'user_tutor_jane',
      role: 'tutor',
      firstName: 'Jane',
      lastName: 'Adebayo',
      email: 'jane.adebayo@mokafor.com',
      phone: '+2348030000002',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      tutorProfile: {
        create: {
          bio: 'Ph.D. in Applied Mathematics. 10+ years experience preparing students for A-Levels & IGCSE.',
          subjects: ['Mathematics', 'Physics'],
          levels: ['Senior Secondary'],
          curricula: ['IGCSE', 'A Levels'],
          hourlyRate: 12500,
          verified: true,
          status: 'active',
          rating: 4.9,
          totalReviews: 8
        }
      }
    }
  })

  // Tutor: Sarah Jenkins
  await prisma.profile.create({
    data: {
      clerkId: 'user_tutor_sarah',
      role: 'tutor',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'sarah.jenkins@mokafor.com',
      phone: '+2348030000003',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tutorProfile: {
        create: {
          bio: 'Experienced English Literature teacher. Specializes in IELTS, TOEFL & SAT prep.',
          subjects: ['English Language', 'Literature'],
          levels: ['Senior Secondary'],
          curricula: ['SAT', 'IELTS'],
          hourlyRate: 10000,
          verified: true,
          status: 'active',
          rating: 4.8,
          totalReviews: 6
        }
      }
    }
  })

  // Parent: Mrs. Amadi Adebayo
  const parentProfile = await prisma.profile.create({
    data: {
      clerkId: 'user_parent_amadi',
      role: 'parent',
      firstName: 'Amadi',
      lastName: 'Adebayo',
      email: 'amadi.adebayo@gmail.com',
      phone: '+2348030000004'
    }
  })

  console.log('Seeded Profiles & Tutors.')

  // 4. Create Student
  const student = await prisma.student.create({
    data: {
      parentId: parentProfile.id,
      firstName: 'Toby',
      lastName: 'Adebayo',
      gradeLevel: 'JSS3',
      curriculum: 'WAEC',
      learningGoals: ['Pass Junior WAEC Math with distinction', 'Improve algebraic problem-solving speed']
    }
  })

  console.log('Seeded Student.')

  // 5. Create Active Booking
  const booking = await prisma.booking.create({
    data: {
      studentId: student.id,
      tutorId: profileMark.id, // Mark Okafor (uses Mark profile ID directly since it matches tutor profile ID)
      subject: 'Mathematics',
      lessonType: 'one_on_one',
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      durationMinutes: 90,
      meetingLink: 'https://meet.google.com/mock-mokafor-lesson',
      notes: 'Focus on Quadratic Equations sheet review.'
    }
  })

  // 6. Create Assignment
  await prisma.assignment.create({
    data: {
      bookingId: booking.id,
      title: 'Quadratic Equations Homework Sheet 3',
      description: 'Solve problems 1 to 10. Show all workings clearly.',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      maxScore: 100
    }
  })

  console.log('Seeded Bookings & Assignments.')

  // 7. Seed Transactions
  await prisma.transaction.create({
    data: {
      parentId: parentProfile.id,
      studentId: student.id,
      amount: 96000,
      paystackReference: 'MOK-7788229911',
      paystackStatus: 'success',
      type: 'subscription',
      description: 'Payment for Monthly 8-Session Plan'
    }
  })

  // 8. Seed Progress Report
  await prisma.progressReport.create({
    data: {
      studentId: student.id,
      tutorId: profileMark.id,
      periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      attendanceRate: 94.0,
      overallScore: 85,
      strengths: ['Factoring quadratics', 'Linear graphs plotting'],
      areasForImprovement: ['Word problems setup', 'Indices rules speed'],
      tutorNotes: 'Exceptional aptitude. Ready for WAEC trials.'
    }
  })

  console.log('Seeded Transactions & Progress Reports.')
  console.log('Database Seeding Complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
