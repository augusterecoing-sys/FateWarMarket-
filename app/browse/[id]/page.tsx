import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import ContactSellerButton from "@/components/ContactSellerButton";
import { accountTypeLabel } from "@/lib/accountTypes";
import { getConversationForBuyer } from "@/lib/messaging";

export const dynamic = "force-dynamic";

const TABS: { key: string; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "characters", label: "Characters / Heroes" },
  { key: "runes", label: "Runes" },
  { key: "equipment", label: "Equipment" },
  { key: "inventory", label: "Inventory / Bag" },
  { key: "skins", label: "Skins" },
  { key: "info", label: "Info & Troops" },
];

export default async function AccountDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!listing) return notFound();

  const existingConversation = await getConversationForBuyer();

  const activeTab = typeof searchParams.tab === "string" && TABS.some((t) => t.key === searchParams.tab)
    ? searchParams.tab
    : "overview";

  const imagesForTab = listing.images.filter((img) => img.category === activeTab);
  const isSold = listing.status === "sold";

  return (
    <main>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 5%", borderBottom: "1px solid rgba(243,233,218,0.08)", flexWrap: "wrap", rowGap: 12 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#E2622B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: "#14110D" }}>F</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17 }}>Fate War Market</div>
        </a>
        <nav style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href="/browse" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Browse Accounts</a>
          <a href="/sell" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Sell an Account</a>
          <a href="/middleman" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Middleman</a>
        <a href="/messages" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Messages</a>
        </nav>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 5% 80px" }}>
        {isSold && (
          <div
            style={{
              background: "#D9372B",
              color: "#FFFFFF",
              textAlign: "center",
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 5,
              padding: "12px 0",
              borderRadius: 10,
              marginBottom: 28,
            }}
          >
            SOLD
          </div>
        )}
        {/* Header info */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            {listing.accountOfWeek && !isSold && (
              <div style={{ display: "inline-block", background: "linear-gradient(135deg,#F0793B 0%,#E2622B 100%)", color: "#14110D", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 5, marginBottom: 10, marginRight: 8 }}>
                🔥 Account of the week
              </div>
            )}
            {listing.tag && (
              <div style={{ display: "inline-block", background: "#C9A227", color: "#1A1208", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5, marginBottom: 10 }}>
                {listing.tag}
              </div>
            )}
            <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>{listing.title}</h1>
            {accountTypeLabel(listing.accountType) && (
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(226,98,43,0.12)",
                  color: "#E2622B",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              >
                {accountTypeLabel(listing.accountType)}
              </div>
            )}
            <div style={{ fontSize: 14, color: "#9C9186" }}>
              {listing.sellerName}{listing.verified ? " ✓ Verified" : ""}
              {listing.rating != null ? ` · ★ ${listing.rating}` : ""}
              {" · "}Lv. {listing.level}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 32, fontWeight: 700, color: isSold ? "#6E655B" : "#F0793B", textDecoration: isSold ? "line-through" : "none" }}>${listing.price}</div>
            {isSold ? (
              <div style={{ fontSize: 14, fontWeight: 700, color: "#D9372B", marginTop: 6 }}>This account has been sold.</div>
            ) : (
            <ContactSellerButton
              listingId={listing.id}
              listingTitle={listing.title}
              listingPrice={listing.price}
              middlemanAvailable={listing.middleman}
              existingBuyerDiscord={existingConversation?.buyerDiscord}
            />
            )}
            {!isSold && listing.middleman && (
              <div style={{ fontSize: 12.5, color: "#C9A227", marginTop: 8 }}>Middleman available for this account</div>
            )}
          </div>
        </div>

        <p style={{ fontSize: 14.5, color: "#D8CFC2", lineHeight: 1.6, marginBottom: 32 }}>{listing.statLine}</p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", borderBottom: "1px solid rgba(243,233,218,0.1)", marginBottom: 28 }}>
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <a
                key={tab.key}
                href={`/browse/${listing.id}?tab=${tab.key}`}
                style={{
                  padding: "10px 14px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: isActive ? "#E2622B" : "#9C9186",
                  borderBottom: isActive ? "2px solid #E2622B" : "2px solid transparent",
                  textDecoration: "none",
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </a>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "info" ? (
          <div style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.1)", borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9C9186", marginBottom: 10 }}>Troops & additional info</div>
            <p style={{ fontSize: 14.5, color: "#F3E9DA", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>
              {listing.troopsInfo || "No additional info provided for this account."}
            </p>
          </div>
        ) : imagesForTab.length === 0 ? (
          <div style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.1)", borderRadius: 12, padding: 40, textAlign: "center", color: "#6E655B", fontSize: 13.5 }}>
            No screenshots in this category yet.
          </div>
        ) : (
          <ImageGallery images={imagesForTab} title={listing.title} />
        )}
      </div>
    </main>
  );
}
