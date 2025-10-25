import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iculvdxvemhzoyankqay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljdWx2ZHh2ZW1oem95YW5rcWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMzM1MTEsImV4cCI6MjA3MDgwOTUxMX0.Ug-YY1-uCkOC3kw1i-3WUy5nnYc0tkPvBNB274533qM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
