import { prisma } from "@/lib/prisma";
import AccountCard from "@/components/AccountCard";
import AutoFilterForm from "@/components/AutoFilterForm";
import { ACCOUNT_TYPES } from "@/lib/accountTypes";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const BANDS: Record<string, { min?: number; max?: number; label: string }> = {
  under100: { max: 100, label: "Under $100" },
  "100-250": { min: 100, max: 250, label: "$100 – $250" },
  "250-500": { min: 250, max: 500, label: "$250 – $500" },
  "500-1000": { min: 500, max: 1000, label: "$500 – $1,000" },
  "1000plus": { min: 1000, label: "$1,000+" },
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function Browse({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const selectedBands = toArray(searchParams.band).filter((b) => BANDS[b]);
  const minParam = searchParams.min ? Number(searchParams.min) : undefined;
  const maxParam = searchParams.max ? Number(searchParams.max) : undefined;
  const verifiedOnly = searchParams.verified === "1";
  const middlemanOnly = searchParams.middleman === "1";
  const selectedTypes = toArray(searchParams.type).filter((t) => ACCOUNT_TYPES.some((at) => at.value === t));

  const andConditions: Prisma.ListingWhereInput[] = [];

  if (selectedBands.length > 0) {
    andConditions.push({
      OR: selectedBands.map((key) => {
        const band = BANDS[key];
        const range: Prisma.ListingWhereInput = {};
        if (band.min !== undefined) range.price = { ...(range.price as object), gte: band.min };
        if (band.max !== undefined) range.price = { ...(range.price as object), lte: band.max };
        return range;
      }),
    });
  } else if (minParam !== undefined || maxParam !== undefined) {
    const priceFilter: Prisma.IntFilter = {};
    if (minParam !== undefined) priceFilter.gte = minParam;
    if (maxParam !== undefined) priceFilter.lte = maxParam;
    andConditions.push({ price: priceFilter });
  }

  if (selectedTypes.length > 0) {
    andConditions.push({ OR: selectedTypes.map((t) => ({ accountType: t })) });
  }

  if (verifiedOnly) andConditions.push({ verified: true });
  if (middlemanOnly) andConditions.push({ middleman: true });

  const where: Prisma.ListingWhereInput = {
    status: { in: ["active", "sold"] },
    ...(andConditions.length > 0 ? { AND: andConditions } : {}),
  };

  const listings = await prisma.listing.findMany({
    where,
    orderBy: [{ status: "desc" }, { accountOfWeek: "desc" }, { featured: "desc" }, { createdAt: "desc" }], // SOLD > compte de la semaine > mis en avant > classiques ("sold" > "active" en ordre alpha)
    include: { images: { orderBy: { sortOrder: "asc" }, take: 6 } },
  });

  const isBandChecked = (key: string) => selectedBands.includes(key);
  const isTypeChecked = (key: string) => selectedTypes.includes(key);

  return (
    <main>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 5%", borderBottom: "1px solid rgba(243,233,218,0.08)", flexWrap: "wrap", rowGap: 12 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#E2622B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: "#14110D" }}>F</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17 }}>Fate War Market</div>
        </a>
        <nav style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href="/browse" style={{ fontSize: 14, fontWeight: 700, color: "#E2622B", textDecoration: "none" }}>Browse Accounts</a>
          <a href="/sell" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Sell an Account</a>
          <a href="/middleman" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Middleman</a>
        <a href="/messages" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Messages</a>
        </nav>
      </header>

      <div style={{ padding: "40px 5% 0", maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Browse accounts</h1>
        <div style={{ fontSize: 14, color: "#9C9186", marginBottom: 28 }}>{listings.length} account(s) listed</div>
      </div>

      <div className="browse-layout" style={{ padding: "0 5% 80px", maxWidth: 1200, margin: "0 auto" }}>
        <AutoFilterForm
          className="browse-sidebar"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            background: "#1A1510",
            border: "1px solid rgba(243,233,218,0.08)",
            borderRadius: 12,
            padding: 22,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F3E9DA" }}>Price range</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                name="min"
                defaultValue={minParam ?? ""}
                placeholder="Min"
                style={{ width: "100%", background: "#221B14", border: "1px solid rgba(243,233,218,0.14)", color: "#F3E9DA", borderRadius: 7, padding: "8px 10px", fontSize: 13 }}
              />
              <input
                type="number"
                name="max"
                defaultValue={maxParam ?? ""}
                placeholder="Max"
                style={{ width: "100%", background: "#221B14", border: "1px solid rgba(243,233,218,0.14)", color: "#F3E9DA", borderRadius: 7, padding: "8px 10px", fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 18, borderTop: "1px solid rgba(243,233,218,0.08)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F3E9DA", marginBottom: 2 }}>Quick price bands</div>
            {Object.entries(BANDS).map(([key, band]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "#D8CFC2" }}>
                <input type="checkbox" name="band" value={key} defaultChecked={isBandChecked(key)} />
                {band.label}
              </label>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 18, borderTop: "1px solid rgba(243,233,218,0.08)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F3E9DA", marginBottom: 2 }}>Account type</div>
            {ACCOUNT_TYPES.map((t) => (
              <label key={t.value} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "#D8CFC2" }}>
                <input type="checkbox" name="type" value={t.value} defaultChecked={isTypeChecked(t.value)} />
                {t.label}
              </label>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 18, borderTop: "1px solid rgba(243,233,218,0.08)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F3E9DA", marginBottom: 2 }}>Account characteristics</div>
            <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "#D8CFC2" }}>
              <input type="checkbox" name="verified" value="1" defaultChecked={verifiedOnly} />
              Verified sellers only
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "#D8CFC2" }}>
              <input type="checkbox" name="middleman" value="1" defaultChecked={middlemanOnly} />
              Middleman available
            </label>
          </div>

          {/* Bouton invisible : garde la touche Entrée fonctionnelle dans Min / Max */}
          <button type="submit" style={{ display: "none" }} aria-hidden="true" tabIndex={-1} />
          <a
            href="/browse"
            style={{ textAlign: "center", fontSize: 13, color: "#9C9186", textDecoration: "none" }}
          >
            Clear filters
          </a>
        </AutoFilterForm>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
          {listings.length === 0 ? (
            <p style={{ color: "#9C9186" }}>No accounts match these filters.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {listings.map((item) => (
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
                    featured={item.featured}
                    images={item.images.map((img) => img.url)}
                    imageLabel={item.imageLabel}
                    sold={item.status === "sold"}
                    accountOfWeek={item.accountOfWeek}
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
