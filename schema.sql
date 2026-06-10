-- Create the subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  topics TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow any client to subscribe (INSERT only)
CREATE POLICY "Allow public insert of subscriptions" 
ON subscribers 
FOR INSERT 
WITH CHECK (true);

-- Note: The send-newsletter cron job will run using the SUPABASE_SERVICE_ROLE_KEY, 
-- which bypasses RLS policies and can read/write all rows.
