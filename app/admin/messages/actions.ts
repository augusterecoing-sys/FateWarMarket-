"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendAdminMessage as sendAdminMessageDb, markReadByAdmin, respondToOffer as respondToOfferDb } from "@/lib/messaging";

export async function sendAdminMessage(formData: FormData) {
  const conversationId = String(formData.get("conversationId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  if (!conversationId || (!body && !imageUrl)) return;

  await sendAdminMessageDb(conversationId, { body, imageUrl });
  revalidatePath(`/admin/messages/${conversationId}`);
  revalidatePath("/admin/messages");
}

export async function markConversationReadByAdmin(conversationId: string) {
  await markReadByAdmin(conversationId);
  revalidatePath("/admin/messages");
}

export async function deleteConversation(formData: FormData) {
  const conversationId = String(formData.get("conversationId") ?? "");
  if (!conversationId) return;

  await prisma.conversation.delete({ where: { id: conversationId } }); // supprime aussi les messages liés (cascade)
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

export async function respondToOffer(formData: FormData) {
  const messageId = String(formData.get("messageId") ?? "");
  const conversationId = String(formData.get("conversationId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!messageId || (status !== "accepted" && status !== "declined")) return;

  await respondToOfferDb(messageId, status);
  revalidatePath(`/admin/messages/${conversationId}`);
  revalidatePath("/admin/messages");
}
