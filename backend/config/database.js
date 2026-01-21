const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

// Use service role key for backend to bypass RLS policies
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
);

console.log("Supabase client initialized with:", {
  url: process.env.SUPABASE_URL,
  usingServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
});

module.exports = supabase;
