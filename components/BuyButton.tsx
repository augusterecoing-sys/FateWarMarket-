"use client";

import { useEffect, useRef, useState } from "react";
import { requestMiddleman } from "@/app/actions/middleman";

export default function BuyButton({
  listingId,
  listingTitle,
  middlemanAvailable,
}: {
  listingId: string;
  listingTitle: string;
  middlemanAvailable: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleYes() {
    if (!formRef.current) return;
    setSending(true);
    const formData = new FormData(formRef.current);
    await requestMiddleman(formData); // redirige vers /contact une fois la demande enregistrée
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-block",
          marginTop: 10,
          background: "#5865F2",
          color: "#fff",
          fontSize: 13.5,
          fontWeight: 700,
          padding: "10px 18px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        Contact seller on Discord
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,8,6,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "5%",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: 420,
              width: "100%",
              background: "#1D1812",
              border: "1px solid rgba(243,233,218,0.12)",
              borderRadius: 14,
              padding: "28px 26px",
              textAlign: "center",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "none",
                border: "none",
                color: "#9C9186",
                fontSize: 20,
                lineHeight: 1,
                cursor: "pointer",
                padding: 4,
              }}
            >
              ←
            </button>

            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 10 }}>
              Use a Middleman for this trade?
            </div>
            <p style={{ fontSize: 14, color: "#D8CFC2", lineHeight: 1.65, marginBottom: 22 }}>
              {middlemanAvailable
                ? "This seller accepts Middleman trades. A Middleman holds the account details until both sides confirm payment, so neither of you sends first."
                : "A Middleman holds the account details until both sides confirm payment, so neither of you sends first."}
            </p>

            <form ref={formRef}>
              <input type="hidden" name="listingId" value={listingId} />
              <input type="hidden" name="listingTitle" value={listingTitle} />
            </form>

            <button
              onClick={handleYes}
              disabled={sending}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                background: "#E2622B",
                color: "#14110D",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 18px",
                borderRadius: 8,
                border: "none",
                cursor: sending ? "not-allowed" : "pointer",
                opacity: sending ? 0.7 : 1,
                marginBottom: 10,
              }}
            >
              {sending ? "..." : "Yes, use a Middleman"}
            </button>

            <a
              href="/contact"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                background: "none",
                color: "#9C9186",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 18px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              No thanks, I'll go direct
            </a>
          </div>
        </div>
      )}
    </>
  );
}
