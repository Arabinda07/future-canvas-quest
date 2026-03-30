# Future Canvas Quest

Future Canvas Quest is a Vite + React + TypeScript web app for a student career-orientation assessment flow.

## Current product scope

- Landing page with value proposition and school-facing sections.
- Student registration screen.
- 70-question assessment experience split across aptitude + psychometric sections.
- Intro/instruction gate before assessment starts.
- Completion success screen with demo report action.
- Local persistence of in-progress assessment state.

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm test
npm run build
npx tsc --noEmit
```

## Architecture notes

- Routing and page transitions are in `src/App.tsx`.
- Assessment state is centralized in `src/context/AssessmentContext.tsx`.
- Question data and pagination constants are in `src/data/questions.ts`.
- UI primitives are in `src/components/ui`.

## Known strategic gaps (next roadmap)

1. No backend persistence (results are not stored server-side).
2. No authenticated admin/counselor dashboard.
3. No real PDF/report generation pipeline yet.
4. No timer enforcement despite time guidance in UI copy.
5. Limited validation for optional registration fields.
6. No analytics/funnel instrumentation.
7. No error boundary for runtime failures.
8. No API contract/schema versioning for future integrations.
