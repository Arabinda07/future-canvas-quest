

# Deterministic Report Generation Pipeline

## Key Insight from Your Files

The Excel workbook (Sheet 3) contains a complete **lookup table** of pre-written text snippets for every score level, RIASEC type, Big Five trait, flag, and action recommendation. This means the report is **100% deterministic** — no AI model is needed. The edge function scores the answers and assembles the report by selecting the correct text snippets based on computed scores.

## Architecture

```text
Payment verified (PaymentSuccess.tsx)
  → invoke "generate-report" edge function
    → Step 1: Fetch answers from DB
    → Step 2: Score deterministically (answer key + forward/reverse conversion)
    → Step 3: Compute stream composites, confidence, flags
    → Step 4: Select text snippets from embedded lookup table
    → Step 5: Assemble structured JSON report
    → Step 6: Save to DB, return to client
  → Report.tsx renders the full report matching the sample DOCX layout
```

## Changes

### 1. Database Migration
Add columns to cache the generated report and scores:
```sql
ALTER TABLE public.assessments
  ADD COLUMN generated_report jsonb,
  ADD COLUMN scores jsonb;
```

### 2. Edge Function: `generate-report/index.ts`
A single edge function with all logic inline:

**Scoring (deterministic):**
- Aptitude answer key (Q1-Q20) to compute N_raw, L_raw, V_raw and scaled values
- Personality/Interest (Q21-Q70): forward A=3,B=2,C=1,D=0; reverse for Q54,Q58,Q62,Q66,Q70
- RIASEC groups (R,I,A,S,E,C) and Big Five groups (O,Co,Ex,Ag,Ne)
- Stream composites: Science_Score, Commerce_Score, Humanities_Score
- Top_Stream, Confidence (High/Moderate/Low based on gap), Flags

**Text assembly (lookup table embedded in code):**
- All text snippets from Sheet 3 embedded as a JS object: RIASEC definitions + careers + activities, Big Five interpretations (High/Low), Aptitude interpretations (High/Moderate/Low), Flag text, Action recommendations (by class stage and stream), Best-fit narrative templates (by class stage and confidence)
- Level thresholds: score >= 70 = High, 40-69 = Moderate, < 40 = Low (Extraversion: >= 60 = High)
- Identify top 2 RIASEC interests, top aptitudes, dominant Big Five traits
- Fill narrative templates with student-specific data

**Output:** Returns structured JSON with all sections (A through F) matching the sample report format.

### 3. Update `PaymentSuccess.tsx`
After payment DB update succeeds:
- Add a "Generating your report..." state between verification and redirect
- Invoke `generate-report` with the `assessmentId`
- On success, navigate to `/report`
- On failure, still navigate to `/report` (it can retry generation there)

### 4. Rebuild `Report.tsx`
Two modes:

**Unpaid mode (current paywall):** Keep as-is with blurred sections and pay button.

**Paid mode:** Fetch the assessment record from DB. Render the full report in glass cards matching the sample DOCX layout:
- **Header:** "Future Canvas Career Report" with student name, class, section, date
- **Section A — Profile at a Glance:** Two-column table: Core Profile bullets + Stream Validation narrative
- **Section B — Aptitude Profile:** Table with bar visualizations (filled/empty blocks), scores, and interpretation text
- **Section C — Interests & Personality:** Two-column layout: RIASEC (top 2-3 types with definitions, activities, career pathways) | Big Five traits (score, level, interpretation)
- **Section D — Next Steps:** Three-row table (Subjects & Skills, Projects, Competitions)
- **Section E & F — Career Pathways & Guidance Notes:** Career clusters from top RIASEC types + flag/guidance text
- **Disclaimer** at bottom

If `generated_report` is null but payment is confirmed, auto-invoke the edge function and show a loading state.

### 5. Text Snippet Lookup Table
All snippets from your Excel Sheet 3 will be embedded directly in the edge function as a constant object, organized by category:
- `RIASEC`: R_Def, R_Careers, I_Def, I_Careers, ... (6 types x 3 keys each)
- `BigFive`: O_High, O_Low, Co_High, Co_Low, ... (5 traits x 2 levels)
- `Aptitude`: N_High, N_Moderate, N_Low, L_High, ... (3 aptitudes x 3 levels)
- `Flags`: HIGH_NEUROTICISM, LOW_CONSCIENTIOUSNESS, No_Flags
- `Actions`: 6 variants (Foundational/Specialization x Science/Commerce/Humanities)
- `Narratives`: 6 templates (Foundational/Specialization x High/Moderate/Low confidence)

## Technical Details
- No AI gateway needed — entire report is deterministic template-based
- Edge function uses Supabase service role key to read/write assessments
- Report JSON structure enables clean React rendering with proper typography
- Bar visualization uses CSS (progress bars) instead of ASCII blocks for web

