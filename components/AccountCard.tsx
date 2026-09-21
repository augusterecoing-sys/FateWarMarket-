import { accountTypeLabel, accountTypeIcon } from "@/lib/accountTypes";

type Props = {
  id: string;
  title: string;
  price: number;
  level: number;
  sellerName: string;
  accountType?: string | null;
  verified: boolean;
  rating: number | null;
  statLine: string;
  tag: string | null;
  middleman: boolean;
  imageUrl?: string;
  images?: string[];
  imageLabel?: string | null;
};

export default function AccountCard({
  title,
  price,
  level,
  sellerName,
  accountType,
  verified,
  rating,
  statLine,
  tag,
  middleman,
  imageUrl,
  images,
  imageLabel,
}: Props) {
  const typeLabel = accountTypeLabel(accountType);
  const gallery = images && images.length > 0 ? images.slice(0, 9) : imageUrl ? [imageUrl] : [];

  return (
    <div
      style={{
        display: "block",
        width: "100%",
        borderRadius: 14,
        overflow: "hidden",
        background: "#1D1812",
        border: "1px solid rgba(243,233,218,0.10)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 184,
          background: "#181310",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        {gallery.length > 0 ? (
          Array.from({ length: 9 }).map((_, i) => {
            const src = gallery[i];
            return src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`${title} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div key={i} style={{ width: "100%", height: "100%", background: "linear-gradient(150deg,#241B14 0%,#1D1812 100%)" }} />
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", gridRow: "1 / -1", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(150deg,#291F16 0%,#1D1812 60%,#181310 100%)" }}>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, fontWeight: 600, color: "#6E655B" }}>
              [ {imageLabel || "No photo yet"} ]
            </div>
          </div>
        )}
        {tag && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "#C9A227",
              color: "#1A1208",
              fontFamily: "'Manrope',sans-serif",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 9px",
              borderRadius: 5,
            }}
          >
            {tag}
          </div>
        )}
        {middleman && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              background: "rgba(20,17,13,0.82)",
              color: "#C9A227",
              fontFamily: "'Manrope',sans-serif",
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 9px",
              borderRadius: 5,
              border: "1px solid rgba(201,162,39,0.35)",
            }}
          >
            Middleman available
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(20,17,13,0.82)",
            color: "#F3E9DA",
            fontFamily: "'Manrope',sans-serif",
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 5,
          }}
        >
          Lv. {level}
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#E2622B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {accountTypeIcon(accountType)}
          </div>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, fontWeight: 600, color: "#F3E9DA" }}>
            {typeLabel || "Account"}
          </div>
          {verified && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
          {rating != null && (
            <div style={{ marginLeft: "auto", fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "#9C9186" }}>
              ★ {rating}
            </div>
          )}
        </div>
        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "#9C9186", lineHeight: 1.5 }}>
          {statLine}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            paddingTop: 4,
            borderTop: "1px solid rgba(243,233,218,0.08)",
          }}
        >
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 22, fontWeight: 700, color: "#F0793B" }}>
            ${price}
          </div>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 600, color: "#F3E9DA" }}>
            View account →
          </div>
        </div>
      </div>
    </div>
  );
}
