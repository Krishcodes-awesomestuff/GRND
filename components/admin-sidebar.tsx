"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Grid, Hexagon, Layout, LogOut, Users, UserCog } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Grid },
  { title: "Players", url: "/admin/players", icon: Users },
  { title: "Turf Owners", url: "/admin/owners", icon: UserCog },
  { title: "Turfs", url: "/admin/turfs", icon: Hexagon },
  { title: "Edit Requests", url: "/admin/requests", icon: Layout },
]

export function AdminSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string }
}) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/admin/login"
  }

  return (
    <Sidebar 
      collapsible="none" 
      className="border-r border-border/40 bg-white min-h-screen" 
      style={{ "--sidebar-width": "14rem" } as React.CSSProperties}
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="h-[3.5rem] flex items-center border-b border-border/40 px-5 justify-center">
        <div className="flex items-center gap-1.5 w-full">
          <span className="text-[9px] font-medium tracking-widest text-muted-foreground uppercase">GRND</span>
          <span className="text-[9px] text-muted-foreground/30">/</span>
          <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">ADMIN</span>
        </div>
      </SidebarHeader>
      
      {/* Navigation */}
      <SidebarContent className="px-3 pt-6">
        <SidebarMenu className="gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/admin/dashboard" && pathname.startsWith(item.url))
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isActive}
                  render={<Link href={item.url} />}
                  className={`px-3 py-2 text-[11px] transition-colors rounded-none ${
                    isActive 
                      ? "font-medium text-foreground bg-[oklch(0.97_0_0)]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                  }`}
                >
                  <Icon className="size-3.5 opacity-70 stroke-[1.5]" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border/40 p-5">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] text-muted-foreground font-medium truncate px-1">{user.email}</span>
          <button 
            onClick={handleSignOut}
            style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
            className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-md text-[11px] font-semibold hover:opacity-90 active:opacity-80 transition-opacity cursor-pointer"
          >
            <LogOut className="size-3.5" style={{ color: '#ffffff' }} />
            Sign out
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
