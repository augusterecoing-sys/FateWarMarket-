"use client";

import { useState } from "react";
import { startConversation } from "./actions";

export default function StartConversationForm({
  listingId,
  listingTitle,
}: {
  listingId?: string;
  listingTitle?: string;
}) {
  const [sending, setSending] = useState(false);

  return (
    <form
      action={async (formData) => {
        setSending(true);
        await startConversation(formData);
        setSending(false);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 460 }}
    >
      {listingId && <input type="hidden" name="listingId" value={listingId} />}

      {listingTitle && (
        <p style={{ fontSize: 13, color: "#9C9186", margin: 0 }}>
          À propos de : <span style={{ color: "#F3E9DA" }}>{listingTitle}</span>
        </p>
      )}

      <label style={{ fontSize: 13, fontWeight: 600 }}>
        Ton pseudo Discord
        <input
          name="buyerDiscord"
          required
          placeholder="pseudo#0000"
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            padding: 10,
            borderRadius: 8,
            border: "1px solid rgba(243,233,218,0.15)",
            background: "#1D1812",
            color: "#F3E9DA",
            fontSize: 14,
          }}
        />
      </label>

      <label style={{ fontSize: 13, fontWeight: 600 }}>
        Ton message
        <textarea
          name="body"
          required
          rows={4}
          placeholder="Bonjour, j'ai une question sur..."
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            padding: 10,
            borderRadius: 8,
            border: "1px solid rgba(243,233,218,0.15)",
            background: "#1D1812",
            color: "#F3E9DA",
            fontSize: 14,
            resize: "vertical",
          }}
        />
      </label>

      <button
        type="submit"
        disabled={sending}
        style={{
          background: "#E2622B",
          color: "#14110D",
          fontSize: 14,
          fontWeight: 700,
          padding: "12px 18px",
          borderRadius: 8,
          border: "none",
          cursor: sending ? "not-allowed" : "pointer",
          opacity: sending ? 0.7 : 1,
        }}
      >
        {sending ? "Envoi..." : "Envoyer"}
      </button>

      <p style={{ fontSize: 12, color: "#6E665C", margin: 0 }}>
        Ce fil est privé entre toi et le vendeur. Il reste accessible depuis ce navigateur.
      </p>
    </form>
  );
}
