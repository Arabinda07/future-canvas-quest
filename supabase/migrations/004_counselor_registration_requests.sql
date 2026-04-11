create table if not exists public.counselor_registration_requests (
  id uuid primary key default gen_random_uuid(),
  counselor_name text not null,
  email text not null,
  phone text not null,
  school_name text not null,
  school_city text not null,
  expected_student_count integer not null check (expected_student_count > 0),
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  batch_code text references public.school_batches(code) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_counselor_registration_requests_status on public.counselor_registration_requests (status);
create index if not exists idx_counselor_registration_requests_created_at on public.counselor_registration_requests (created_at);

drop trigger if exists trg_counselor_registration_requests_updated_at on public.counselor_registration_requests;
create trigger trg_counselor_registration_requests_updated_at
before update on public.counselor_registration_requests
for each row execute function public.touch_updated_at();
