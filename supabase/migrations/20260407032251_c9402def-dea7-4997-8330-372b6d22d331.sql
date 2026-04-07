
-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  counselor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT,
  campaign_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add campaign_id to assessments
ALTER TABLE public.assessments ADD COLUMN campaign_id UUID REFERENCES public.campaigns(id);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Counselors can read their own campaigns
CREATE POLICY "Counselors can read own campaigns"
  ON public.campaigns FOR SELECT
  TO authenticated
  USING (counselor_id = auth.uid());

-- Counselors can insert their own campaigns
CREATE POLICY "Counselors can insert own campaigns"
  ON public.campaigns FOR INSERT
  TO authenticated
  WITH CHECK (counselor_id = auth.uid());

-- Counselors can update their own campaigns
CREATE POLICY "Counselors can update own campaigns"
  ON public.campaigns FOR UPDATE
  TO authenticated
  USING (counselor_id = auth.uid());

-- Public can read campaign by code (for registration validation)
CREATE POLICY "Public can read campaign by code"
  ON public.campaigns FOR SELECT
  TO anon
  USING (true);
