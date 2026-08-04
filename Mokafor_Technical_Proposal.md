# Mokafor Global Education — Full Platform Technical Proposal

## Executive Summary

A modern, scalable education platform built on the client's preferred stack: **Node.js**, **GitHub**, **Cloudflare**, **Clerk**, **Vercel**, and **Supabase**. The platform will serve three primary user roles — **Students**, **Parents**, and **Tutors** — with an **Admin Dashboard** for operations. Payments will integrate via **Paystack** (mocked for development).

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │   Next.js   │  │   Next.js (Admin)   │  │
│  │  (Marketing)│  │  (Portal)   │  │   (Operations)      │  │
│  │   Vercel    │  │   Vercel    │  │      Vercel         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │               │
│         └────────────────┴────────────────────┘               │
│                          │                                   │
│                   Cloudflare CDN / DNS                       │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                     API LAYER (Node.js)                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Next.js API Routes (Serverless)            │ │
│  │  • Auth middleware (Clerk)                              │ │
│  │  • Business logic (tutors, bookings, payments)          │ │
│  │  • Webhook handlers (Paystack, Clerk)                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                   DATA & INFRASTRUCTURE                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Supabase   │  │   Clerk     │  │     Paystack        │  │
│  │  (Postgres) │  │   (Auth)    │  │   (Payments)        │  │
│  │  • Realtime │  │  • SSO      │  │  • Subscriptions    │  │
│  │  • Storage  │  │  • RBAC     │  │  • Webhooks         │  │
│  │  • Edge Fns │  │  • Sessions │  │  • Transfers        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack Justification

| Technology | Role | Why |
|------------|------|-----|
| **Next.js 14+ (App Router)** | Full-stack framework | SSR/SSG for marketing, API routes for backend, React Server Components for performance |
| **Vercel** | Hosting & CI/CD | Zero-config deployments, preview branches, edge network, native Next.js optimization |
| **Supabase** | Database & backend services | Postgres with real-time subscriptions, Row Level Security, file storage, edge functions |
| **Clerk** | Authentication & user management | Multi-role auth (parent/student/tutor/admin), session management, social SSO, webhooks |
| **Cloudflare** | DNS, CDN, DDoS protection | Global edge caching, custom domain management, security rules |
| **Paystack** | Payment processing | Nigerian & international payments, subscriptions, transfers to tutors |
| **GitHub** | Source control & project management | Repos, Actions for CI, Issues/Projects for sprint tracking |
| **shadcn/ui + Tailwind** | UI component system | Accessible, customizable components that match the Kimi design discipline |

---

## 3. Project Structure (Monorepo via GitHub)

```
mokafor-education/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Vercel deploy + lint + test
├── apps/
│   ├── marketing/                   # Public website (mokafor.com)
│   │   ├── app/                     # Next.js App Router
│   │   ├── components/
│   │   └── package.json
│   │
│   ├── portal/                      # Student/Parent/Tutor dashboard (app.mokafor.com)
│   │   ├── app/
│   │   │   ├── (auth)/              # Clerk auth routes
│   │   │   ├── (dashboard)/
│   │   │   │   ├── parent/
│   │   │   │   ├── student/
│   │   │   │   └── tutor/
│   │   │   └── api/
│   │   │       ├── webhooks/
│   │   │       │   ├── clerk/route.ts
│   │   │       │   └── paystack/route.ts
│   │   │       ├── tutors/route.ts
│   │   │       ├── bookings/route.ts
│   │   │       ├── payments/route.ts
│   │   │       └── lessons/route.ts
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── supabase/client.ts   # Browser client
│   │   │   ├── supabase/server.ts   # Server client (RLS)
│   │   │   ├── supabase/admin.ts    # Service role (bypass RLS)
│   │   │   ├── clerk.ts
│   │   │   └── paystack.ts          # Mock + live toggle
│   │   └── package.json
│   │
│   └── admin/                       # Operations dashboard (admin.mokafor.com)
│       ├── app/
│       └── package.json
│
├── packages/
│   ├── ui/                          # Shared shadcn/ui components
│   ├── database/                    # Supabase types + migrations
│   │   ├── supabase/
│   │   │   ├── migrations/
│   │   │   └── config.toml
│   │   └── types/
│   ├── config/                      # Shared ESLint, TS, Tailwind configs
│   └── utils/                       # Shared utilities (date, currency, validation)
│
├── turbo.json                       # Turborepo pipeline
└── package.json
```

---

## 4. Database Schema (Supabase Postgres)

### 4.1 Core Tables

```sql
-- Users (synced from Clerk via webhook)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  clerk_id text unique not null,
  role text not null check (role in ('parent', 'student', 'tutor', 'admin')),
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  avatar_url text,
  country text default 'NG',
  timezone text default 'Africa/Lagos',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tutor profiles (extends profiles)
create table public.tutor_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  qualifications jsonb,           -- [{degree, institution, year}]
  subjects text[],                -- ['Mathematics', 'Physics']
  levels text[],                  -- ['Primary', 'Senior secondary']
  curricula text[],               -- ['WAEC', 'IGCSE', 'SAT']
  hourly_rate integer,            -- Naira (kobo for precision if needed)
  availability jsonb,             -- {monday: [{start: '09:00', end: '12:00'}]}
  rating numeric(2,1) default 0,
  total_reviews integer default 0,
  verified boolean default false,
  status text default 'pending' check (status in ('pending', 'active', 'suspended')),
  paystack_recipient_code text    -- For tutor payouts
);

-- Students (linked to parent)
create table public.students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id),
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  grade_level text not null,
  school text,
  curriculum text,
  learning_goals text[],
  created_at timestamptz default now()
);

-- Bookings / Lessons
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  tutor_id uuid not null references public.tutor_profiles(id),
  subject text not null,
  lesson_type text not null check (lesson_type in ('one_on_one', 'group', 'improvement')),
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  scheduled_at timestamptz not null,
  duration_minutes integer default 60,
  meeting_link text,              -- Zoom/Google Meet
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lesson materials & assignments
create table public.lesson_materials (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id),
  title text not null,
  description text,
  file_url text,                  -- Supabase Storage
  file_type text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Assignments & submissions
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id),
  title text not null,
  description text,
  due_date timestamptz,
  max_score integer default 100,
  created_at timestamptz default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.assignments(id),
  student_id uuid references public.students(id),
  file_url text,
  notes text,
  score integer,
  feedback text,
  submitted_at timestamptz default now(),
  graded_at timestamptz
);

-- Progress reports
create table public.progress_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id),
  tutor_id uuid references public.tutor_profiles(id),
  period_start date not null,
  period_end date not null,
  attendance_rate numeric(5,2),
  overall_score integer,
  strengths text[],
  areas_for_improvement text[],
  tutor_notes text,
  created_at timestamptz default now()
);

-- Payments & Subscriptions
create table public.payment_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,             -- "Monthly tutoring - 8 sessions"
  description text,
  amount integer not null,        -- Naira
  billing_interval text not null check (billing_interval in ('weekly', 'monthly', 'term', 'one_time')),
  session_count integer,
  is_active boolean default true
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.profiles(id),
  student_id uuid references public.students(id),
  plan_id uuid references public.payment_plans(id),
  paystack_subscription_code text,
  paystack_email_token text,
  status text default 'active' check (status in ('active', 'cancelled', 'expired')),
  started_at timestamptz default now(),
  expires_at timestamptz,
  cancelled_at timestamptz
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.profiles(id),
  student_id uuid references public.students(id),
  amount integer not null,
  currency text default 'NGN',
  paystack_reference text unique,
  paystack_status text,
  type text not null check (type in ('subscription', 'one_time', 'refund')),
  description text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Tutor payouts
create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid references public.tutor_profiles(id),
  amount integer not null,
  paystack_transfer_reference text,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  period_start date not null,
  period_end date not null,
  created_at timestamptz default now()
);

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id),
  student_id uuid references public.students(id),
  tutor_id uuid references public.tutor_profiles(id),
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  type text not null,             -- 'booking_reminder', 'payment_success', 'new_message'
  title text not null,
  body text,
  read boolean default false,
  data jsonb,
  created_at timestamptz default now()
);
```

### 4.2 Row Level Security (RLS) Policies

```sql
-- Profiles: users can only read/update their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Students: parents can only see their own children
alter table public.students enable row level security;

create policy "Parents view own students"
  on public.students for select
  using (auth.uid() = parent_id);

-- Bookings: participants can view
alter table public.bookings enable row level security;

create policy "View bookings as participant"
  on public.bookings for select
  using (
    auth.uid() in (
      select parent_id from public.students where id = student_id
      union
      select id from public.tutor_profiles where id = tutor_id
    )
  );

-- Admin bypass (service role only)
create policy "Admin full access"
  on public.bookings for all
  using (false)  -- Only service role via admin client
  with check (false);
```

---

## 5. Authentication Flow (Clerk)

### 5.1 User Roles

Clerk supports multi-role applications via **Organization Memberships** or **Public Metadata**:

```typescript
// On user creation (via Clerk webhook)
// Set role in publicMetadata: { role: 'parent' | 'student' | 'tutor' | 'admin' }

// Middleware role guard
import { auth } from '@clerk/nextjs/server';

export async function requireRole(allowedRoles: string[]) {
  const { userId, sessionClaims } = auth();
  const role = sessionClaims?.metadata?.role;

  if (!userId || !allowedRoles.includes(role)) {
    throw new Error('Unauthorized');
  }
  return { userId, role };
}
```

### 5.2 Webhook Handlers

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createProfile, updateProfile, deleteProfile } from '@/lib/profiles';

export async function POST(req: Request) {
  const payload = await req.json();
  const type = payload.type;

  switch (type) {
    case 'user.created':
      await createProfile({
        clerk_id: payload.data.id,
        email: payload.data.email_addresses[0].email_address,
        first_name: payload.data.first_name,
        last_name: payload.data.last_name,
        role: payload.data.public_metadata.role || 'parent',
      });
      break;
    case 'user.updated':
      await updateProfile(payload.data.id, payload.data);
      break;
    case 'user.deleted':
      await deleteProfile(payload.data.id);
      break;
  }

  return new Response('OK', { status: 200 });
}
```

---

## 6. API Design (Next.js API Routes)

### 6.1 Tutor Search

```typescript
// app/api/tutors/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const level = searchParams.get('level');
  const minRate = searchParams.get('minRate');
  const maxRate = searchParams.get('maxRate');

  const supabase = createClient();

  let query = supabase
    .from('tutor_profiles')
    .select(`
      *,
      profiles (first_name, last_name, avatar_url)
    `)
    .eq('status', 'active')
    .eq('verified', true);

  if (subject) {
    query = query.contains('subjects', [subject]);
  }
  if (level) {
    query = query.contains('levels', [level]);
  }
  if (minRate) {
    query = query.gte('hourly_rate', parseInt(minRate));
  }
  if (maxRate) {
    query = query.lte('hourly_rate', parseInt(maxRate));
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tutors: data });
}
```

### 6.2 Booking Creation

```typescript
// app/api/bookings/route.ts
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const { student_id, tutor_id, subject, scheduled_at, duration_minutes } = body;

  // Verify student belongs to parent
  const supabase = createClient();
  const { data: student } = await supabase
    .from('students')
    .select('parent_id')
    .eq('id', student_id)
    .single();

  if (student?.parent_id !== userId) {
    return new Response('Unauthorized', { status: 403 });
  }

  // Check tutor availability (custom logic or edge function)

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      student_id,
      tutor_id,
      subject,
      scheduled_at,
      duration_minutes,
      status: 'scheduled'
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Create notification for tutor
  await supabase.from('notifications').insert({
    user_id: tutor_id,
    type: 'new_booking',
    title: 'New booking request',
    body: `You have a new ${subject} lesson scheduled`,
    data: { booking_id: data.id }
  });

  return NextResponse.json({ booking: data });
}
```

---

## 7. Payment Integration (Paystack)

### 7.1 Mock vs Live Toggle

```typescript
// lib/paystack.ts
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const IS_MOCK = process.env.PAYSTACK_MOCK === 'true';

interface InitializePayment {
  email: string;
  amount: number;        -- In kobo
  reference: string;
  plan?: string;         -- For subscriptions
  metadata: {
    user_id: string;
    student_id: string;
    plan_id: string;
  };
}

export async function initializePayment(data: InitializePayment) {
  if (IS_MOCK) {
    // Return mock success response
    return {
      status: true,
      data: {
        authorization_url: `/mock-payment?ref=${data.reference}`,
        reference: data.reference,
        access_code: `mock_${Date.now()}`,
      }
    };
  }

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function verifyPayment(reference: string) {
  if (IS_MOCK) {
    return {
      status: true,
      data: {
        status: 'success',
        reference,
        amount: 500000,     -- Mock NGN 5,000
        paid_at: new Date().toISOString(),
      }
    };
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });

  return res.json();
}

// Subscription management
export async function createSubscription(customerEmail: string, planCode: string) {
  if (IS_MOCK) {
    return {
      status: true,
      data: {
        subscription_code: `mock_sub_${Date.now()}`,
        email_token: `mock_token_${Date.now()}`,
      }
    };
  }

  const res = await fetch('https://api.paystack.co/subscription', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer: customerEmail,
      plan: planCode,
    }),
  });

  return res.json();
}

// Tutor payouts via Transfer
export async function initiateTransfer(recipientCode: string, amount: number, reason: string) {
  if (IS_MOCK) {
    return {
      status: true,
      data: {
        reference: `mock_transfer_${Date.now()}`,
        status: 'success',
      }
    };
  }

  const res = await fetch('https://api.paystack.co/transfer', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: 'balance',
      reason,
      amount: amount * 100,  -- Convert to kobo
      recipient: recipientCode,
    }),
  });

  return res.json();
}
```

### 7.2 Paystack Webhook Handler

```typescript
// app/api/webhooks/paystack/route.ts
import { createClient } from '@/lib/supabase/admin';
import { crypto } from 'crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  // Verify signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = createClient();

  switch (event.event) {
    case 'charge.success':
      await supabase.from('transactions').insert({
        parent_id: event.data.metadata.user_id,
        student_id: event.data.metadata.student_id,
        amount: event.data.amount / 100,
        paystack_reference: event.data.reference,
        paystack_status: 'success',
        type: event.data.plan ? 'subscription' : 'one_time',
        description: 'Payment successful',
      });
      break;

    case 'subscription.create':
      await supabase.from('subscriptions').insert({
        parent_id: event.data.customer.metadata.user_id,
        paystack_subscription_code: event.data.subscription_code,
        paystack_email_token: event.data.email_token,
        status: 'active',
      });
      break;

    case 'transfer.success':
      await supabase.from('payouts')
        .update({ status: 'completed' })
        .eq('paystack_transfer_reference', event.data.reference);
      break;
  }

  return new Response('OK', { status: 200 });
}
```

---

## 8. Frontend Architecture

### 8.1 Route Structure (Portal App)

```
app/
├── (auth)/
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   └── layout.tsx                    # Auth layout (no sidebar)
│
├── (dashboard)/
│   ├── layout.tsx                    # Dashboard shell (sidebar + header)
│   ├── page.tsx                      # Role-based redirect
│   │
│   ├── parent/
│   │   ├── page.tsx                  # Parent dashboard overview
│   │   ├── children/
│   │   │   └── page.tsx              # Manage children profiles
│   │   ├── bookings/
│   │   │   └── page.tsx              # View all bookings
│   │   ├── progress/
│   │   │   └── page.tsx              # Attendance, reports, assignments
│   │   ├── payments/
│   │   │   ├── page.tsx              # View plans & history
│   │   │   └── subscribe/
│   │   │       └── page.tsx          # Subscribe to plan
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── student/
│   │   ├── page.tsx                  # Student dashboard
│   │   ├── lessons/
│   │   │   └── page.tsx              # Upcoming & past lessons
│   │   ├── assignments/
│   │   │   └── page.tsx              # Submit & view graded work
│   │   ├── materials/
│   │   │   └── page.tsx              # Downloadable resources
│   │   └── progress/
│   │       └── page.tsx              # Personal progress tracker
│   │
│   ├── tutor/
│   │   ├── page.tsx                  # Tutor dashboard
│   │   ├── schedule/
│   │   │   └── page.tsx              # Calendar & availability
│   │   ├── students/
│   │   │   └── page.tsx              # Assigned students
│   │   ├── earnings/
│   │   │   └── page.tsx              # Payout history & balance
│   │   └── profile/
│   │       └── page.tsx              # Edit qualifications, subjects, rates
│   │
│   └── admin/                        # Protected admin routes
│       ├── page.tsx                  # Admin overview
│       ├── tutors/
│       │   └── page.tsx              # Tutor verification & management
│       ├── bookings/
│       │   └── page.tsx              # All bookings overview
│       ├── payments/
│       │   └── page.tsx              # Transactions & payouts
│       └── content/
│           └── page.tsx              # Courses, blog, resources
│
├── api/                              # API routes (see Section 6)
│
└── layout.tsx                        # Root layout (ClerkProvider + Theme)
```

### 8.2 Key Components

```typescript
// components/dashboard/shell.tsx
// Sidebar + header layout with role-based navigation

// components/dashboard/stats-cards.tsx
// Reusable stat cards for all dashboards

// components/bookings/calendar.tsx
// FullCalendar or custom calendar for tutor availability

// components/payments/paystack-button.tsx
// Paystack inline JS integration with mock fallback

// components/tutors/search-filters.tsx
// Subject, level, price, rating filters

// components/progress/attendance-chart.tsx
// Recharts/SVG charts
```

---

## 9. Implementation Phases

### Phase 1: Foundation (Weeks 1–2)
- [ ] Set up monorepo (Turborepo + GitHub)
- [ ] Configure Vercel deployments (3 apps)
- [ ] Set up Supabase project + run initial migrations
- [ ] Configure Clerk with roles + webhook sync
- [ ] Set up Cloudflare DNS + SSL
- [ ] Implement auth flows (sign-up, sign-in, role selection)

### Phase 2: Core Platform (Weeks 3–5)
- [ ] Parent portal: add children, view dashboard
- [ ] Tutor onboarding: application, profile creation
- [ ] Tutor search & filtering (public + authenticated)
- [ ] Booking system: schedule, cancel, reschedule
- [ ] Notification system (in-app + email via Supabase/Resend)
- [ ] Admin: tutor verification, user management

### Phase 3: Learning Management (Weeks 6–7)
- [ ] Lesson materials upload (Supabase Storage)
- [ ] Assignment creation & submission
- [ ] Progress reports generation
- [ ] Attendance tracking
- [ ] Real-time chat or messaging (Supabase Realtime)

### Phase 4: Payments (Weeks 8–9)
- [ ] Payment plans configuration (admin)
- [ ] Paystack integration (mock mode)
- [ ] Subscription management
- [ ] Receipt generation & download
- [ ] Tutor payout workflow
- [ ] Transaction history for parents

### Phase 5: Polish & Launch (Weeks 10–11)
- [ ] Marketing website finalization
- [ ] Blog & learning resources CMS
- [ ] SEO optimization
- [ ] Performance audit (Lighthouse 90+)
- [ ] Security audit (Clerk RLS, input validation)
- [ ] Switch Paystack to live mode
- [ ] Soft launch with beta users

---

## 10. Environment Variables

```bash
# .env (all apps)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_MOCK=true                    # Set false for production

# Optional
RESEND_API_KEY=re_...                 # For transactional emails
CLOUDFLARE_API_TOKEN=...              # For DNS automation
```

---

## 11. Security Checklist

- [ ] **RLS enabled** on all Supabase tables
- [ ] **Clerk webhook signature** verification
- [ ] **Paystack webhook signature** verification
- [ ] **Input validation** via Zod on all API routes
- [ ] **Rate limiting** on auth and payment endpoints (Cloudflare/Vercel)
- [ ] **CSP headers** configured in Next.js
- [ ] **No secrets exposed** to client (PAYSTACK_SECRET server-only)
- [ ] **Service role key** only used in server contexts (never client)
- [ ] **File uploads** validated (type, size, scan)
- [ ] **Admin routes** protected by middleware role checks
- [ ] **HTTPS only** (enforced by Cloudflare + Vercel)

---

## 12. Cost Estimation (Monthly)

| Service | Tier | Cost (USD) |
|---------|------|------------|
| Vercel (3 apps) | Pro | $20 |
| Supabase | Pro (8GB) | $25 |
| Clerk | Pro (10K MAU) | $25 |
| Cloudflare | Pro | $20 |
| Paystack | Transaction fees | ~1.5% per transaction |
| Resend (email) | Free tier | $0 |
| **Total fixed** | | **~$90/month** |

---

## 13. Why This Stack Wins

1. **Familiarity**: You already know Node.js, GitHub, Cloudflare, Clerk, Vercel, Supabase — zero learning curve friction
2. **Speed to market**: Next.js + Vercel + Supabase enables rapid full-stack development with minimal DevOps
3. **Scalability**: Serverless architecture scales automatically; Supabase handles 100K+ concurrent connections
4. **Cost efficiency**: Starts under $100/month; scales pay-as-you-go
5. **Security**: Clerk handles auth complexity; Supabase RLS enforces data boundaries; Cloudflare adds DDoS protection
6. **Nigeria-optimized**: Paystack is built for Nigerian payments (local cards, bank transfers, USSD); Cloudflare has Lagos edge nodes

---

*Prepared for Mokafor Global Education. Ready to begin Phase 1 upon approval.*
