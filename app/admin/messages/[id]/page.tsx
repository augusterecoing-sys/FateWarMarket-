import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MarkAsRead from "@/components/MarkAsRead";
import DeleteConversationButton from "@/components/DeleteConversationButton";
import AdminReplyForm from "../AdminReplyForm";
import { markConversationReadByAdmin, deleteConversation } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminConversation({ params }: { params: { id: string } }) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: "asc" }, include: { listing: { select: { id: true, title: true } } } } },
  });

  if (!conversation) return notFound();

  return (
    <main style={{ minHeight: "100vh", background: "#14110D", color: "#F3E9DA", fontFamily: "'Manrope',sans-serif" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 80px" }}>
        <MarkAsRead action={markConversationReadByAdmin} conversationId={conversation.id} />

        <a href="/admin/messages" style={{ fontSize: 13, color: "#9C9186", textDecoration: "none" }}>← Toutes les conversations</a>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0 24px", flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 22, fontWeight: 700, margin: 0 }}>
            {conversation.buyerDiscord}
          </h1>
          <DeleteConversationButton action={deleteConversation} conversationId={conversation.id} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {conversation.messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === "admin" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                background: m.sender === "admin" ? "#E2622B" : "#1D1812",
                color: m.sender === "admin" ? "#14110D" : "#F3E9DA",
                border: m.sender === "admin" ? "none" : "1px solid rgba(243,233,218,0.1)",
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 14,
              }}
            >
              {m.listing && (
                <a
                  href={`/browse/${m.listing.id}`}
                  target="_blank"
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    opacity: 0.85,
                    marginBottom: 4,
                    color: m.sender === "admin" ? "#14110D" : "#E2622B",
                    textDecoration: "underline",
                  }}
                >
                  À propos de : {m.listing.title} ↗
                </a>
              )}
              {m.imageUrl && (
                <a href={m.imageUrl} target="_blank" style={{ display: "block", marginBottom: m.body ? 8 : 0 }}>
                  <img
                    src={m.imageUrl}
                    alt="Capture jointe"
                    style={{ display: "block", maxWidth: "100%", maxHeight: 420, width: "auto", height: "auto", borderRadius: 8, objectFit: "contain" }}
                  />
                </a>
              )}
              {m.body && <div style={{ whiteSpace: "pre-wrap" }}>{m.body}</div>}
            </div>
          ))}
        </div>

        <AdminReplyForm conversationId={conversation.id} />
      </div>
    </main>
  );
}
