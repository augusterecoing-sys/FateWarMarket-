import { prisma } from "@/lib/prisma";
import AccountCard from "@/components/AccountCard";

// Vitrine des comptes vendus (preuve sociale), affichée au-dessus des comptes en vente.
// Un compte y apparaît dès que tu le passes en SOLD depuis l'admin.
export default async function RecentlySold({ take = 3, minCardWidth = 300 }: { take?: number; minCardWidth?: number }) {
  const sold = await prisma.listing.findMany({
    where: { status: "sold" },
    orderBy: { createdAt: "desc" },
    take,
    include: { images: { orderBy: { sortOrder: "asc" }, take: 6 } },
  });

  if (sold.length === 0) return null;

  const totalSold = await prisma.listing.count({ where: { status: "sold" } });

  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(217,55,43,0.10) 0%, rgba(217,55,43,0.02) 100%)",
        border: "1px solid rgba(217,55,43,0.35)",
        borderRadius: 14,
        padding: "20px 20px 22px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 20, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: "#D9372B", color: "#FFFFFF", fontSize: 12, fontWeight: 800, letterSpacing: 2, padding: "4px 9px", borderRadius: 5 }}>SOLD</span>
          Recently sold
        </h2>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#FF6B5E" }}>
          {totalSold} account{totalSold > 1 ? "s" : ""} sold on Fate War Market
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`, gap: 20 }}>
        {sold.map((item) => (
          <a key={item.id} href={`/browse/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <AccountCard
              id={item.id}
              title={item.title}
              price={item.price}
              level={item.level}
              sellerName={item.sellerName}
              accountType={item.accountType}
              verified={item.verified}
              rating={item.rating}
              statLine={item.statLine}
              tag={item.tag}
              middleman={item.middleman}
              featured={false}
              images={item.images.map((img) => img.url)}
              imageLabel={item.imageLabel}
              sold
            />
          </a>
        ))}
      </div>
    </div>
  );
}
