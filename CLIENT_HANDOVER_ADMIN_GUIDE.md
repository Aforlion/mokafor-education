# 📘 Mokafor Global Executive Portal & System Operations Guide
> **Client Handover & Administration Master Document**  
> **Prepared for**: Mark Okafor (Mokafor Global Education)  
> **System Version**: 2.0 Production Release  

---

## Executive Summary

Welcome to the **Mokafor Global Executive Management System**. This comprehensive web platform powers your entire educational ecosystem—combining live academic bootcamps, 1-on-1 vetted tutoring, academic placement consultations, Paystack online payments, recorded video course sales, and marketing campaign click tracking in one unified suite.

This document serves as your complete operational manual and handover reference guide.

---

## Table of Contents
1. [Accessing the Portal & Security](#1-accessing-the-portal--security)
2. [Executive Overview & Real-Time KPIs](#2-executive-overview--real-time-kpis)
3. [Managing Educational Programmes (Bootcamps & Exam Prep)](#3-managing-educational-programmes)
4. [Vetted Tutor Network & Educator Verification](#4-vetted-tutor-network--educator-verification)
5. [Academic Placement Consultations & Requests](#5-academic-placement-consultations--requests)
6. [Paystack Revenue Ledger & Financial Audits](#6-paystack-revenue-ledger--financial-audits)
7. [User Directory & Customer Management](#7-user-directory--customer-management)
8. [Recorded Video Courses E-Commerce Manager](#8-recorded-video-courses-e-commerce-manager)
9. [Marketing Shortlinks & Ad Campaign Click Analytics](#9-marketing-shortlinks--ad-campaign-click-analytics)
10. [System Maintenance & Database Synchronization](#10-system-maintenance--database-synchronization)

---

## 1. Accessing the Portal & Security

### Portal URLs:
* **Main Executive Portal**: `https://www.mokafor.com/admin`
* **Video Courses & Shortlinks Manager**: `https://www.mokafor.com/admin/courses`

### Admin Protection & Sign In:
Both administrative portals are locked behind an **Executive Security Wall**.

1. Navigate to `/admin` or `/admin/courses`.
2. When prompted, enter your **Superadmin Email** and **Password**.
3. Upon successful login, your session is securely saved on your browser (`mokafor_admin_session`).
4. To terminate your admin session at any time, click **Sign Out** in the top header banner.

---

## 2. Executive Overview & Real-Time KPIs

The **Overview & KPIs** tab (`/admin`) gives you a high-level command center of your institution's growth metrics:

* **Total Platform Revenue**: Live aggregate of all paid transactions processed securely through Paystack.
* **Active Learners**: Count of enrolled students across live tracks and private tutoring sessions.
* **Vetted Tutor Staff**: Number of certified tutors who have passed 100% background and degree verifications.
* **Placement Bookings**: Pending and completed academic consultation requests submitted by prospective parents.
* **Recent Activity Ledger**: Real-time snapshot of the latest 5 transactions with customer names and Paystack reference IDs.

---

## 3. Managing Educational Programmes

### Adding a New Live Programme:
1. Click **+ New Programme** in the top banner or navigate to the **Programmes** tab.
2. Fill out the program details:
   * **Title**: e.g., *WAEC & WASSCE Mathematics Intensive Bootcamp*
   * **Category**: *Exam Prep*, *STEM & Robotics*, *Linguistic Mastery*, etc.
   * **Badge**: e.g., *Top Rated*, *Intensive Track*
   * **Schedule & Fee**: e.g., *Saturdays 10:00 AM*, *₦100,000 per month*
   * **Syllabus Highlights**: Comma-separated list of topics (e.g., *Quadratic Equations, Past Questions, Timed Drills*).
3. Click **Publish Programme**. It immediately displays on your public website storefront.

### Editing or Deleting Programmes:
* Click the **Pencil icon** on any programme card to edit fees, schedules, or descriptions.
* Click the **Trash icon** to unpublish and delete a programme.

---

## 4. Vetted Tutor Network & Educator Verification

Manage your roster of elite tutors available for private 1-on-1 academic placements:

* **Creating a Tutor Profile**: Click **+ Add Vetted Tutor**, input their name, email, hourly rate, subjects (e.g., *Physics, Further Mathematics*), and curricula (e.g., *WAEC, IGCSE, SAT*).
* **Degree & Background Verification**: Click **Toggle Verification** to badge a tutor with a green **"100% Verified"** seal on the public website.
* **Account Status**: Toggle between **Active** and **Suspended** to temporarily pause a tutor's availability for booking.

---

## 5. Academic Placement Consultations & Requests

When parents complete the consultation booking form on your website:

1. Go to the **Consultations** tab.
2. View the parent's contact info, student's grade level, requested curriculum, and assigned tutor.
3. Update consultation status:
   * **Pending Review**: New request awaiting your callback.
   * **Scheduled**: Call or meeting confirmed.
   * **Completed**: Placement finalized and student assigned.
   * **Cancelled**: Inquiry closed.

---

## 6. Paystack Revenue Ledger & Financial Audits

The **Revenue Ledger** provides an unalterable audit log of every monetary transaction on your platform:

* **Paystack Verification**: Every payment automatically verifies with Paystack's API before unlocking student access.
* **Reference Lookup**: Search transactions by Paystack reference string (e.g., `T149204812941`).
* **Customer Info**: View parent name, email, raw amount in Naira, transaction type, and timestamp.

---

## 7. User Directory & Customer Management

The **User Directory** tab lists all registered platform users (Parents, Students, Tutors, Admin staff):

* Filter by role (**Parent**, **Student**, **Tutor**, **Admin**).
* Search by name or email address.
* View student ward counts, tutor verification status, and cumulative spending history.

---

## 8. Recorded Video Courses E-Commerce Manager

Navigate to **`/admin/courses`** or click **🎬 Video Courses & Shortlinks** in your main admin tab navigation.

### Step A: Creating a Course Series
1. Under **Course Catalog**, enter the title (e.g., *WAEC Mathematics Complete Masterclass*).
2. Select subject (*Mathematics*, *Sciences*, *Exam Mastery*) and grade level (*WAEC*, *IGCSE*, *JAMB*).
3. Set a **Regular Price** (e.g., `25000`) and a **Discount Price** (e.g., `17500`).
   * *Note: The storefront automatically calculates and displays a **"SAVE 30%"** strikethrough badge!*
4. Click **Publish Course to Storefront**.

### Step B: Adding Video Modules & Lessons
1. Go to **Modules & Video Lessons**.
2. Select your course, then type the module title (e.g., *Module 1: Quadratic Equations*).
3. Add lesson videos:
   * Paste the video stream URL.
   * Enter duration in minutes.
4. **Setting up Free Teaser Snippets**:
   * Check **"Allow Free Teaser Preview"**.
   * Paste a short 30–90 second sample video link (or leave default).
   * *Why use snippets?* Visitors on your website can click **"Watch Free Snippet"** to sample your teaching style before purchasing. This significantly increases sales conversion!

---

## 9. Marketing Shortlinks & Ad Campaign Click Analytics

Located under **`/admin/courses`** $\rightarrow$ **Marketing Shortlinks**.

### What is a Shortlink?
Shortlinks are short, memorable web links (like `mokafor.com/s/waec2026`) created for your advertisements on WhatsApp, Facebook, Instagram, or printed flyers.

### Field Definitions:
1. **Custom Short Code / Alias**: The short code ending (e.g., `waec2026` creates `mokafor.com/s/waec2026`).
2. **Destination Target URL**: The actual page on your website where visitors arrive when they click the shortlink.
   * *Default*: `/courses` (sends them to the full course catalog).
   * *Direct Course*: `/courses/waec-mathematics-complete-series` (sends them directly to that specific course page ready to enroll).
3. **Campaign Tag / Platform**: Select where you plan to post the link (*WhatsApp Broadcast*, *Facebook Ad*, *Instagram Bio*, *Email Newsletter*, *Flyer QR Code*).

### Tracking Campaign Success:
* Each shortlink automatically counts how many times visitors clicked it.
* Check your dashboard to see which channel (e.g., WhatsApp vs Facebook) is generating the most interest!

---

## 10. System Maintenance & Database Synchronization

* **Sync Database**: Located in the main Executive Portal header. Click this button to pull the latest real-time transactions and bookings from the PostgreSQL database.
* **Public Storefront Link**: Click **View Public Storefront** in the admin header at any time to open a new tab showing what parents and students see.

---

### Summary Checklist for Daily Management:
- [ ] Log in at `mokafor.com/admin` to review new placement consultations.
- [ ] Check Paystack Revenue Ledger for new payments.
- [ ] Publish new video lessons and shortlinks for active social media ads.
- [ ] Verify newly registered tutors.

*For technical support or infrastructure inquiries, contact JBK Technologies Support.*
