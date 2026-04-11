alter table public.calculated_scores
  alter column report_unlocked set default false;

update public.calculated_scores scores
set report_unlocked = sessions.entry_path = 'school-issued'
from public.student_sessions sessions
where scores.session_id = sessions.id;

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

drop trigger if exists trg_report_payments_updated_at on public.report_payments;
create trigger trg_report_payments_updated_at
before update on public.report_payments
for each row execute function public.touch_updated_at();
