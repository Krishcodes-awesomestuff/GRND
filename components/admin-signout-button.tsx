"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { LogOut } from "lucide-react"

export function AdminSignOutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/admin/login")
    })
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-white/50 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" />
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  )
}
