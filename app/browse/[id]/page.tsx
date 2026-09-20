import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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

  const activeTab = typeof searchParams.tab === "string" && TABS.some((t) => t.key === searchParams.tab)
    ? searchParams.tab
    : "overview";

  const imagesForTab = listing.images.filter((img) => img.category === activeTab);
  const discordInvite = process.env.DISCORD_INVITE_URL || "#";

  return (
    <main>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 5%", borderBottom: "1px solid rgba(243,233,218,0.08)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#E2622B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: "#14110D" }}>F</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17 }}>Fate War Market</div>
        </a>
        <nav style={{ display: "flex", gap: 28 }}>
          <a href="/browse" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Browse Accounts</a>
          <a href="/sell" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Sell an Account</a>
          <a href="/middleman" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Middleman</a>
        </nav>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 5% 80px" }}>
        {/* Header info */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            {listing.tag && (
              <div style={{ display: "inline-block", background: "#C9A227", color: "#1A1208", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5, marginBottom: 10 }}>
                {listing.tag}
              </div>
            )}
            <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>{listing.title}</h1>
            <div style={{ fontSize: 14, color: "#9C9186" }}>
              {listing.sellerName}{listing.verified ? " ✓ Verified" : ""}
              {listing.rating != null ? ` · ★ ${listing.rating}` : ""}
              {" · "}Lv. {listing.level}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 32, fontWeight: 700, color: "#F0793B" }}>${listing.price}</div>
            <a
              href={discordInvite}
              style={{ display: "inline-block", marginTop: 10, background: "#5865F2", color: "#fff", fontSize: 13.5, fontWeight: 700, padding: "10px 18px", borderRadius: 8, textDecoration: "none" }}
            >
              Contact seller on Discord
            </a>
            {listing.middleman && (
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {imagesForTab.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.url}
                alt={listing.title}
                style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(243,233,218,0.1)" }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
