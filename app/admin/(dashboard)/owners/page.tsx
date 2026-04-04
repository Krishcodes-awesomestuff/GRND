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

export default async function OwnersPage() {
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: owners, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("role", "turf_owner")
    .order("created_at", { ascending: false })

  const { data: turfs } = await supabaseAdmin
    .from("turfs")
    .select("id, name, owner_id")
    .not("owner_id", "is", null)

  if (error) {
    console.error("Owners fetch error:", error)
  }

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b">
        <div className="flex flex-1 items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4 data-vertical:self-auto" />
          <h1 className="text-base font-medium">Turf Owners</h1>
          <span className="text-xs text-muted-foreground ml-1">({owners?.length ?? 0} total)</span>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {!owners || owners.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card px-6 py-16 text-center space-y-3">
            <p className="text-sm text-muted-foreground">No turf owners exist yet.</p>
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Turf Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell className="font-medium">{owner.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {owner.name || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {turfs?.filter(t => t.owner_id === owner.id).map(t => (
                        <Link key={t.id} href={`/admin/turfs/${t.id}`} className="block hover:underline truncate max-w-[200px]">
                          {t.name}
                        </Link>
                      )) || "—"}
                      {(!turfs || turfs.filter(t => t.owner_id === owner.id).length === 0) && "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {owner.onboarding_completed ? (
                        <span className="text-green-600 font-medium">Onboarded</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                      {new Date(owner.created_at).toLocaleDateString("en-GB", {
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
