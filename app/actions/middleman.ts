"use server";

import { redirect } from "next/navigation";

const SITE_URL = process.env.SITE_URL || "https://market-place-fw.vercel.app";

export async function requestMiddleman(formData: FormData) {
  const buyerDiscord = String(formData.get("buyerDiscord") ?? "").trim();
  const listingId = String(formData.get("listingId") ?? "");
  const listingTitle = String(formData.get("listingTitle") ?? "");

  if (!buyerDiscord) {
    throw new Error("Please enter your Discord username.");
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (apiKey && notifyEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Fate War Market <onboarding@resend.dev>",
          to: notifyEmail,
          subject: `Middleman request — ${listingTitle || "an account"}`,
          text: [
            "A buyer requested a Middleman.",
            "",
            `Listing: ${listingTitle || "(untitled)"}`,
            `Listing link: ${SITE_URL}/browse/${listingId}`,
            `Buyer's Discord: ${buyerDiscord}`,
          ].join("\n"),
        }),
      });
    } catch {
      // On n'empêche jamais l'acheteur de continuer même si l'envoi du mail échoue.
    }
  }

  redirect("/contact");
}
