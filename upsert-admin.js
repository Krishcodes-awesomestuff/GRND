require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixUser() {
  const email = 'admin.grnd@gmail.com'
  
  // Get the auth user to grab their correct UUID
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
  if (authError || !authData?.users) {
    console.error("Could not fetch auth users")
    return
  }
  
  const user = authData.users.find(u => u.email === email)
  if (!user) {
    console.error(`User ${email} missing in Auth!`)
    return
  }
  
  console.log(`Found Auth UUID: ${user.id}`)

  // FORCE insert/update into the public.users table
  const { data, error } = await supabase.from('users').upsert({
    id: user.id,
    email: user.email,
    name: "Super Admin",
    role: "super_admin",
    onboarding_completed: true
  }).select()

  if (error) {
    console.error("DB Error:", error)
  } else {
    console.log("Upserted gracefully! Data:", data)
  }
}

fixUser()
