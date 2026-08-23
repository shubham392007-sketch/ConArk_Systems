import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fgdlibcsnjsbuwddcklb.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZGxpYmNzbmpzYnV3ZGRja2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0ODk1NzYsImV4cCI6MjEwMzA2NTU3Nn0.q4JCUH5tvd70NESc-8UeJuUL4tKLqV94zPn7sxaGw1o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});
