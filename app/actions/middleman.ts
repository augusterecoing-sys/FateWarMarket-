"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const SITE_URL = process.env.SITE_URL || "https://market-place-fw.vercel.app";

// L'acheteur clique "Oui" : on marque l'annonce (coche verte visible dans /admin/listings)
// et on prévient aussi par email si configuré, puis on l'envoie vers la page contact.
export async function requestMiddleman(formData: FormData) {
  const listingId = String(formData.get("listingId") ?? "");
  const listingTitle = String(formData.get("listingTitle") ?? "");

  if (listingId) {
    try {
      await prisma.listing.update({ where: { id: listingId }, data: { middlemanRequested: true } });
    } catch {
      // On ne bloque jamais l'acheteur si la mise à jour échoue.
    }

    const apiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL;
    if (apiKey && notifyEmail) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Fate War Market <onboarding@resend.dev>",
            to: notifyEmail,
            subject: `Middleman request — ${listingTitle || "an account"}`,
            text: `A buyer requested a Middleman.\n\nListing: ${listingTitle || "(untitled)"}\nListing link: ${SITE_URL}/browse/${listingId}`,
          }),
        });
      } catch {
        // Idem : l'échec de l'email n'empêche jamais la redirection.
      }
    }
  }

  redirect("/contact");
}

// Depuis /admin/listings : marquer la demande comme traitée (retire la coche verte).
export async function dismissMiddlemanRequest(formData: FormData) {
  const listingId = String(formData.get("listingId") ?? "");
  if (!listingId) return;
  await prisma.listing.update({ where: { id: listingId }, data: { middlemanRequested: false } });
  redirect("/admin/listings");
}
