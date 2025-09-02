-- Fix the security warning by setting search_path
CREATE OR REPLACE FUNCTION notify_admin_of_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function will be called after a new profile is inserted
  RAISE LOG 'New user profile created: % (%) with status %', NEW.name, NEW.email, NEW.approval_status;
  RETURN NEW;
END;
$$;