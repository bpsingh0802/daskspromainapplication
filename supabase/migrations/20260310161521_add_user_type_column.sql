/*
  # Add user_type column to users table

  1. Changes
    - Add `user_type` column to `users` table to store the user's role/type
    - Options: customer, professional, labour, service_provider, recruiter
    - Default value: 'customer'
*/

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'customer' CHECK (user_type IN ('customer', 'professional', 'labour', 'service_provider', 'recruiter'));
