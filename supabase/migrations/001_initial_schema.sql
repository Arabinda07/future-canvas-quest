create extension if not exists "pgcrypto";

create table if not exists public.school_batches (
  code text primary key,
  school_name text not null,
  admin_token text not null unique,
  seats_purchased integer not null default 0,
  seats_used integer not null default 0,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (seats_used <= seats_purchased)
);

create table if not exists public.student_sessions (
  id uuid primary key default gen_random_uuid(),
  session_token text not null unique,
  report_access_token_hash text,
  name text not null,
  class text not null check (class in ('IX', 'X', 'XI', 'XII')),
  section text,
  roll_number text,
  school_name text,
  entry_path text not null check (entry_path in ('self-serve', 'school-issued')),
  batch_code text references public.school_batches(code) on delete set null,
  status text not null default 'completed' check (status in ('in_progress', 'completed')),
  consent_at timestamptz not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  delete_after timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_sessions_batch_code on public.student_sessions (batch_code);
create index if not exists idx_student_sessions_entry_path on public.student_sessions (entry_path);
create index if not exists idx_student_sessions_report_access_token_hash on public.student_sessions (report_access_token_hash);

create table if not exists public.student_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.student_sessions(id) on delete cascade,
  answers_enc text not null,
  submitted_at timestamptz not null default now()
);

create table if not exists public.calculated_scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.student_sessions(id) on delete cascade,
  report_id text not null unique,
  top_stream text,
  confidence text,
  flags text,
  report_json jsonb not null,
  report_unlocked boolean not null default false,
  scored_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_calculated_scores_report_id on public.calculated_scores (report_id);
create index if not exists idx_calculated_scores_session_id on public.calculated_scores (session_id);

create table if not exists public.report_payments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.student_sessions(id) on delete cascade,
  report_id text not null references public.calculated_scores(report_id) on delete cascade,
  razorpay_payment_link_id text not null unique,
  razorpay_payment_id text,
  amount_paise integer not null default 9900,
  currency text not null default 'INR',
  status text not null default 'created',
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists idx_report_payments_report_id on public.report_payments (report_id);
create index if not exists idx_report_payments_session_id on public.report_payments (session_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_school_batches_updated_at on public.school_batches;
create trigger trg_school_batches_updated_at
before update on public.school_batches
for each row execute function public.touch_updated_at();

drop trigger if exists trg_student_sessions_updated_at on public.student_sessions;
create trigger trg_student_sessions_updated_at
before update on public.student_sessions
for each row execute function public.touch_updated_at();

drop trigger if exists trg_calculated_scores_updated_at on public.calculated_scores;
create trigger trg_calculated_scores_updated_at
before update on public.calculated_scores
for each row execute function public.touch_updated_at();

drop trigger if exists trg_report_payments_updated_at on public.report_payments;
create trigger trg_report_payments_updated_at
before update on public.report_payments
for each row execute function public.touch_updated_at();
