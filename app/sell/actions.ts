"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const REQUIRED_CATEGORIES = ["overview", "characters", "runes", "equipment"];

export async function createPublicListing(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const level = Number(formData.get("level") ?? 0);
  const sellerName = String(formData.get("sellerName") ?? "");
  const sellerDiscord = String(formData.get("sellerDiscord") ?? "");
  const statLine = String(formData.get("statLine") ?? "");
  const accountType = String(formData.get("accountType") ?? "");
  const middleman = formData.get("middleman") === "on";
  const troopsInfo = String(formData.get("troopsInfo") ?? "");

  if (!title || !sellerName || !sellerDiscord || !statLine || !price || !level) {
    throw new Error("Please fill in all required fields.");
  }
  if (!["archers", "berserker", "cavalry"].includes(accountType)) {
    throw new Error("Please confirm your account type.");
  }

  const uploadedImagesRaw = String(formData.get("uploadedImages") ?? "[]");
  let uploadedImages: { url: string; category: string }[] = [];
  try {
    uploadedImages = JSON.parse(uploadedImagesRaw);
  } catch {
    uploadedImages = [];
  }

  // Validation serveur : on ne fait jamais confiance uniquement au client.
  const presentCategories = new Set(uploadedImages.map((img) => img.category));
  const missing = REQUIRED_CATEGORIES.filter((c) => !presentCategories.has(c));
  if (missing.length > 0) {
    throw new Error(`Missing required photos for: ${missing.join(", ")}.`);
  }

  const imagesToCreate = uploadedImages.map((img, i) => ({ url: img.url, category: img.category, sortOrder: i }));

  // Champs éditoriaux (verified / featured / tag) réservés à l'admin : jamais pris depuis le formulaire public.
  const listing = await prisma.listing.create({
    data: {
      title,
      price,
      level,
      sellerName,
      sellerDiscord,
      accountType,
      verified: false,
      rating: null,
      statLine,
      tag: null,
      middleman,
      featured: false,
      status: "active",
      troopsInfo,
      images: { create: imagesToCreate },
    },
  });

  redirect(`/browse/${listing.id}`);
}
