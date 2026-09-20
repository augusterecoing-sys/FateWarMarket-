import { prisma } from "@/lib/prisma";
import AccountCard from "@/components/AccountCard";

export const dynamic = "force-dynamic";

export default async function Browse() {
  const listings = await prisma.listing.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return (
    <main>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 5%", borderBottom: "1px solid rgba(243,233,218,0.08)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#E2622B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: "#14110D" }}>F</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17 }}>Fate War Market</div>
        </a>
        <nav>
          <a href="/browse" style={{ fontSize: 14, fontWeight: 700, color: "#E2622B", textDecoration: "none" }}>Browse Accounts</a>
        </nav>
      </header>

      <div style={{ padding: "40px 5% 0", maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Browse accounts</h1>
        <div style={{ fontSize: 14, color: "#9C9186", marginBottom: 28 }}>{listings.length} account(s) listed</div>
      </div>

      <div style={{ padding: "0 5% 80px", maxWidth: 1200, margin: "0 auto" }}>
        {listings.length === 0 ? (
          <p style={{ color: "#9C9186" }}>No accounts yet — check back soon.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {listings.map((item) => (
              <AccountCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                level={item.level}
                sellerName={item.sellerName}
                verified={item.verified}
                rating={item.rating}
                statLine={item.statLine}
                tag={item.tag}
                middleman={item.middleman}
                imageUrl={item.images[0]?.url}
                imageLabel={item.imageLabel}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
