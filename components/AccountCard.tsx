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
  featured?: boolean;
  imageUrl?: string;
  images?: string[];
  imageLabel?: string | null;
  sold?: boolean;
  accountOfWeek?: boolean;
};

export default function AccountCard({
  title,
  price,
  level,
  accountType,
  verified,
  rating,
  statLine,
  tag,
  middleman,
  featured,
  imageUrl,
  images,
  imageLabel,
  sold,
  accountOfWeek,
}: Props) {
  const isWeek = !!accountOfWeek && !sold;
  const typeLabel = accountTypeLabel(accountType);
  const gallery = images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];
  const cover = gallery[0];
  const extraCount = gallery.length - 1;

  return (
    <div
      style={{
        display: "block",
        width: "100%",
        borderRadius: 14,
        overflow: "hidden",
        background: "#1D1812",
        border: sold
          ? "2px solid #D9372B"
          : isWeek
          ? "2px solid #F0793B"
          : featured
          ? "1px solid rgba(201,162,39,0.55)"
          : "1px solid rgba(243,233,218,0.10)",
        boxShadow: sold
          ? "0 0 0 1px rgba(217,55,43,0.25), 0 8px 24px rgba(217,55,43,0.15)"
          : isWeek
          ? "0 0 0 1px rgba(240,121,59,0.25), 0 10px 30px rgba(240,121,59,0.22)"
          : featured
          ? "0 0 0 1px rgba(201,162,39,0.18), 0 8px 24px rgba(201,162,39,0.10)"
          : "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 184,
          background: "#181310",
          overflow: "hidden",
        }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: sold ? "grayscale(0.6) brightness(0.6)" : "none" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(150deg,#291F16 0%,#1D1812 60%,#181310 100%)" }}>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, fontWeight: 600, color: "#6E655B" }}>
              [ {imageLabel || "No photo yet"} ]
            </div>
          </div>
        )}

        {/* Dégradé en bas de l'image pour que les badges restent lisibles sans écraser la photo */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />


        {/* Liseré rouge SOLD (activé uniquement depuis l'admin) */}
        {sold && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-10%",
              width: "120%",
              transform: "translateY(-50%) rotate(-8deg)",
              background: "#D9372B",
              color: "#FFFFFF",
              textAlign: "center",
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 6,
              padding: "6px 0",
              borderTop: "2px solid rgba(255,255,255,0.35)",
              borderBottom: "2px solid rgba(255,255,255,0.35)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.45)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            SOLD
          </div>
        )}

        {isWeek ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 14,
              background: "linear-gradient(135deg,#F0793B 0%,#E2622B 100%)",
              color: "#14110D",
              fontFamily: "'Manrope',sans-serif",
              fontSize: 11,
              fontWeight: 800,
              padding: "5px 10px 6px",
              borderRadius: "0 0 7px 7px",
              boxShadow: "0 4px 12px rgba(226,98,43,0.4)",
              zIndex: 1,
            }}
          >
            🔥 Account of the week
          </div>
        ) : featured ? (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "#C9A227",
              color: "#1A1208",
              fontFamily: "'Manrope',sans-serif",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 9px",
              borderRadius: 5,
            }}
          >
            ⭐ Mis en avant
          </div>
        ) : (
          tag && (
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
          )
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

        {extraCount > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              background: "rgba(20,17,13,0.75)",
              color: "#F3E9DA",
              fontFamily: "'Manrope',sans-serif",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 5,
            }}
          >
            +{extraCount} photo{extraCount > 1 ? "s" : ""}
          </div>
        )}
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

        {middleman && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              alignSelf: "flex-start",
              background: "rgba(201,162,39,0.10)",
              color: "#C9A227",
              fontFamily: "'Manrope',sans-serif",
              fontSize: 11.5,
              fontWeight: 600,
              padding: "4px 9px",
              borderRadius: 5,
              border: "1px solid rgba(201,162,39,0.3)",
            }}
          >
            Intermédiaire disponible
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            paddingTop: 4,
            borderTop: "1px solid rgba(243,233,218,0.08)",
          }}
        >
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 22, fontWeight: 700, color: sold ? "#6E655B" : "#F0793B", textDecoration: sold ? "line-through" : "none" }}>
            ${price}
          </div>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 700, color: sold ? "#D9372B" : "#F3E9DA" }}>
            {sold ? "Sold" : "View account →"}
          </div>
        </div>
      </div>
    </div>
  );
}
