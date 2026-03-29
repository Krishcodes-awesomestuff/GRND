require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function debugUser() {
  const userId = '83a00388-c318-471b-9991-770b909036dc' // kp...
  console.log("Checking for user ID:", userId)
  
  const { data, error } = await supabase.from('users').select('*').eq('id', userId)
  console.log("Result:", data)
  
  const { count, error: countErr } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'player')
  console.log("Total players count:", count)
}

debugUser()
