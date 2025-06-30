/*
  # Fix RLS policies for smart_wins and xp tables

  1. Security Updates
    - Fix RLS policies for `smart_wins` table to allow authenticated users to manage their own records
    - Fix RLS policies for `xp` table to allow authenticated users to manage their own records
    - Ensure proper INSERT, SELECT, UPDATE, and DELETE permissions

  2. Changes Made
    - Drop existing problematic policies if they exist
    - Create comprehensive RLS policies for both tables
    - Use proper auth.uid() function for user identification
*/

-- Fix smart_wins table RLS policies
DROP POLICY IF EXISTS "Users can insert own smart wins" ON smart_wins;
DROP POLICY IF EXISTS "Users can read own smart wins" ON smart_wins;
DROP POLICY IF EXISTS "Users can update own smart wins" ON smart_wins;
DROP POLICY IF EXISTS "Users can delete own smart wins" ON smart_wins;

-- Create comprehensive RLS policies for smart_wins
CREATE POLICY "Users can insert own smart wins"
  ON smart_wins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own smart wins"
  ON smart_wins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own smart wins"
  ON smart_wins
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own smart wins"
  ON smart_wins
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix xp table RLS policies
DROP POLICY IF EXISTS "Users can insert own xp" ON xp;
DROP POLICY IF EXISTS "Users can read own xp" ON xp;
DROP POLICY IF EXISTS "Users can update own xp" ON xp;
DROP POLICY IF EXISTS "Users can delete own xp" ON xp;

-- Create comprehensive RLS policies for xp
CREATE POLICY "Users can insert own xp"
  ON xp
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own xp"
  ON xp
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own xp"
  ON xp
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own xp"
  ON xp
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Also fix user_xp table policies (enhanced XP system)
DROP POLICY IF EXISTS "Users can insert own user_xp" ON user_xp;
DROP POLICY IF EXISTS "Users can read own user_xp" ON user_xp;
DROP POLICY IF EXISTS "Users can update own user_xp" ON user_xp;
DROP POLICY IF EXISTS "Users can delete own user_xp" ON user_xp;

-- Enable RLS on user_xp if not already enabled
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for user_xp
CREATE POLICY "Users can insert own user_xp"
  ON user_xp
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own user_xp"
  ON user_xp
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own user_xp"
  ON user_xp
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own user_xp"
  ON user_xp
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);