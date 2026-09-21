"use client";

import { useEffect, useRef, useState } from "react";
import { requestMiddleman } from "@/app/actions/middleman";

export default function ContactSellerButton({
  listingId,
  listingTitle,
  middlemanAvailable,
}: {
  listingId: string;
  listingTitle: string;
  middlemanAvailable: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"choice" | "discord">("choice");
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setStep("choice");
  }

  async function handleYesMiddleman() {
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
          background: "#E2622B",
          color: "#14110D",
          fontSize: 13.5,
          fontWeight: 700,
          padding: "10px 18px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        Contacter le vendeur
      </button>

      {open && (
        <div
          onClick={close}
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
              onClick={close}
              aria-label="Fermer"
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

            {step === "choice" && (
              <>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 10 }}>
                  Comment veux-tu contacter le vendeur ?
                </div>
                <p style={{ fontSize: 14, color: "#D8CFC2", lineHeight: 1.65, marginBottom: 22 }}>
                  Discute directement sur Discord, ou passe par la messagerie du site pour garder une trace écrite de l'échange.
                </p>

                <button
                  onClick={() => setStep("discord")}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    background: "#5865F2",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "12px 18px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    marginBottom: 10,
                  }}
                >
                  Sur Discord
                </button>

                <a
                  href={`/messages?listingId=${listingId}`}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    background: "none",
                    color: "#F3E9DA",
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "12px 18px",
                    borderRadius: 8,
                    border: "1px solid rgba(243,233,218,0.2)",
                    textDecoration: "none",
                  }}
                >
                  Par la messagerie du site
                </a>
              </>
            )}

            {step === "discord" && (
              <>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 10 }}>
                  Utiliser un intermédiaire pour cet échange ?
                </div>
                <p style={{ fontSize: 14, color: "#D8CFC2", lineHeight: 1.65, marginBottom: 22 }}>
                  {middlemanAvailable
                    ? "Ce vendeur accepte les transactions avec intermédiaire. Il garde les identifiants du compte jusqu'à ce que les deux parties confirment le paiement."
                    : "Un intermédiaire garde les identifiants du compte jusqu'à ce que les deux parties confirment le paiement."}
                </p>

                <form ref={formRef}>
                  <input type="hidden" name="listingId" value={listingId} />
                  <input type="hidden" name="listingTitle" value={listingTitle} />
                </form>

                <button
                  onClick={handleYesMiddleman}
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
                  {sending ? "..." : "Oui, avec intermédiaire"}
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
                  Non merci, je passe en direct
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
