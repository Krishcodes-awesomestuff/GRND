require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) {
    console.error("Error fetching users:", error)
  } else {
    console.log("Current users in public.users table:", data)
  }
}

checkUsers()
