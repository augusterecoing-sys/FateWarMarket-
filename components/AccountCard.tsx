type Props = {
  id: string;
  title: string;
  price: number;
  level: number;
  sellerName: string;
  verified: boolean;
  rating: number | null;
  statLine: string;
  tag: string | null;
  middleman: boolean;
  imageUrl?: string;
  imageLabel?: string | null;
};

export default function AccountCard({
  title,
  price,
  level,
  sellerName,
  verified,
  rating,
  statLine,
  tag,
  middleman,
  imageUrl,
  imageLabel,
}: Props) {
  const initial = sellerName.charAt(0).toUpperCase() || "?";

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
          background: "linear-gradient(150deg,#291F16 0%,#1D1812 60%,#181310 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, fontWeight: 600, color: "#6E655B" }}>
            [ {imageLabel || "No photo yet"} ]
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
              fontFamily: "'Manrope',sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "#1A1208",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, fontWeight: 600, color: "#F3E9DA" }}>
            {sellerName}
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
