"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

export async function createListing(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const level = Number(formData.get("level") ?? 0);
  const sellerName = String(formData.get("sellerName") ?? "");
  const verified = formData.get("verified") === "on";
  const rating = formData.get("rating") ? Number(formData.get("rating")) : null;
  const statLine = String(formData.get("statLine") ?? "");
  const imageLabel = String(formData.get("imageLabel") ?? "");
  const tag = String(formData.get("tag") ?? "");
  const middleman = formData.get("middleman") === "on";
  const featured = formData.get("featured") === "on";

  // 1) Vraies photos uploadées depuis l'ordinateur
  const photoFiles = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const uploadedUrls: string[] = [];
  for (const file of photoFiles) {
    const blob = await put(`listings/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    uploadedUrls.push(blob.url);
  }

  // 2) Liens externes collés (optionnel, en complément)
  const imageUrlsRaw = String(formData.get("imageUrls") ?? "");
  const pastedUrls = imageUrlsRaw
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const allImageUrls = [...uploadedUrls, ...pastedUrls];

  await prisma.listing.create({
    data: {
      title,
      price,
      level,
      sellerName,
      verified,
      rating,
      statLine,
      imageLabel,
      tag,
      middleman,
      featured,
      images: {
        create: allImageUrls.map((url, i) => ({ url, sortOrder: i })),
      },
    },
  });

  redirect("/browse");
}
