import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { join } from 'path'

// Load .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing supabase credentials in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function promoteAdmin() {
  const email = 'admin.grnd@gmail.com'
  
  // 1. Get auth user
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.error("Failed to list users", authError)
    process.exit(1)
  }

  const user = authData.users.find(u => u.email === email)
  
  if (!user) {
    console.error(`User ${email} not found in Supabase Auth! Please sign up first.`)
    process.exit(1)
  }

  console.log(`Found auth user: ${user.id}`)

  // 2. Upsert the public.users record
  const { data, error } = await supabase.from('users').upsert({
    id: user.id,
    email: user.email,
    role: 'super_admin',
    name: 'Super Admin',
    onboarding_completed: true
  }).select().single()

  if (error) {
    console.error("Failed to update public.users table:", error)
    process.exit(1)
  }

  console.log(`Successfully promoted ${email} to super_admin!`)
}

promoteAdmin()
