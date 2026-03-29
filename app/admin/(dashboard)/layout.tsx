import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminSignOutButton } from "@/components/admin-signout-button"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/admin/turfs", label: "Turfs", icon: "⬡" },
  { href: "/admin/requests", label: "Edit Requests", icon: "⊞" },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: profile } = await supabase
    .from("users")
    .select("role, name, email")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "super_admin") redirect("/")

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r flex flex-col">
        {/* Brand */}
        <div className="px-5 py-5 border-b">
          <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">GRND</span>
          <span className="text-muted-foreground/30 mx-1">/</span>
          <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer — user info + sign out */}
        <div className="px-4 py-4 border-t space-y-2">
          <p className="text-xs text-muted-foreground truncate">{profile?.email ?? user.email}</p>
          <AdminSignOutButton />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
