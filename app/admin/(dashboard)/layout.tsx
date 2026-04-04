import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

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

  const displayName = profile?.name ?? profile?.email ?? user.email ?? "Admin"

  return (
    <SidebarProvider>
      <AdminSidebar
        user={{
          name: displayName,
          email: profile?.email ?? user.email ?? "",
          avatar: "",
        }}
      />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
