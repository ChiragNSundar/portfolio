-- Create guestbook table with database-level payload safety constraints
CREATE TABLE IF NOT EXISTS public.guestbook (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 1 AND char_length(name) <= 50),
    email TEXT CHECK (email IS NULL OR char_length(email) <= 100),
    message TEXT NOT NULL CHECK (char_length(trim(message)) >= 3 AND char_length(message) <= 300),
    role TEXT
);

-- Enable Row Level Security (RLS) to secure the table
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to read guestbook messages (public read)
CREATE POLICY "Allow public read access" 
ON public.guestbook 
FOR SELECT 
USING (true);

-- Policy 2: Secure public insert access with strict payload validation
CREATE POLICY "Allow public insert with payload constraints" 
ON public.guestbook 
FOR INSERT 
WITH CHECK (
    char_length(trim(name)) >= 1 AND char_length(name) <= 50 AND
    char_length(trim(message)) >= 3 AND char_length(message) <= 300 AND
    (email IS NULL OR char_length(email) <= 100)
);

-- Create index for faster sorting by date
CREATE INDEX IF NOT EXISTS guestbook_created_at_idx ON public.guestbook (created_at DESC);
