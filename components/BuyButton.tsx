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
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setError("");

    const formData = new FormData(formRef.current);
    const buyerDiscord = String(formData.get("buyerDiscord") ?? "").trim();
    if (!buyerDiscord) {
      setError("Please enter your Discord username.");
      return;
    }

    setSending(true);
    try {
      await requestMiddleman(formData);
    } catch (err) {
      // redirect() déclenche un signal interne Next.js une fois l'envoi terminé — on ne l'affiche pas comme une erreur.
      if ((err as Error)?.message === "Please enter your Discord username.") {
        setError((err as Error).message);
        setSending(false);
      }
    }
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
            <p style={{ fontSize: 14, color: "#D8CFC2", lineHeight: 1.65, marginBottom: 18 }}>
              {middlemanAvailable
                ? "This seller accepts Middleman trades. A Middleman holds the account details until both sides confirm payment, so neither of you sends first."
                : "A Middleman holds the account details until both sides confirm payment, so neither of you sends first. Ask about it when you reach out."}
            </p>

            <form ref={formRef} onSubmit={handleSubmit}>
              <input type="hidden" name="listingId" value={listingId} />
              <input type="hidden" name="listingTitle" value={listingTitle} />

              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#D8CFC2", marginBottom: 6 }}>
                Your Discord username
              </label>
              <input
                name="buyerDiscord"
                required
                placeholder="Ex: pseudo#1234 or @pseudo"
                style={{
                  display: "block",
                  width: "100%",
                  padding: 11,
                  marginBottom: 14,
                  background: "#14110D",
                  border: "1px solid rgba(243,233,218,0.15)",
                  borderRadius: 8,
                  color: "#F3E9DA",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />

              {error && <p style={{ color: "#E2622B", fontSize: 13, marginBottom: 12 }}>{error}</p>}

              <button
                type="submit"
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
                {sending ? "Sending..." : "Continue to Discord"}
              </button>
            </form>

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
