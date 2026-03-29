import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getTurfs } from "@/services/turf.service"
import { getEditRequests } from "@/services/turf.service"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  // 🚀 Initialize Supabase with the Server Role Key specifically for raw Admin queries
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  // Platform stats bypassing RLS
  const [{ count: playerCount }, { count: ownerCount }, turfs, pendingRequests] =
    await Promise.all([
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("role", "player"),
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("role", "turf_owner"),
      getTurfs(),
      getEditRequests("pending"),
    ])

  const stats = [
    { label: "Total Players", value: playerCount ?? 0 },
    { label: "Turf Owners", value: ownerCount ?? 0 },
    { label: "Active Turfs", value: turfs.filter(t => t.is_active).length },
    { label: "Pending Requests", value: pendingRequests.length },
  ]

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-lg border bg-card p-5 space-y-1">
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent turfs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Recent Turfs</h2>
          <Link href="/admin/turfs/new" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
            + New turf
          </Link>
        </div>

        {turfs.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            No turfs yet. <Link href="/admin/turfs/new" className="underline underline-offset-2">Create the first one.</Link>
          </div>
        ) : (
          <div className="rounded-lg border divide-y overflow-hidden">
            {turfs.slice(0, 5).map(turf => (
              <Link
                key={turf.id}
                href={`/admin/turfs/${turf.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{turf.name}</p>
                  <p className="text-xs text-muted-foreground">{turf.city}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs rounded-full px-2 py-0.5 ${turf.is_active ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive"}`}>
                    {turf.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-muted-foreground/50 text-xs">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pending edit requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Pending Edit Requests</h2>
            <Link href="/admin/requests" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
              View all
            </Link>
          </div>
          <div className="rounded-lg border divide-y overflow-hidden">
            {pendingRequests.slice(0, 3).map(req => (
              <div key={req.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{req.turf?.name ?? req.turf_id}</p>
                  <p className="text-xs text-muted-foreground capitalize">{req.request_type} → {req.requested_value}</p>
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full px-2 py-0.5">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
