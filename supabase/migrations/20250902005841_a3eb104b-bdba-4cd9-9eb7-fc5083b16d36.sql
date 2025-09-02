-- Add function to promote user to admin (only callable by existing admins)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can promote users to admin';
  END IF;
  
  -- Promote the target user to admin
  UPDATE public.profiles 
  SET 
    role = 'admin',
    approval_status = 'approved',
    approval_date = now()
  WHERE user_id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;