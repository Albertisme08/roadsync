-- Add missing description column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN description text;