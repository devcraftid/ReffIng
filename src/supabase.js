import { createClient } from '@supabase/supabase-js';

// TODO: GANTI DENGAN URL DAN ANON KEY SUPABASE ANDA
const supabaseUrl = 'https://flgyjcpcgbobbqyopnth.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ3lqY3BjZ2JvYmJxeW9wbnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4ODE0MTQsImV4cCI6MjA5OTQ1NzQxNH0.baWJpO5v3ZQmDhIMu6DCjOr_WJyOSTzgaA2LK-9-jC4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
