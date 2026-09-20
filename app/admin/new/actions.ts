"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createListing(formData: FormData) {
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

  // Images déjà uploadées côté client (voir NewListingForm.tsx)
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

  const imagesToCreate = [
    ...uploadedImages.map((img, i) => ({ url: img.url, category: img.category, sortOrder: i })),
    ...pastedUrls.map((url, i) => ({ url, category: "overview", sortOrder: uploadedImages.length + i })),
  ];

  const listing = await prisma.listing.create({
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
      imageLabel: imagesToCreate.length === 0 ? "Account overview" : null,
      tag,
      middleman,
      featured,
      troopsInfo,
      images: { create: imagesToCreate },
    },
  });

  redirect(`/browse/${listing.id}`);
}
