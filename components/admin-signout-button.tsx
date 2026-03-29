"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

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
      className="w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  )
}
