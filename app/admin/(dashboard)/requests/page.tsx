import { getEditRequests } from "@/services/turf.service"
import { EditRequestActions } from "@/components/edit-request-actions"

export default async function RequestsPage() {
  const [pending, approved, rejected] = await Promise.all([
    getEditRequests("pending"),
    getEditRequests("approved"),
    getEditRequests("rejected"),
  ])

  const all = [
    ...pending.map(r => ({ ...r, status: "pending" as const })),
    ...approved.map(r => ({ ...r, status: "approved" as const })),
    ...rejected.map(r => ({ ...r, status: "rejected" as const })),
  ]

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold">Edit Requests</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {pending.length} pending · {approved.length} approved · {rejected.length} rejected
        </p>
      </div>

      {all.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
          No edit requests yet.
        </div>
      ) : (
        <div className="rounded-lg border divide-y overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
            <span className="col-span-3">Turf</span>
            <span className="col-span-2">Type</span>
            <span className="col-span-3">Requested Value</span>
            <span className="col-span-2">Date</span>
            <span className="col-span-2 text-right">Action</span>
          </div>

          {all.map(req => (
            <div key={req.id} className="grid grid-cols-12 px-4 py-3 items-start gap-y-1">
              <div className="col-span-3">
                <p className="text-sm font-medium">{req.turf?.name ?? "—"}</p>
                {req.note && <p className="text-xs text-muted-foreground mt-0.5 italic">&ldquo;{req.note}&rdquo;</p>}
              </div>
              <span className="col-span-2 text-sm text-muted-foreground capitalize">{req.request_type}</span>
              <span className="col-span-3 text-sm break-words">{req.requested_value}</span>
              <span className="col-span-2 text-xs text-muted-foreground">
                {new Date(req.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
              <div className="col-span-2 flex justify-end">
                {req.status === "pending" ? (
                  <EditRequestActions requestId={req.id} />
                ) : (
                  <span className={`text-xs rounded-full px-2 py-0.5 ${
                    req.status === "approved"
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
