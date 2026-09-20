"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";

export async function deleteListing(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!listing) return;

  // Nettoie aussi les photos stockées sur Vercel Blob
  for (const img of listing.images) {
    try {
      await del(img.url);
    } catch {
      // une image externe (lien collé) ne peut pas être supprimée de Blob, on ignore
    }
  }

  await prisma.listing.delete({ where: { id } });

  revalidatePath("/admin/listings");
  revalidatePath("/browse");
  revalidatePath("/");
}
