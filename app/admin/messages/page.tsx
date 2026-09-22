import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMessages() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { lastMessageAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1, include: { listing: { select: { id: true, title: true } } } } },
  });

  return (
    <main style={{ minHeight: "100vh", background: "#14110D", color: "#F3E9DA", fontFamily: "'Manrope',sans-serif" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 80px" }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          Messagerie
        </h1>
        <p style={{ fontSize: 13.5, color: "#9C9186", marginBottom: 28 }}>
          {conversations.length} conversation{conversations.length === 1 ? "" : "s"}.
        </p>

        {conversations.length === 0 && (
          <div style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 12, padding: 30, textAlign: "center", color: "#9C9186", fontSize: 14 }}>
            Aucun message pour le moment.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {conversations.map((c) => {
            const last = c.messages[0];
            return (
              <a
                key={c.id}
                href={`/admin/messages/${c.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  background: "#1D1812",
                  border: c.unreadByAdmin ? "1px solid #E2622B" : "1px solid rgba(243,233,218,0.09)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                    {c.buyerDiscord}
                    {c.unreadByAdmin && (
                      <span style={{ background: "#E2622B", color: "#14110D", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>
                        NOUVEAU
                      </span>
                    )}
                  </div>
                  {last && (
                    <>
                      {last.listing && (
                        <div style={{ fontSize: 11.5, color: "#E2622B", fontWeight: 700, marginBottom: 2 }}>
                          {last.listing.title}
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: last.offerAmount != null ? "#C9A227" : "#9C9186", fontWeight: last.offerAmount != null ? 700 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 480 }}>
                        {last.sender === "admin" ? "Toi : " : ""}
                        {last.offerAmount != null ? `💰 Offre : $${last.offerAmount}` : last.imageUrl && !last.body ? "📷 Photo" : last.body}
                      </div>
                    </>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#6E665C", flexShrink: 0 }}>
                  {new Date(c.lastMessageAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
