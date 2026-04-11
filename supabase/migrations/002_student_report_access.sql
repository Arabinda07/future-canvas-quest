alter table public.student_sessions
add column if not exists report_access_token_hash text;

create index if not exists idx_student_sessions_report_access_token_hash
on public.student_sessions (report_access_token_hash);
