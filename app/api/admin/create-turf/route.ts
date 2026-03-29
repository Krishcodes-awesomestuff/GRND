import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (profile?.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const { name, address, city, phone, sport_types, price_per_hour } = body

  if (!name || !address || !city) {
    return NextResponse.json({ error: "Name, address, and city are required." }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("turfs")
    .insert({ name, address, city, phone, sport_types, price_per_hour })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id }, { status: 201 })
}
