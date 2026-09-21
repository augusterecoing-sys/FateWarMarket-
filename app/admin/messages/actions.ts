"use server";

import { revalidatePath } from "next/cache";
import { sendAdminMessage as sendAdminMessageDb, markReadByAdmin } from "@/lib/messaging";

export async function sendAdminMessage(formData: FormData) {
  const conversationId = String(formData.get("conversationId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!conversationId || !body) return;

  await sendAdminMessageDb(conversationId, body);
  revalidatePath(`/admin/messages/${conversationId}`);
  revalidatePath("/admin/messages");
}

export async function markConversationReadByAdmin(conversationId: string) {
  await markReadByAdmin(conversationId);
  revalidatePath("/admin/messages");
}
