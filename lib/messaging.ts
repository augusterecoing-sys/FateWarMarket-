import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "buyer_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an

// Le cookie est httpOnly : le token n'est jamais lisible ni manipulable en JS
// côté navigateur. C'est lui — pas le pseudo Discord — qui garantit qu'un
// acheteur ne peut voir que son propre fil.
export function getBuyerToken(): string | null {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}

function setBuyerToken(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function getConversationForBuyer() {
  const token = getBuyerToken();
  if (!token) return null;
  return prisma.conversation.findUnique({
    where: { token },
    include: { messages: { orderBy: { createdAt: "asc" }, include: { listing: { select: { title: true } } } } },
  });
}

export async function startConversation(buyerDiscord: string, firstMessage: string, listingId?: string) {
  const token = randomUUID();
  const conversation = await prisma.conversation.create({
    data: {
      token,
      buyerDiscord,
      messages: {
        create: { sender: "buyer", body: firstMessage, listingId: listingId || undefined },
      },
    },
  });
  setBuyerToken(token);
  return conversation;
}

export async function sendBuyerMessage(body: string, listingId?: string) {
  const token = getBuyerToken();
  if (!token) throw new Error("Aucune conversation active pour ce navigateur.");
  const conversation = await prisma.conversation.findUnique({ where: { token } });
  if (!conversation) throw new Error("Conversation introuvable.");

  await prisma.message.create({
    data: { conversationId: conversation.id, sender: "buyer", body, listingId: listingId || undefined },
  });
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date(), unreadByAdmin: true },
  });
}

export async function sendAdminMessage(conversationId: string, body: string) {
  await prisma.message.create({
    data: { conversationId, sender: "admin", body },
  });
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date(), unreadByBuyer: true },
  });
}

export async function markReadByBuyer(conversationId: string) {
  await prisma.conversation.update({ where: { id: conversationId }, data: { unreadByBuyer: false } });
}

export async function markReadByAdmin(conversationId: string) {
  await prisma.conversation.update({ where: { id: conversationId }, data: { unreadByAdmin: false } });
}
