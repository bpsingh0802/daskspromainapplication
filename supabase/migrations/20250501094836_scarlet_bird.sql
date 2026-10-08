/*
  # Add phone number to users table
  
  1. Changes
    - Add phone column to users table with unique constraint
    - Add phone number format validation
  
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE users 
ADD COLUMN phone text UNIQUE,
ADD CONSTRAINT users_phone_check 
  CHECK (phone ~* '^\+[1-9]\d{1,14}$');

-- Update the handle_new_user function to include phone
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', null),
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;