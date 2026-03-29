import { createClient } from "@/lib/supabase/server"

export interface Turf {
  id: string
  name: string
  address: string
  city: string
  phone: string
  sport_types: string[]
  images: string[]
  price_per_hour: number | null
  owner_id: string | null
  is_active: boolean
  created_at: string
}

export interface CreateTurfPayload {
  name: string
  address: string
  city: string
  phone: string
  sport_types: string[]
  price_per_hour: number | null
}

// ── Get all turfs ──────────────────────────────────────────────────────────────
export async function getTurfs(): Promise<Turf[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("turfs")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("getTurfs error:", error.message)
    return []
  }
  return data as Turf[]
}

// ── Get single turf ────────────────────────────────────────────────────────────
export async function getTurfById(id: string): Promise<Turf | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("turfs")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data as Turf
}

// ── Create turf ────────────────────────────────────────────────────────────────
export async function createTurf(
  payload: CreateTurfPayload
): Promise<{ data: Turf | null; error: string | null }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("turfs")
    .insert(payload)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Turf, error: null }
}

// ── Update turf ────────────────────────────────────────────────────────────────
export async function updateTurf(
  id: string,
  payload: Partial<CreateTurfPayload> & { is_active?: boolean; owner_id?: string; images?: string[] }
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.from("turfs").update(payload).eq("id", id)
  if (error) return { error: error.message }
  return { error: null }
}

// ── Get edit requests ──────────────────────────────────────────────────────────
export interface EditRequest {
  id: string
  turf_id: string
  owner_id: string
  request_type: string
  current_value: string | null
  requested_value: string
  note: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
  turf?: { name: string }
}

export async function getEditRequests(
  status: "pending" | "approved" | "rejected" = "pending"
): Promise<EditRequest[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("turf_edit_requests")
    .select("*, turf:turfs(name)")
    .eq("status", status)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("getEditRequests error:", error.message)
    return []
  }
  return data as EditRequest[]
}

// ── Update edit request status ─────────────────────────────────────────────────
export async function updateEditRequestStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("turf_edit_requests")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { error: error.message }
  return { error: null }
}
