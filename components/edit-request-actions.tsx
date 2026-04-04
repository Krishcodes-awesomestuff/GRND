"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

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
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("rejected")}
        disabled={isPending}
        className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
      >
        Reject
      </Button>
      <Button
        size="sm"
        onClick={() => handleAction("approved")}
        disabled={isPending}
      >
        Approve
      </Button>
    </div>
  )
}
