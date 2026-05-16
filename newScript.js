import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ksdumhchbydaoslkospx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZHVtaGNoYnlkYW9zbGtvc3B4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzgwNDUyMiwiZXhwIjoyMDkzMzgwNTIyfQ.C69zfcdGOyjksy93Y8ZMiqC4m4HmVNVUyS6pn2VHveI",
);

async function copyUidToId() {
  // Get all rows
  const { data, error } = await supabase.from("your_table_name").select("uid");

  if (error) {
    console.error(error);
    return;
  }

  for (const row of data) {
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        id: row.uid, // copy uid into id
      })
      .eq("uid", row.uid);

    if (updateError) {
      console.log(`Error for ${row.uid}:`, updateError.message);
    } else {
      console.log(`Updated ${row.uid}`);
    }
  }

  console.log("Finished");
}

copyUidToId();
