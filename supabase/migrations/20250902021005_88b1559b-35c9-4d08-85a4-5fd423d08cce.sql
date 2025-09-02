-- Create trigger to insert into profiles when a new auth user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Ensure updated_at is maintained on profiles
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

-- Helpful index for fast lookups by auth user id
create index if not exists idx_profiles_user_id on public.profiles(user_id);
