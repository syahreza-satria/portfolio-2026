const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from("projects").select("id, title, status").ilike("title", "%nomads%");
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Nomads project details:", data);
}

check();
