-- Update the handle_new_user function to handle additional registration data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    name, 
    role, 
    verification_status,
    business_name,
    dot_number,
    mc_number,
    phone,
    description,
    city,
    address,
    equipment_type,
    max_weight,
    approval_status
  )
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    CASE 
      WHEN NEW.email IN ('alopezcargo@outlook.com', 'fwdfwdit@gmail.com') THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    END,
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN 'verified' ELSE 'unverified' END,
    NEW.raw_user_meta_data->>'business_name',
    NEW.raw_user_meta_data->>'dot_number',
    NEW.raw_user_meta_data->>'mc_number',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'description',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'address',
    NEW.raw_user_meta_data->>'equipment_type',
    NEW.raw_user_meta_data->>'max_weight',
    CASE 
      WHEN NEW.email IN ('alopezcargo@outlook.com', 'fwdfwdit@gmail.com') THEN 'approved'
      ELSE 'pending'
    END
  );
  RETURN NEW;
END;
$$;

-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS equipment_type text,
ADD COLUMN IF NOT EXISTS max_weight text;