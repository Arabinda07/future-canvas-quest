# Future Canvas Quest

Future Canvas Quest is a Vite + React + TypeScript web app for a student career-orientation assessment flow.

## Current Product Scope

- Landing page with value proposition and school-facing sections.
- Student registration screen (supports self-serve or school/counselor codes).
- 70-question assessment experience split across aptitude + psychometric sections.
- Intro/instruction gate before assessment starts.
- **Server-backed assessments**: Raw answers are securely stored, encrypted, and scored via Supabase.
- **Student Reports**: 
  - Self-serve students receive tokenized secure links, with full reports behind a Rs 99 Razorpay paywall.
  - School-issued students automatically bypass the student paywall and appear in the matching counselor dashboard.
- **Counselor Portal**: Registration for public interest, admin approval flow, and secure invite-link based dashboard access for batch-scoped results.
- **Launch Readiness**: Configured to block assessment submissions if the required backend environments (Supabase) are missing.

## Local Development

```bash
npm install
npm run dev
```

Required frontend environment variables for full operation:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Quality Checks

```bash
npm run lint
npm test
npm run build
npx tsc --noEmit
```

## Architecture Notes

- Routing and page transitions are in `src/App.tsx`.
- Assessment state is centralized in `src/context/AssessmentContext.tsx`.
- Question data and pagination constants are in `src/data/questions.ts`.
- UI primitives are in `src/components/ui`.
- **Backend**: Relies on Supabase Edge Functions for core logic (`process-assessment`, `get-student-report`, `create-payment-link`, `verify-report-payment`, `validate-counselor-access`, `get-counselor-dashboard`, etc.) and database migrations for data models.

## Future Roadmap & Hardening

1. Move from invite-link counselor access to named counselor/admin accounts.
2. Add audit logs for approvals, portal access, report unlocks, and payments.
3. Strengthen Supabase RLS policies around report ownership and batch access.
4. Add analytics and funnel instrumentation (landing-to-registration, assessment completion, payment conversion).
5. Limited validation for optional registration fields.
