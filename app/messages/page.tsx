import { prisma } from "@/lib/prisma";
import { getConversationForBuyer } from "@/lib/messaging";
import StartConversationForm from "./StartConversationForm";
import ReplyForm from "./ReplyForm";
import MarkAsRead from "@/components/MarkAsRead";
import OfferCard from "@/components/OfferCard";
import { markConversationReadByBuyer } from "./actions";

export const dynamic = "force-dynamic";

const navLink = { fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { listingId?: string };
}) {
  const conversation = await getConversationForBuyer();

  const lastMessageListingId = conversation?.messages.length
    ? [...conversation.messages].reverse().find((m) => m.listingId)?.listingId
    : undefined;

  const effectiveListingId = searchParams.listingId || lastMessageListingId || undefined;

  const listing = effectiveListingId
    ? await prisma.listing.findUnique({ where: { id: effectiveListingId }, select: { id: true, title: true } })
    : null;

  return (
    <main style={{ minHeight: "100vh", background: "#14110D", color: "#F3E9DA", fontFamily: "'Manrope',sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 5%", borderBottom: "1px solid rgba(243,233,218,0.08)", flexWrap: "wrap", rowGap: 12 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#E2622B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: "#14110D" }}>F</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17 }}>Fate War Market</div>
        </a>
        <nav style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href="/browse" style={navLink}>Browse Accounts</a>
          <a href="/sell" style={navLink}>Sell an Account</a>
          <a href="/middleman" style={navLink}>Middleman</a>
          <a href="/messages" style={{ ...navLink, color: "#E2622B", fontWeight: 700 }}>Messages</a>
        </nav>
      </header>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 5% 80px" }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          Messagerie
        </h1>

        {!conversation && (
          <>
            <p style={{ fontSize: 13.5, color: "#9C9186", marginBottom: 24 }}>
              Une question sur une annonce, un vendeur, ou le fonctionnement du site ? Écris ici — c'est privé, seul le vendeur voit ta conversation.
            </p>
            <StartConversationForm listingId={listing?.id} listingTitle={listing?.title} />
          </>
        )}

        {conversation && (
          <>
            <MarkAsRead action={markConversationReadByBuyer} conversationId={conversation.id} />
            <p style={{ fontSize: 13, color: "#9C9186", marginBottom: 24 }}>
              Fil ouvert sous le pseudo <span style={{ color: "#F3E9DA", fontWeight: 700 }}>{conversation.buyerDiscord}</span>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {conversation.messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === "buyer" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    background: m.sender === "buyer" ? "#E2622B" : "#1D1812",
                    color: m.sender === "buyer" ? "#14110D" : "#F3E9DA",
                    border: m.sender === "buyer" ? "none" : "1px solid rgba(243,233,218,0.1)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontSize: 14,
                  }}
                >
                  {m.listing && (
                    <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>À propos de : {m.listing.title}</div>
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
                  {m.offerAmount != null && (
                    <OfferCard
                      amount={m.offerAmount}
                      status={m.offerStatus}
                      messageId={m.id}
                      conversationId={conversation.id}
                      onBubble={m.sender === "buyer" ? "#14110D" : "#F3E9DA"}
                    />
                  )}
                  {m.body && <div style={{ whiteSpace: "pre-wrap" }}>{m.body}</div>}
                </div>
              ))}
            </div>

            <ReplyForm listingId={listing?.id} />
          </>
        )}
      </div>
    </main>
  );
}
