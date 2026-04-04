
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_email TEXT,
  student_class TEXT,
  counselor_code TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  razorpay_payment_link_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read by id" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Allow update by id" ON public.assessments FOR UPDATE USING (true);
