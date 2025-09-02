-- Promote fwdfwdit@gmail.com to admin status
UPDATE public.profiles 
SET 
  role = 'admin',
  approval_status = 'approved',
  verification_status = 'verified',
  approval_date = now()
WHERE email = 'fwdfwdit@gmail.com';