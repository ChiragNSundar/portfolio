-- Create a guestbook table to store messages typed on the retro terminal
CREATE TABLE IF NOT EXISTS public.guestbook (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    role TEXT
);

-- Enable Row Level Security (RLS) to secure the table
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to read guestbook messages (public read)
CREATE POLICY "Allow public read access" 
ON public.guestbook 
FOR SELECT 
USING (true);

-- Policy 2: Allow anyone to insert guestbook messages (public write)
CREATE POLICY "Allow public insert access" 
ON public.guestbook 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster sorting by date
CREATE INDEX IF NOT EXISTS guestbook_created_at_idx ON public.guestbook (created_at DESC);
