"use client"

import React, { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { signIn } from "@/services/auth.service"
import { createClient } from "@/lib/supabase/client"

export function AdminLoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      // Sign in via Supabase
      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        setError(signInError.message)
        return
      }

      // Verify the role is super_admin
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError("Authentication failed."); return }

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role !== "super_admin") {
        await supabase.auth.signOut()
        setError("Access denied. This portal is for admins only.")
        return
      }

      // All good — redirect
      window.location.href = "/admin/dashboard"
    })
  }

  return (
    <div className={cn("w-full max-w-sm space-y-6", className)} {...props}>
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">GRND</span>
          <span className="text-xs text-muted-foreground/40">/</span>
          <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Admin</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">Super admin access only.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter Admin Mail"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}
