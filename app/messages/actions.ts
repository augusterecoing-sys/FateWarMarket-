"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  startConversation as startConversationDb,
  sendBuyerMessage as sendBuyerMessageDb,
  getConversationForBuyer,
  markReadByBuyer,
} from "@/lib/messaging";

export async function startConversation(formData: FormData) {
  const buyerDiscord = String(formData.get("buyerDiscord") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const listingId = String(formData.get("listingId") ?? "").trim();

  if (!buyerDiscord || (!body && !imageUrl)) return;

  await startConversationDb(buyerDiscord, { body, imageUrl }, listingId || undefined);
  revalidatePath("/messages");
}

export async function sendBuyerMessage(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const listingId = String(formData.get("listingId") ?? "").trim();
  if (!body && !imageUrl) return;

  await sendBuyerMessageDb({ body, imageUrl }, listingId || undefined);
  revalidatePath("/messages");
}

// Utilisée depuis la fiche annonce : envoie une offre de prix, en démarrant
// une conversation si besoin (nouveau visiteur) ou en continuant celle déjà
// ouverte sur ce navigateur (pas besoin de redemander le pseudo Discord).
export async function sendOffer(formData: FormData) {
  const listingId = String(formData.get("listingId") ?? "").trim();
  const amount = parseFloat(String(formData.get("amount") ?? ""));
  const body = String(formData.get("body") ?? "").trim();
  const buyerDiscord = String(formData.get("buyerDiscord") ?? "").trim();

  if (!listingId || !amount || amount <= 0) return;

  const existing = await getConversationForBuyer();

  if (existing) {
    await sendBuyerMessageDb({ body, offerAmount: amount }, listingId);
  } else {
    if (!buyerDiscord) return;
    await startConversationDb(buyerDiscord, { body, offerAmount: amount }, listingId);
  }

  revalidatePath("/messages");
  redirect(`/messages?listingId=${listingId}`);
}

export async function markConversationReadByBuyer(conversationId: string) {
  await markReadByBuyer(conversationId);
}
