import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ifbyzgelotoneozqhomy.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYnl6Z2Vsb3RvbmVvenFob215Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc5MzU5OCwiZXhwIjoyMDkxMzY5NTk4fQ.VPsoIno1lQgXlmEQzjblYAnAcUMfFCwJDspPVC6T5w0";

// ── Change these if needed ──────────────────────────────────────────
const ADMIN_EMAIL    = "thesandeepmaity@gmail.com";
const ADMIN_PASSWORD = "Amioraadmin@123"; // min 6 chars
// ────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createAdmin() {
  console.log(`\nCreating admin user: ${ADMIN_EMAIL} ...`);

  // Check if user already exists
  const { data: existing } = await supabase.auth.admin.listUsers();
  const alreadyExists = existing?.users?.find((u) => u.email === ADMIN_EMAIL);

  if (alreadyExists) {
    console.log("User already exists — updating role to admin...");
    const { data, error } = await supabase.auth.admin.updateUserById(
      alreadyExists.id,
      { user_metadata: { role: "admin" } }
    );
    if (error) {
      console.error("❌ Update failed:", error.message);
    } else {
      console.log("✅ Admin role set successfully!");
      console.log("   Email   :", data.user.email);
      console.log("   Role    :", data.user.user_metadata?.role);
      console.log("   User ID :", data.user.id);
    }
    return;
  }

  // Create new user with admin role
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { role: "admin" },
  });

  if (error) {
    console.error("❌ Failed to create admin:", error.message);
    process.exit(1);
  }

  console.log("\n✅ Admin user created successfully!");
  console.log("   Email   :", data.user.email);
  console.log("   Role    :", data.user.user_metadata?.role);
  console.log("   User ID :", data.user.id);
  console.log("\n👉 Login at: http://localhost:3001/login");
  console.log(`   Password: ${ADMIN_PASSWORD}`);
}

createAdmin();
