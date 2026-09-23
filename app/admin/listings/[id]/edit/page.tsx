import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditListingForm from "./EditListingForm";

export const dynamic = "force-dynamic";

export default async function EditListing({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: "asc" }, select: { id: true, url: true, category: true } } },
  });
  if (!listing) return notFound();

  return (
    <main style={{ maxWidth: 560, margin: "48px auto", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Modifier l&apos;annonce</h1>
      <a href="/admin/listings" style={{ fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 20 }}>← Retour à la liste</a>
      <EditListingForm listing={listing} />
    </main>
  );
}
