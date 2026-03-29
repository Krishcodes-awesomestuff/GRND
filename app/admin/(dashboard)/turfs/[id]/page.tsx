import { getTurfById } from "@/services/turf.service"
import { notFound } from "next/navigation"
import { TurfDetailClient } from "@/components/turf-detail-client"

export default async function TurfDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const turf = await getTurfById(id)
  if (!turf) notFound()

  return <TurfDetailClient turf={turf} />
}
