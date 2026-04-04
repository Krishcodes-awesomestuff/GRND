import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Generates a reasonably strong temp password
function generateTempPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#"
  return Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export async function POST(req: NextRequest) {
  // Auth check — must be super_admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: callerProfile } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (callerProfile?.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { email, name, turf_id } = await req.json()
  if (!email || !turf_id || !name) return NextResponse.json({ error: "Email, name, and turf_id are required." }, { status: 400 })

  const tempPassword = generateTempPassword()
  const adminClient = createAdminClient()

  // Create the auth user with the service role key
  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { role: "turf_owner", name },
  })

  if (createError) return NextResponse.json({ error: createError.message }, { status: 500 })

  // Update the users table profile (which was already created by the auth trigger)
  const { error: profileError } = await adminClient
    .from("users")
    .update({
      role: "turf_owner",
      name: name,
      onboarding_completed: true,
    })
    .eq("id", newUser.user!.id)
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  // Link owner to the turf
  const { error: linkError } = await adminClient
    .from("turfs")
    .update({ owner_id: newUser.user!.id })
    .eq("id", turf_id)
  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 })

  // Return the temp password — shown to admin once, never stored
  return NextResponse.json({ temp_password: tempPassword }, { status: 201 })
}
