import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  name: string | null
  email: string | null
  role: "player" | "turf_owner"
  location: string | null
  onboarding_completed: boolean
  sports: string[]
  level: string | null
  frequency: string | null
  created_at: string
}

export interface SignUpMetadata {
  name?: string
  role?: "player" | "turf_owner"
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────
// Creates auth user only. Sends verification email. No profile insert.
export async function signUp(
  email: string,
  password: string,
  metadata: SignUpMetadata = {}
) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: metadata.name ?? "",
        role: metadata.role ?? "player",
      },
    },
  })
  return { data, error }
}

// ─── Sign In ─────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

// ─── Get Current User ─────────────────────────────────────────────────────────
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// ─── Auth State Change Listener ───────────────────────────────────────────────
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  const supabase = createClient()
  return supabase.auth.onAuthStateChange(callback)
}

// ─── Get or Create Profile ───────────────────────────────────────────────────
// Called after successful login. Inserts profile if it doesn't exist yet.
export async function getOrCreateProfile(user: User): Promise<UserProfile | null> {
  const supabase = createClient()

  // Try to fetch existing profile
  const { data: existing, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (existing) return existing as UserProfile

  // No profile found — insert using metadata stored at signup
  const meta = user.user_metadata as SignUpMetadata & { name?: string; role?: string }
  const { data: inserted, error: insertError } = await supabase
    .from("users")
    .insert({
      id: user.id,
      email: user.email,
      name: meta?.name ?? null,
      role: (meta?.role as "player" | "turf_owner") ?? "player",
      location: null,
    })
    .select()
    .single()

  if (insertError) {
    console.error("Profile insert error:", insertError.message)
    return null
  }

  return inserted as UserProfile
}

// ─── Update User Onboarding ──────────────────────────────────────────────────
export async function updateUserOnboarding(
  userId: string,
  data: {
    sports: string[]
    level: string
    frequency: string
    location: string
  }
) {
  const supabase = createClient()
  const { error } = await supabase
    .from("users")
    .update({
      sports: data.sports,
      level: data.level,
      frequency: data.frequency,
      location: data.location,
      onboarding_completed: true,
    })
    .eq("id", userId)

  return { error }
}
