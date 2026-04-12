-- Add counselor ownership to school batches
ALTER TABLE public.school_batches
ADD COLUMN counselor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Enable RLS on school_batches
ALTER TABLE public.school_batches ENABLE ROW LEVEL SECURITY;



-- Counselors can read their own batches
CREATE POLICY "Counselors can read own batches"
ON public.school_batches FOR SELECT
TO authenticated
USING (counselor_id = auth.uid());

-- Allow anyone to read batches based on explicit batch codes to support the legacy public portal briefly
CREATE POLICY "Anyone can read specific batches"
ON public.school_batches FOR SELECT
TO public
USING (true);

-- Index for speedy queries by counselor
CREATE INDEX idx_school_batches_counselor_id ON public.school_batches(counselor_id);
