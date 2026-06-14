const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from("projects").select("id, title, status").limit(5);
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Projects status:", data);
  console.log("Types of status:", data.map(d => typeof d.status));
}

check();
