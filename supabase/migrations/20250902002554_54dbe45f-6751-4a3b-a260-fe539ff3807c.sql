-- Fix infinite recursion in profiles RLS policies
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by admins and own user" ON profiles;

-- Create a security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE user_id = _user_id 
    AND role = 'admin'
  );
$$;

-- Create new policies using the security definer function
CREATE POLICY "Profiles are viewable by admins and own user"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));