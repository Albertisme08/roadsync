-- Update the handle_new_user function to properly extract metadata and set role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'), -- Extract role from metadata
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
      WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'approved' 
      ELSE 'pending' 
    END -- Auto-approve admins, others stay pending
  );
  RETURN NEW;
END;
$function$;