import { getTurfs } from "@/services/turf.service"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusIcon } from "lucide-react"

export default async function TurfsPage() {
  const turfs = await getTurfs()

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b">
        <div className="flex flex-1 items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4 data-vertical:self-auto" />
          <h1 className="text-base font-medium">Turfs</h1>
          <span className="text-xs text-muted-foreground ml-1">({turfs.length} total)</span>
        </div>
        <div className="px-4 lg:px-6">
          <Link href="/admin/turfs/new">
            <Button size="sm">
              <PlusIcon className="size-4" />
              New Turf
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {turfs.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card px-6 py-16 text-center space-y-3">
            <p className="text-sm text-muted-foreground">No turfs have been onboarded yet.</p>
            <Link href="/admin/turfs/new">
              <Button size="sm">
                <PlusIcon className="size-4" />
                Create the first turf
              </Button>
            </Link>
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Sports</TableHead>
                  <TableHead>Price / hr</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turfs.map((turf) => (
                  <TableRow key={turf.id} className="cursor-pointer">
                    <TableCell>
                      <Link href={`/admin/turfs/${turf.id}`} className="font-medium hover:underline">
                        {turf.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{turf.address}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {turf.sport_types.length > 0 ? turf.sport_types.join(", ") : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {turf.price_per_hour != null ? `₹${turf.price_per_hour}` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={turf.is_active ? "outline" : "destructive"}>
                        {turf.is_active ? "Active" : "Inactive"}
                      </Badge>
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
