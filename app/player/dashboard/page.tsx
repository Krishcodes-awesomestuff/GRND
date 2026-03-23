import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PlayerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/")

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profile && !profile.onboarding_completed) {
    redirect("/onboarding")
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="text-6xl">🏃</div>
        <div>
          <h1 className="text-3xl font-bold">Player Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {profile?.name ?? user.email}!</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-left space-y-2 text-sm">
          <p><span className="font-medium text-foreground">Email:</span> <span className="text-muted-foreground">{user.email}</span></p>
          <p><span className="font-medium text-foreground">Role:</span> <span className="text-muted-foreground">Player</span></p>
          {profile?.location && (
            <p><span className="font-medium text-foreground">Location:</span> <span className="text-muted-foreground">{profile.location}</span></p>
          )}
        </div>
        <form action={async () => {
          "use server"
          const supabase = await createClient()
          await supabase.auth.signOut()
          redirect("/")
        }}>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
