-- Update the admin user password directly
UPDATE auth.users 
SET encrypted_password = crypt('Teampassword123!', gen_salt('bf'))
WHERE email = 'fwdfwdit@gmail.com';