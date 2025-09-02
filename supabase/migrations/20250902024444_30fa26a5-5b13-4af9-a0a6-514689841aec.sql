-- Ensure trigger to create profile on new auth user
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Ensure trigger to keep updated_at fresh on profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profiles_updated_at'
  ) THEN
    CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Backfill profiles for existing auth users missing a profile
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
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'full_name'),
  COALESCE(u.raw_user_meta_data->>'role', 'user'),
  CASE WHEN u.email_confirmed_at IS NOT NULL THEN 'verified' ELSE 'unverified' END,
  u.raw_user_meta_data->>'business_name',
  u.raw_user_meta_data->>'dot_number',
  u.raw_user_meta_data->>'mc_number',
  u.raw_user_meta_data->>'phone',
  u.raw_user_meta_data->>'description',
  u.raw_user_meta_data->>'city',
  u.raw_user_meta_data->>'address',
  u.raw_user_meta_data->>'equipment_type',
  u.raw_user_meta_data->>'max_weight',
  CASE WHEN COALESCE(u.raw_user_meta_data->>'role','user') = 'admin' THEN 'approved' ELSE 'pending' END
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;

-- Promote the known admin email to admin and approve
UPDATE public.profiles
SET role = 'admin', approval_status = 'approved', approval_date = COALESCE(approval_date, now())
WHERE email = 'fwdfwdit@gmail.com';