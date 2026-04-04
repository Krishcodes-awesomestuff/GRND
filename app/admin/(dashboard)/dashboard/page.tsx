import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { getTurfs } from "@/services/turf.service"
import { getEditRequests } from "@/services/turf.service"
import Link from "next/link"

export default async function AdminDashboard() {
  // 🚀 Initialize standard Supabase client with the Server Role Key specifically for raw Admin queries
  // Do NOT pass cookies here, or it will override the service role key with the user's session!
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    { label: "Total Players", value: playerCount ?? 0, href: "/admin/players" },
    { label: "Turf Owners", value: ownerCount ?? 0, href: "/admin/owners" },
    { label: "Active Turfs", value: turfs.filter(t => t.is_active).length, href: "/admin/turfs" },
    { label: "Pending Requests", value: pendingRequests.length, href: "/admin/requests" },
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
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-xl border bg-card p-5 space-y-1 shadow-sm hover:bg-muted/30 transition-colors cursor-pointer h-full">
              <p className="text-3xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent turfs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">Recent Turfs</h2>
          <Link href="/admin/turfs/new" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
            + New turf
          </Link>
        </div>

        {turfs.length === 0 ? (
          <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground bg-card">
            No turfs yet. <Link href="/admin/turfs/new" className="underline underline-offset-4">Create the first one.</Link>
          </div>
        ) : (
          <div className="rounded-xl border divide-y overflow-hidden shadow-sm bg-card">
            {turfs.slice(0, 5).map(turf => (
              <Link
                key={turf.id}
                href={`/admin/turfs/${turf.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{turf.name}</p>
                  <p className="text-[13px] text-blue-500/80">{turf.city}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[11px] rounded-full px-3 py-1 bg-muted/50 text-muted-foreground`}>
                    {turf.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-muted-foreground/30 text-xs font-light">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pending edit requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3 pt-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold">Pending Edit Requests</h2>
            <Link href="/admin/requests" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
              View all
            </Link>
          </div>
          <div className="rounded-xl border divide-y overflow-hidden shadow-sm bg-card">
            {pendingRequests.slice(0, 3).map(req => (
              <div key={req.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium">{req.turf?.name ?? req.turf_id}</p>
                  <p className="text-[13px] text-muted-foreground capitalize mt-0.5">{req.request_type} → {req.requested_value}</p>
                </div>
                <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-3 py-1 font-medium">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
