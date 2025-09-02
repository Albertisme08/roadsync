-- Create a function to handle real-time notifications for new users
CREATE OR REPLACE FUNCTION notify_admin_of_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function will be called after a new profile is inserted
  -- We'll use it to potentially send notifications in the future
  RAISE LOG 'New user profile created: % (%) with status %', NEW.name, NEW.email, NEW.approval_status;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user notifications
DROP TRIGGER IF EXISTS on_new_user_profile ON public.profiles;
CREATE TRIGGER on_new_user_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_of_new_user();