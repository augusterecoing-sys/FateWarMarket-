const statusStyle: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "#C9A227" },
  accepted: { label: "Acceptée", color: "#4CAF6D" },
  declined: { label: "Refusée", color: "#C9695A" },
};

export default function OfferCard({
  amount,
  status,
  messageId,
  conversationId,
  onBubble,
  respondAction,
}: {
  amount: number;
  status: string | null;
  messageId: string;
  conversationId: string;
  onBubble: string; // couleur du texte parent, pour contraste (utilisé sur fond orange admin par ex.)
  respondAction?: (formData: FormData) => void; // fourni uniquement côté admin, pour une offre en attente
}) {
  const s = statusStyle[status || "pending"];

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.18)",
        border: `1px solid ${s.color}55`,
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: onBubble }}>💰 Offre : ${amount}</div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: s.color, background: "rgba(0,0,0,0.25)", padding: "3px 8px", borderRadius: 20 }}>
          {s.label}
        </div>
      </div>

      {respondAction && (status === "pending" || !status) && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <form action={respondAction} style={{ flex: 1 }}>
            <input type="hidden" name="messageId" value={messageId} />
            <input type="hidden" name="conversationId" value={conversationId} />
            <input type="hidden" name="status" value="accepted" />
            <button
              type="submit"
              style={{ width: "100%", background: "#4CAF6D", color: "#0E1B12", fontSize: 12.5, fontWeight: 700, padding: "7px 0", borderRadius: 6, border: "none", cursor: "pointer" }}
            >
              Accepter
            </button>
          </form>
          <form action={respondAction} style={{ flex: 1 }}>
            <input type="hidden" name="messageId" value={messageId} />
            <input type="hidden" name="conversationId" value={conversationId} />
            <input type="hidden" name="status" value="declined" />
            <button
              type="submit"
              style={{ width: "100%", background: "none", color: onBubble, fontSize: 12.5, fontWeight: 700, padding: "7px 0", borderRadius: 6, border: `1px solid ${onBubble}55`, cursor: "pointer" }}
            >
              Refuser
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
