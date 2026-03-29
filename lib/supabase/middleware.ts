import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isProtectedPlayer = pathname.startsWith("/player")
  const isProtectedTurf = pathname.startsWith("/turf")
  const isProtectedAdmin = pathname.startsWith("/admin") && pathname !== "/admin/login"

  // ── Unauthenticated users ────────────────────────────────────────────────────
  if (!user) {
    if (isProtectedPlayer || isProtectedTurf || isProtectedAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = isProtectedAdmin ? "/admin/login" : "/"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // ── Authenticated users ──────────────────────────────────────────────────────
  // Fetch the role from the users table (single lightweight query)
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role ?? "player"

  // Super admin trying to access player/turf areas → redirect to admin
  if (role === "super_admin" && (isProtectedPlayer || isProtectedTurf)) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/dashboard"
    return NextResponse.redirect(url)
  }

  // Non-admin trying to reach /admin routes → redirect out
  if (role !== "super_admin" && isProtectedAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = role === "turf_owner" ? "/turf/dashboard" : "/"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
