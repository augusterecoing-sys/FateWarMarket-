"use server";

import { revalidatePath } from "next/cache";
import {
  startConversation as startConversationDb,
  sendBuyerMessage as sendBuyerMessageDb,
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

export async function markConversationReadByBuyer(conversationId: string) {
  await markReadByBuyer(conversationId);
}
