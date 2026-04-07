

# Current Status, Improvements, and Next Steps

## What I Understand

**Future Canvas** is a psychometric career assessment platform for Indian students (Classes 9-12), aligned with NEP 2020 and PM SHRI Schools. The platform lets students take a 70-question assessment (aptitude + psychometric), pays ₹99 to unlock a deterministic Career Clarity Report, and provides counselors an admin dashboard to monitor submissions.

Your two planning documents describe a full v1 vision covering: dual entry paths (school-issued vs self-serve), campaign management for counselors, grade-aware question branching, and robust session handling.

## What's Built (Complete)

- Landing page with NEP/PM SHRI positioning
- Student registration and 70-question assessment flow
- Deterministic scoring engine (RIASEC, Big Five, stream composites)
- Report generation from Excel lookup table (Sections A-F)
- Razorpay ₹99 paywall + payment callback
- Admin dashboard with stats, search, expandable rows
- Counselor auth with role-based access (`user_roles` table)
- Admin account created (`admin@futurecanvas.in`)
- PDF download via print
- Mobile-responsive throughout

## What's Left (Priority Order)

| # | Feature | Impact | Effort |
|---|---------|--------|--------|
| 1 | **Counselor Login in navbar** | Quick UX fix — currently hidden | ~10 min |
| 2 | **Campaign Management** | Centerpiece of school adoption — counselors create campaigns, get shareable links, track cohort progress | Medium |
| 3 | **Dual Entry Paths** | Students arriving via campaign link auto-associate with school/cohort; self-serve stays as-is | Medium |
| 4 | **Grade-Aware Branching** | Classes 9-10 vs 11-12 see different question subsets | Low-Medium |
| 5 | **Counselor Report Viewer** | Admin dashboard "View Report" button renders the same report UI (not raw JSON) | Low |
| 6 | **Server-Side Session Resume** | Save in-progress answers to DB periodically for cross-device resume | Medium |

## How I Can Help

I can build all of the above incrementally. Here's what I recommend we tackle now:

## Plan: Add Counselor Login to Navbar + Start Campaign Management

### Step 1 — Add "Counselor Login" link to the landing navbar

**File:** `src/components/landing/LandingNavbar.tsx`

- Add a subtle "Counselor Login" text link in the desktop nav (after the section links, before the CTA button), styled as `text-white/40` to keep it low-profile
- Add it to the mobile menu as well, at the bottom before "Take the test"
- Links to `/counselor-login`

### Step 2 — Campaign Management (database)

Create a `campaigns` table:
- `id` (uuid, PK)
- `counselor_id` (uuid, FK to auth.users)
- `school_name` (text)
- `class` (text)
- `section` (text, nullable)
- `campaign_code` (text, unique, auto-generated 6-char code)
- `created_at` (timestamptz)
- `status` (text, default 'active')

Add `campaign_id` (uuid, nullable FK) to `assessments` table.

RLS: counselors can read/manage their own campaigns; public can read campaign by code (for student registration validation).

### Step 3 — Campaign UI in Admin Dashboard

Expand `/admin` with a "Campaigns" tab:
- Create campaign form (school name, class, section)
- Auto-generated shareable link: `futurecanvas.app/register?campaign=XXXXXX`
- Per-campaign stats: invited vs started vs completed vs paid
- Copy-link button for distribution

### Step 4 — Student Registration with Campaign Code

Update `/register` to:
- Detect `?campaign=XXXXXX` URL param
- Auto-fill school/class from campaign data
- Associate the assessment with `campaign_id` on submission
- Self-serve path (no campaign param) continues working as-is

### Technical Notes

- Campaign codes are 6-character uppercase alphanumeric, generated server-side
- The existing `counselor_code` field on assessments can coexist with `campaign_id` for backward compatibility
- RLS policies ensure counselors only see their own campaigns and associated assessments

