"use client";

import { useEffect, useState } from "react";

export default function BuyButton({ middlemanAvailable }: { middlemanAvailable: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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

            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 10, paddingRight: 20 }}>
              Use a Middleman for this trade?
            </div>
            <p style={{ fontSize: 14, color: "#D8CFC2", lineHeight: 1.65, marginBottom: 20 }}>
              {middlemanAvailable
                ? "This seller accepts Middleman trades. A Middleman holds the account details until both sides confirm payment, so neither of you sends first."
                : "A Middleman holds the account details until both sides confirm payment, so neither of you sends first. Ask about it when you reach out."}
            </p>

            <a
              href="/contact"
              style={{
                display: "block",
                textAlign: "center",
                background: "#E2622B",
                color: "#14110D",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 18px",
                borderRadius: 8,
                textDecoration: "none",
                marginBottom: 10,
              }}
            >
              Continue to Discord
            </a>
            <button
              onClick={() => setOpen(false)}
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
                border: "none",
                cursor: "pointer",
              }}
            >
              No thanks, I'll go direct
            </button>
          </div>
        </div>
      )}
    </>
  );
}
