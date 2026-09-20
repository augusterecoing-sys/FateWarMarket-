"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

const CATEGORY_FIELDS: { field: string; category: string }[] = [
  { field: "photos_overview", category: "overview" },
  { field: "photos_characters", category: "characters" },
  { field: "photos_runes", category: "runes" },
  { field: "photos_equipment", category: "equipment" },
  { field: "photos_inventory", category: "inventory" },
  { field: "photos_skins", category: "skins" },
];

export async function createListing(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const level = Number(formData.get("level") ?? 0);
  const sellerName = String(formData.get("sellerName") ?? "");
  const verified = formData.get("verified") === "on";
  const rating = formData.get("rating") ? Number(formData.get("rating")) : null;
  const statLine = String(formData.get("statLine") ?? "");
  const tag = String(formData.get("tag") ?? "");
  const middleman = formData.get("middleman") === "on";
  const featured = formData.get("featured") === "on";
  const troopsInfo = String(formData.get("troopsInfo") ?? "");

  type ImageInput = { url: string; category: string; sortOrder: number };
  const imagesToCreate: ImageInput[] = [];
  let order = 0;

  for (const { field, category } of CATEGORY_FIELDS) {
    const files = formData
      .getAll(field)
      .filter((f): f is File => f instanceof File && f.size > 0);
    for (const file of files) {
      const blob = await put(`listings/${category}/${Date.now()}-${file.name}`, file, {
        access: "public",
      });
      imagesToCreate.push({ url: blob.url, category, sortOrder: order++ });
    }
  }

  const imageUrlsRaw = String(formData.get("imageUrls") ?? "");
  const pastedUrls = imageUrlsRaw
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
  for (const url of pastedUrls) {
    imagesToCreate.push({ url, category: "overview", sortOrder: order++ });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      price,
      level,
      sellerName,
      verified,
      rating,
      statLine,
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
