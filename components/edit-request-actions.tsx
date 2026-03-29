"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

export function EditRequestActions({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleAction(action: "approved" | "rejected") {
    startTransition(async () => {
      await fetch("/api/admin/review-request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: action }),
      })
      router.refresh()
    })
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("approved")}
        disabled={isPending}
        className="rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => handleAction("rejected")}
        disabled={isPending}
        className="rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
