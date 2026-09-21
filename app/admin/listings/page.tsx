import { prisma } from "@/lib/prisma";
import { deleteListing } from "./actions";
import { dismissMiddlemanRequest } from "@/app/actions/middleman";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, { text: string; color: string; bg: string }> = {
  active: { text: "En ligne", color: "#8FD19E", bg: "rgba(143,209,158,0.12)" },
  sold: { text: "Vendu", color: "#C9A227", bg: "rgba(201,162,39,0.12)" },
  removed: { text: "Retiré", color: "#9C9186", bg: "rgba(156,145,134,0.12)" },
};

export default async function AdminListings() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return (
    <main style={{ minHeight: "100vh", background: "#14110D", color: "#F3E9DA", fontFamily: "'Manrope',sans-serif" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 24, fontWeight: 700, margin: 0 }}>Tes annonces</h1>
          <a
            href="/admin/new"
            style={{ background: "#E2622B", color: "#14110D", fontSize: 13.5, fontWeight: 700, padding: "9px 16px", borderRadius: 8, textDecoration: "none" }}
          >
            + Ajouter une annonce
          </a>
        </div>
        <p style={{ fontSize: 13.5, color: "#9C9186", marginBottom: 28 }}>
          {listings.length} annonce{listings.length === 1 ? "" : "s"} au total. Clique "Supprimer" pour retirer une annonce définitivement (les photos associées sont aussi effacées).
        </p>

        {listings.length === 0 && (
          <div style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 12, padding: 30, textAlign: "center", color: "#9C9186", fontSize: 14 }}>
            Aucune annonce pour le moment.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {listings.map((item) => {
            const status = statusLabel[item.status] ?? statusLabel.active;
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "#1D1812",
                  border: "1px solid rgba(243,233,218,0.09)",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#221B14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0].url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 10, color: "#6E655B" }}>Pas de photo</span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: status.color, background: status.bg, padding: "2px 8px", borderRadius: 5, flexShrink: 0 }}>
                      {status.text}
                    </span>
                    {item.middlemanRequested && (
                      <span
                        title="Un acheteur a demandé un intermédiaire"
                        style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#8FD19E", background: "rgba(143,209,158,0.14)", padding: "2px 8px", borderRadius: 5, flexShrink: 0 }}
                      >
                        ✓ Middleman demandé
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "#9C9186" }}>
                    {item.sellerName} · Lv. {item.level}
                    {item.sellerDiscord && (
                      <span style={{ color: "#C9A227" }}> · Discord : {item.sellerDiscord}</span>
                    )}
                    {item.sellerEmail && (
                      <span style={{ color: "#C9A227" }}> · Email : {item.sellerEmail}</span>
                    )}
                    {item.sellerPhone && (
                      <span style={{ color: "#C9A227" }}> · Tél : {item.sellerPhone}</span>
                    )}
                  </div>
                </div>

                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 18, fontWeight: 700, color: "#F0793B", flexShrink: 0, minWidth: 70, textAlign: "right" }}>
                  ${item.price}
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {item.middlemanRequested && (
                    <form action={dismissMiddlemanRequest}>
                      <input type="hidden" name="listingId" value={item.id} />
                      <button
                        type="submit"
                        title="Marquer comme traité"
                        style={{ fontSize: 13, fontWeight: 600, padding: "8px 14px", border: "1px solid rgba(143,209,158,0.4)", borderRadius: 7, background: "none", color: "#8FD19E", cursor: "pointer" }}
                      >
                        ✓ Traité
                      </button>
                    </form>
                  )}
                  <a
                    href={`/browse/${item.id}`}
                    style={{ fontSize: 13, fontWeight: 600, padding: "8px 14px", border: "1px solid rgba(243,233,218,0.18)", borderRadius: 7, textDecoration: "none", color: "#F3E9DA" }}
                  >
                    Voir
                  </a>
                  <a
                    href={`/admin/listings/${item.id}/edit`}
                    style={{ fontSize: 13, fontWeight: 600, padding: "8px 14px", border: "1px solid rgba(201,162,39,0.4)", borderRadius: 7, textDecoration: "none", color: "#C9A227" }}
                  >
                    Modifier
                  </a>
                  <form action={deleteListing}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      style={{ fontSize: 13, fontWeight: 700, padding: "8px 14px", border: "none", borderRadius: 7, background: "#8B2E20", color: "#F3E9DA", cursor: "pointer" }}
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
