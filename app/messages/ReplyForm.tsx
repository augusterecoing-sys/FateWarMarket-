"use client";

import { useRef, useState } from "react";
import { sendBuyerMessage } from "./actions";

export default function ReplyForm({ listingId }: { listingId?: string }) {
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        setSending(true);
        await sendBuyerMessage(formData);
        formRef.current?.reset();
        setSending(false);
      }}
      style={{ display: "flex", gap: 10, marginTop: 16 }}
    >
      {listingId && <input type="hidden" name="listingId" value={listingId} />}
      <textarea
        name="body"
        required
        rows={2}
        placeholder="Écris ta réponse..."
        style={{
          flex: 1,
          padding: 10,
          borderRadius: 8,
          border: "1px solid rgba(243,233,218,0.15)",
          background: "#1D1812",
          color: "#F3E9DA",
          fontSize: 14,
          resize: "vertical",
        }}
      />
      <button
        type="submit"
        disabled={sending}
        style={{
          background: "#E2622B",
          color: "#14110D",
          fontSize: 14,
          fontWeight: 700,
          padding: "0 18px",
          borderRadius: 8,
          border: "none",
          cursor: sending ? "not-allowed" : "pointer",
          opacity: sending ? 0.7 : 1,
        }}
      >
        {sending ? "..." : "Envoyer"}
      </button>
    </form>
  );
}
