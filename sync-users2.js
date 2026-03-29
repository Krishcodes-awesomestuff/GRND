require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function syncUsers() {
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
  
  for (const au of users) {
    const role = au.user_metadata?.role || 'player'
    const name = au.user_metadata?.name || 'Unnamed'
    
    const { data: publicUser } = await supabase.from('users').select('id').eq('id', au.id).single()
    
    if (!publicUser) {
      console.log(`Inserting ${au.email}...`)
      const { error: insertError } = await supabase.from('users').insert({
        id: au.id,
        email: au.email,
        name: name,
        role: role,
        onboarding_completed: false
      })
      if (insertError) {
        console.error(`ERROR for ${au.email}:`, JSON.stringify(insertError, null, 2))
      }
    }
  }
}

syncUsers()
