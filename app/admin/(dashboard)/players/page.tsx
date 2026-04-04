import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function PlayersPage() {
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: players, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("role", "player")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Players fetch error:", error)
  }

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b">
        <div className="flex flex-1 items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4 data-vertical:self-auto" />
          <h1 className="text-base font-medium">Players</h1>
          <span className="text-xs text-muted-foreground ml-1">({players?.length ?? 0} total)</span>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {!players || players.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card px-6 py-16 text-center space-y-3">
            <p className="text-sm text-muted-foreground">No players have joined the platform yet.</p>
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sports (Preferences)</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      {player.name || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{player.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {player.sports && player.sports.length > 0 ? player.sports.join(", ") : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">
                      {player.level || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">
                      {player.frequency || "—"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                      {new Date(player.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </>
  )
}
