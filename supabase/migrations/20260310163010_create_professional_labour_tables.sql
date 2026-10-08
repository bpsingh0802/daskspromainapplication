/*
  # Create professional and labour profile tables

  1. New Tables
    - `professional_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `profession` (text, category of professional service)
      - `experience_years` (integer)
      - `bio` (text)
      - `hourly_rate` (decimal)
      - `created_at` (timestamp)
    - `labour_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `category` (text, category of labour)
      - `skills` (text array)
      - `daily_rate` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to view and manage their own profiles
*/

CREATE TABLE IF NOT EXISTS professional_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  profession text NOT NULL,
  experience_years integer DEFAULT 0,
  bio text,
  hourly_rate decimal(10, 2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS labour_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL,
  skills text[] DEFAULT '{}',
  daily_rate decimal(10, 2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE labour_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read professional profiles"
  ON professional_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read labour profiles"
  ON labour_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own professional profile"
  ON professional_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own labour profile"
  ON labour_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_professional_profiles_profession ON professional_profiles(profession);
CREATE INDEX idx_labour_profiles_category ON labour_profiles(category);
