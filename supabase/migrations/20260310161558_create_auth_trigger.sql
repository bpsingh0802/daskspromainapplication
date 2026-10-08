/*
  # Create trigger for new user profile creation

  1. Creates a trigger that automatically creates a user profile in the public.users table
     when a new user is created in auth.users
  2. Captures user metadata (full_name, phone, user_type) and stores in public.users table
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_metadata->>'full_name',
    NEW.raw_user_metadata->>'phone',
    COALESCE(NEW.raw_user_metadata->>'user_type', 'customer')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    user_type = EXCLUDED.user_type;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
