"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";

export async function updateListing(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const title = String(formData.get("title") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const level = Number(formData.get("level") ?? 0);
  const sellerName = String(formData.get("sellerName") ?? "");
  const sellerDiscord = String(formData.get("sellerDiscord") ?? "") || null;
  const sellerEmail = String(formData.get("sellerEmail") ?? "") || null;
  const sellerPhone = String(formData.get("sellerPhone") ?? "") || null;
  const verified = formData.get("verified") === "on";
  const rating = formData.get("rating") ? Number(formData.get("rating")) : null;
  const statLine = String(formData.get("statLine") ?? "");
  const accountType = String(formData.get("accountType") ?? "") || null;
  const tag = String(formData.get("tag") ?? "");
  const middleman = formData.get("middleman") === "on";
  const featured = formData.get("featured") === "on";
  const troopsInfo = String(formData.get("troopsInfo") ?? "");
  const status = String(formData.get("status") ?? "active");
  const accountOfWeek = formData.get("accountOfWeek") === "on";

  // Un seul "compte de la semaine" à la fois
  if (accountOfWeek) {
    await prisma.listing.updateMany({ where: { accountOfWeek: true, NOT: { id } }, data: { accountOfWeek: false } });
  }

  const existing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) return;

  // Nouvelles photos ajoutées côté client (mêmes catégories que la création)
  const uploadedImagesRaw = String(formData.get("uploadedImages") ?? "[]");
  let uploadedImages: { url: string; category: string }[] = [];
  try {
    uploadedImages = JSON.parse(uploadedImagesRaw);
  } catch {
    uploadedImages = [];
  }

  const imageUrlsRaw = String(formData.get("imageUrls") ?? "");
  const pastedUrls = imageUrlsRaw
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  // Photos déjà en ligne à supprimer (uniquement celles de CE compte)
  let deleteIds: string[] = [];
  try {
    deleteIds = JSON.parse(String(formData.get("deleteImageIds") ?? "[]"));
  } catch {
    deleteIds = [];
  }
  const toDelete = existing.images.filter((img) => deleteIds.includes(img.id));
  if (toDelete.length > 0) {
    await prisma.listingImage.deleteMany({ where: { id: { in: toDelete.map((img) => img.id) }, listingId: id } });
    for (const img of toDelete) {
      try {
        await del(img.url); // nettoie Vercel Blob
      } catch {
        // lien externe collé : rien à supprimer côté Blob
      }
    }
  }
  const remainingCount = existing.images.length - toDelete.length;

  const startOrder = existing.images.length;
  const newImages = [
    ...uploadedImages.map((img, i) => ({ url: img.url, category: img.category, sortOrder: startOrder + i })),
    ...pastedUrls.map((url, i) => ({ url, category: "overview", sortOrder: startOrder + uploadedImages.length + i })),
  ];

  await prisma.listing.update({
    where: { id },
    data: {
      title,
      price,
      level,
      sellerName,
      sellerDiscord,
      sellerEmail,
      sellerPhone,
      verified,
      rating,
      statLine,
      accountType,
      tag,
      middleman,
      featured,
      accountOfWeek,
      troopsInfo,
      status,
      imageLabel: remainingCount + newImages.length === 0 ? "Account overview" : null,
      images: newImages.length > 0 ? { create: newImages } : undefined,
    },
  });

  redirect(`/browse/${id}`);
}
