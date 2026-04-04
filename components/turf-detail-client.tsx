"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { Turf } from "@/services/turf.service"
import Link from "next/link"

const SPORT_OPTIONS = ["Football", "Cricket", "Basketball", "Badminton", "Tennis", "Volleyball", "Hockey"]

export function TurfDetailClient({ turf }: { turf: Turf }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [ownerPending, startOwnerTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [ownerError, setOwnerError] = useState<string | null>(null)
  const [showOwnerForm, setShowOwnerForm] = useState(false)

  const [form, setForm] = useState({
    name: turf.name,
    address: turf.address,
    city: turf.city,
    phone: turf.phone,
    price_per_hour: turf.price_per_hour?.toString() ?? "",
    sport_types: turf.sport_types,
    is_active: turf.is_active,
  })

  function toggleSport(sport: string) {
    setForm(f => ({
      ...f,
      sport_types: f.sport_types.includes(sport)
        ? f.sport_types.filter(s => s !== sport)
        : [...f.sport_types, sport],
    }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await fetch(`/api/admin/update-turf`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: turf.id,
          ...form,
          price_per_hour: form.price_per_hour ? parseFloat(form.price_per_hour) : null,
        }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? "Update failed.")
        return
      }
      router.refresh()
    })
  }

  async function handleGenerateOwner(e: React.FormEvent) {
    e.preventDefault()
    setOwnerError(null)
    setGeneratedPassword(null)
    startOwnerTransition(async () => {
      const res = await fetch("/api/admin/create-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ownerEmail, name: ownerName, turf_id: turf.id }),
      })
      const json = await res.json()
      if (!res.ok) {
        setOwnerError(json.error ?? "Failed to create owner.")
        return
      }
      setGeneratedPassword(json.temp_password)
      setOwnerEmail("")
      setOwnerName("")
    })
  }

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <Link href="/admin/turfs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to turfs
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-semibold">{turf.name}</h1>
          <span className={`text-xs rounded-full px-2 py-0.5 ${turf.is_active ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive"}`}>
            {turf.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{turf.city}</p>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="space-y-5">
        <h2 className="text-sm font-medium border-b pb-2">Turf Details</h2>

        <Field label="Turf Name" required>
          <TextInput value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </Field>

        <Field label="Address" required>
          <TextInput value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="City" required>
            <TextInput value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
          </Field>
          <Field label="Phone">
            <TextInput type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </Field>
        </div>

        <Field label="Price per hour (₹)">
          <TextInput type="number" min="0" step="50" value={form.price_per_hour} onChange={e => setForm(f => ({ ...f, price_per_hour: e.target.value }))} />
        </Field>

        <Field label="Sport Types">
          <div className="flex flex-wrap gap-2 mt-1">
            {SPORT_OPTIONS.map(sport => (
              <button key={sport} type="button" onClick={() => toggleSport(sport)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  form.sport_types.includes(sport)
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground hover:text-foreground hover:border-foreground/50"
                }`}>
                {sport}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Status">
          <div className="flex items-center gap-3 mt-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                className="rounded border" />
              Active (visible to players)
            </label>
          </div>
        </Field>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        )}

        <button type="submit" disabled={isPending}
          className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50">
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Owner generation */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">Turf Owner Account</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {turf.owner_id ? "An owner is already linked to this turf." : "No owner linked yet."}
            </p>
          </div>
          {!generatedPassword && (
            <button onClick={() => setShowOwnerForm(v => !v)}
              className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
              {showOwnerForm ? "Cancel" : "Generate owner account"}
            </button>
          )}
        </div>

        {showOwnerForm && !generatedPassword && (
          <form onSubmit={handleGenerateOwner} className="flex gap-3 items-end">
            <Field label="Owner Name" required>
              <TextInput value={ownerName} onChange={e => setOwnerName(e.target.value)}
                placeholder="John Doe" required />
            </Field>
            <Field label="Owner Email" required>
              <TextInput type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)}
                placeholder="owner@example.com" required />
            </Field>
            <button type="submit" disabled={ownerPending}
              className="mb-0 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0">
              {ownerPending ? "Creating…" : "Create"}
            </button>
          </form>
        )}

        {ownerError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{ownerError}</div>
        )}

        {generatedPassword && (
          <div className="rounded-md border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">✓ Owner account created</p>
            <p className="text-xs text-muted-foreground">Share these credentials with the turf owner. The password is shown only once.</p>
            <div className="rounded border bg-background px-3 py-2 font-mono text-sm">{generatedPassword}</div>
            <p className="text-xs text-muted-foreground">They can change their password after logging in via Forgot Password.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label} {required && <span className="text-destructive">*</span>}</label>
      {children}
    </div>
  )
}

function TextInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" {...props} />
  )
}
