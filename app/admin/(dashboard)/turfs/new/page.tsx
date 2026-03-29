"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const SPORT_OPTIONS = ["Football", "Cricket", "Basketball", "Badminton", "Tennis", "Volleyball", "Hockey"]

export default function NewTurfPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    price_per_hour: "",
    sport_types: [] as string[],
  })

  function toggleSport(sport: string) {
    setForm(f => ({
      ...f,
      sport_types: f.sport_types.includes(sport)
        ? f.sport_types.filter(s => s !== sport)
        : [...f.sport_types, sport],
    }))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const res = await fetch("/api/admin/create-turf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price_per_hour: form.price_per_hour ? parseFloat(form.price_per_hour) : null,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.")
        return
      }
      router.push(`/admin/turfs/${json.id}`)
    })
  }

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <div>
        <Link href="/admin/turfs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to turfs
        </Link>
        <h1 className="text-xl font-semibold mt-3">New Turf</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to onboard a new turf.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Turf Name */}
        <Field label="Turf Name" required>
          <TextInput name="name" placeholder="e.g. Elite Sports Arena" value={form.name} onChange={handleChange} required />
        </Field>

        {/* Address */}
        <Field label="Address" required>
          <TextInput name="address" placeholder="Street / landmark" value={form.address} onChange={handleChange} required />
        </Field>

        {/* City + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" required>
            <TextInput name="city" placeholder="e.g. Hyderabad" value={form.city} onChange={handleChange} required />
          </Field>
          <Field label="Phone">
            <TextInput name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
          </Field>
        </div>

        {/* Price */}
        <Field label="Price per hour (₹)">
          <TextInput name="price_per_hour" type="number" min="0" step="50" placeholder="e.g. 1500" value={form.price_per_hour} onChange={handleChange} />
        </Field>

        {/* Sports */}
        <Field label="Sport Types">
          <div className="flex flex-wrap gap-2 mt-1">
            {SPORT_OPTIONS.map(sport => (
              <button
                key={sport}
                type="button"
                onClick={() => toggleSport(sport)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  form.sport_types.includes(sport)
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground hover:border-foreground/50"
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </Field>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Creating…" : "Create turf"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/turfs")}
            className="rounded-md border px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      {...props}
    />
  )
}
