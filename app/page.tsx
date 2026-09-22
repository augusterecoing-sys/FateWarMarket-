import { prisma } from "@/lib/prisma";
import AccountCard from "@/components/AccountCard";
import RecentlySold from "@/components/RecentlySold";

export const dynamic = "force-dynamic";

const navLink: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" };

export default async function Home() {
  const featured = await prisma.listing.findMany({
    where: { status: "active" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 3,
    include: { images: { orderBy: { sortOrder: "asc" }, take: 6 } },
  });

  return (
    <main>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 5%", borderBottom: "1px solid rgba(243,233,218,0.08)", flexWrap: "wrap", rowGap: 12 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#E2622B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: "#14110D" }}>F</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17 }}>Fate War Market</div>
        </a>
        <nav style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href="/browse" style={navLink}>Browse Accounts</a>
          <a href="/sell" style={navLink}>Sell an Account</a>
          <a href="/middleman" style={navLink}>Middleman</a>
        <a href="/messages" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Messages</a>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ padding: "clamp(48px, 9vw, 80px) 5%", maxWidth: 700, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
        <div style={{ color: "#C9A227", fontSize: 13, fontWeight: 600 }}>Fate War account marketplace</div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(27px, 6.5vw, 40px)", fontWeight: 700, lineHeight: 1.15, margin: 0 }}>
          Buy and sell Fate War accounts with proof, not promises.
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "#9C9186", margin: 0 }}>
          Real screenshots, real seller history, real account stats — before you offer a dollar.
        </p>
        <a href="/browse" style={{ background: "#E2622B", color: "#14110D", fontSize: 15, fontWeight: 700, padding: "14px 28px", borderRadius: 9, textDecoration: "none" }}>
          Browse Accounts
        </a>
      </section>

      {/* Why this marketplace */}
      <section style={{ padding: "0 5% 60px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 14 }}>
          Every account, in one place
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#D8CFC2", margin: 0 }}>
          Players have been selling their Fate War accounts on Discord for years — scattered across servers, hard to compare, easy to get scammed on. This marketplace brings those listings together in one spot: real screenshots, real seller history, and prices you can actually compare side by side before you buy.
        </p>
      </section>

      {/* Browse by price */}
      <section style={{ padding: "0 5% 60px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 18px" }}>Browse by budget</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 14 }}>
          <a href="/browse?band=under100" style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: "18px 14px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Under $100</a>
          <a href="/browse?band=100-250" style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: "18px 14px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>$100 – $250</a>
          <a href="/browse?band=250-500" style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: "18px 14px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>$250 – $500</a>
          <a href="/browse?band=500-1000" style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: "18px 14px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>$500 – $1,000</a>
          <a href="/browse?band=1000plus" style={{ background: "#1D1812", border: "1px solid rgba(201,162,39,0.35)", borderRadius: 10, padding: "18px 14px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#C9A227", textDecoration: "none" }}>$1,000+</a>
        </div>
      </section>

      {/* Browse by account type */}
      <section style={{ padding: "0 5% 60px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 18px" }}>Browse by account type</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 14 }}>
          <a href="/browse?type=cavalry" style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: "18px 14px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Cavalry</a>
          <a href="/browse?type=berserker" style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: "18px 14px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Berserker</a>
          <a href="/browse?type=archers" style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: "18px 14px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Archers</a>
        </div>
      </section>

      {/* Recently sold (vitrine SOLD, masquée s'il n'y en a aucun) */}
      <section style={{ padding: "0 5% 20px", maxWidth: 1200, margin: "0 auto" }}>
        <RecentlySold take={3} />
      </section>

      {/* Featured */}
      <section style={{ padding: "16px 5% 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Recent accounts</h2>
          <a href="/browse" style={{ fontSize: 14, fontWeight: 600, color: "#9C9186", textDecoration: "none" }}>View all →</a>
        </div>

        {featured.length === 0 ? (
          <p style={{ color: "#9C9186" }}>No accounts listed yet — check back soon.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {featured.map((item) => (
              <a key={item.id} href={`/browse/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <AccountCard
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
                  featured={item.featured}
                  images={item.images.map((img) => img.url)}
                  imageLabel={item.imageLabel}
                />
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 5%", borderTop: "1px solid rgba(243,233,218,0.08)", textAlign: "center", fontSize: 12.5, color: "#6E655B" }}>
        Fate War Market — an independent marketplace, not affiliated with the makers of Fate War.
      </footer>
    </main>
  );
}
