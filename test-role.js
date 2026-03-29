require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  const email = 'admin.grnd@gmail.com'
  const { data: authData } = await supabase.auth.admin.listUsers()
  const user = authData.users.find(u => u.email === email)
  
  console.log("Found user ID:", user.id)
  
  const { error } = await supabase.from('users').update({ role: 'super_admin' }).eq('id', user.id)
  
  if (error) {
    console.error("DB Error:", error)
  } else {
    console.log("Success! Updated role to super_admin")
  }
}

test()
