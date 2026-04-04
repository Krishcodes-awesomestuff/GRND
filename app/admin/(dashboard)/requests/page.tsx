import { getEditRequests } from "@/services/turf.service"
import { EditRequestActions } from "@/components/edit-request-actions"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function RequestsPage() {
  const [pending, approved, rejected] = await Promise.all([
    getEditRequests("pending"),
    getEditRequests("approved"),
    getEditRequests("rejected"),
  ])

  const all = [
    ...pending.map((r) => ({ ...r, status: "pending" as const })),
    ...approved.map((r) => ({ ...r, status: "approved" as const })),
    ...rejected.map((r) => ({ ...r, status: "rejected" as const })),
  ]

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4 data-vertical:self-auto" />
          <h1 className="text-base font-medium">Edit Requests</h1>
        </div>
        <div className="flex items-center gap-2 px-4 lg:px-6 ml-auto flex-wrap">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400">
            {pending.length} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400">
            {approved.length} Approved
          </Badge>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            {rejected.length} Rejected
          </Badge>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {all.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card px-6 py-16 text-center text-sm text-muted-foreground">
            No edit requests yet.
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turf</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Requested Value</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {all.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <p className="font-medium">{req.turf?.name ?? "—"}</p>
                      {req.note && (
                        <p className="text-xs text-muted-foreground italic mt-0.5">
                          &ldquo;{req.note}&rdquo;
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">{req.request_type}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[180px] truncate">{req.requested_value}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(req.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "pending" ? (
                        <EditRequestActions requestId={req.id} />
                      ) : req.status === "approved" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400">
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
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
