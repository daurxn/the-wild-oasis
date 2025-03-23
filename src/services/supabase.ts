import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://wupsdnooaakwdzuyxtln.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cHNkbm9vYWFrd2R6dXl4dGxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTUxNzU4MiwiZXhwIjoyMDU3MDkzNTgyfQ.fN6_15vTIqEfcXTdZWBO_Hz0so0DAzpEOtnJC4sRtDs'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
