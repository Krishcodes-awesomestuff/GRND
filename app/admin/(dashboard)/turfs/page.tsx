import { getTurfs } from "@/services/turf.service"
import Link from "next/link"

export default async function TurfsPage() {
  const turfs = await getTurfs()

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Turfs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{turfs.length} total</p>
        </div>
        <Link
          href="/admin/turfs/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
        >
          + New turf
        </Link>
      </div>

      {turfs.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-16 text-center space-y-3">
          <p className="text-sm text-muted-foreground">No turfs have been onboarded yet.</p>
          <Link
            href="/admin/turfs/new"
            className="inline-block rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            Create the first turf
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border divide-y overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
            <span className="col-span-4">Name</span>
            <span className="col-span-3">City</span>
            <span className="col-span-2">Sports</span>
            <span className="col-span-2">Price / hr</span>
            <span className="col-span-1 text-right">Status</span>
          </div>

          {turfs.map(turf => (
            <Link
              key={turf.id}
              href={`/admin/turfs/${turf.id}`}
              className="grid grid-cols-12 px-4 py-3 items-center hover:bg-muted/50 transition-colors"
            >
              <span className="col-span-4 text-sm font-medium">{turf.name}</span>
              <span className="col-span-3 text-sm text-muted-foreground">{turf.city}</span>
              <span className="col-span-2 text-sm text-muted-foreground">
                {turf.sport_types.length > 0 ? turf.sport_types.join(", ") : "—"}
              </span>
              <span className="col-span-2 text-sm text-muted-foreground">
                {turf.price_per_hour != null ? `₹${turf.price_per_hour}` : "—"}
              </span>
              <span className="col-span-1 flex justify-end">
                <span className={`text-xs rounded-full px-2 py-0.5 ${turf.is_active ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive"}`}>
                  {turf.is_active ? "Active" : "Off"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
