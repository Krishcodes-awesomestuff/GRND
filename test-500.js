require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // using anon key to simulate client
)

async function test() {
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'admin.grnd@gmail.com',
    password: process.argv[2] || '' // Not needed if we can hit it anonymously, but users usually need RLS
  })
  
  // Try querying without auth first just to see what happens
  const { data, error, status, statusText } = await supabase
    .from('users')
    .select('role')
    .limit(1)

  console.log("Status:", status, statusText)
  if (error) {
    console.error("DB Error Details:", JSON.stringify(error, null, 2))
  } else {
    console.log("Success:", data)
  }
}

test()
