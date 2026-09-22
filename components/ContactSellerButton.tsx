"use client";

import { useEffect, useRef, useState } from "react";
import { requestMiddleman } from "@/app/actions/middleman";
import { sendOffer } from "@/app/messages/actions";

export default function ContactSellerButton({
  listingId,
  listingTitle,
  listingPrice,
  middlemanAvailable,
  existingBuyerDiscord,
}: {
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  middlemanAvailable: boolean;
  existingBuyerDiscord?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"choice" | "discord" | "offer">("choice");
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
                  Discute directement sur Discord, passe par la messagerie du site, ou propose ton prix.
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
                    marginBottom: 10,
                  }}
                >
                  Par la messagerie du site
                </a>

                <button
                  onClick={() => setStep("offer")}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    background: "none",
                    color: "#C9A227",
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "12px 18px",
                    borderRadius: 8,
                    border: "1px solid rgba(201,162,39,0.4)",
                    cursor: "pointer",
                  }}
                >
                  💰 Faire une offre
                </button>
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

            {step === "offer" && (
              <form
                action={async (formData) => {
                  setSending(true);
                  await sendOffer(formData);
                  setSending(false);
                }}
              >
                <input type="hidden" name="listingId" value={listingId} />

                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 10 }}>
                  Fais ton offre
                </div>
                <p style={{ fontSize: 14, color: "#D8CFC2", lineHeight: 1.65, marginBottom: 18 }}>
                  Le vendeur reçoit ton offre dans sa messagerie et peut l'accepter ou la refuser. Prix affiché : ${listingPrice}.
                </p>

                <input
                  name="amount"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder={`Ton prix ($)`}
                  style={{
                    display: "block",
                    width: "100%",
                    marginBottom: 12,
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid rgba(243,233,218,0.15)",
                    background: "#14110D",
                    color: "#F3E9DA",
                    fontSize: 16,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                />

                <textarea
                  name="body"
                  rows={2}
                  placeholder="Un message pour accompagner ton offre (optionnel)"
                  style={{
                    display: "block",
                    width: "100%",
                    marginBottom: 12,
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid rgba(243,233,218,0.15)",
                    background: "#14110D",
                    color: "#F3E9DA",
                    fontSize: 13.5,
                    resize: "vertical",
                  }}
                />

                {existingBuyerDiscord ? (
                  <p style={{ fontSize: 12.5, color: "#6E665C", marginBottom: 14 }}>
                    Envoyée en tant que <span style={{ color: "#D8CFC2", fontWeight: 700 }}>{existingBuyerDiscord}</span>
                  </p>
                ) : (
                  <input
                    name="buyerDiscord"
                    required
                    placeholder="Ton pseudo Discord"
                    style={{
                      display: "block",
                      width: "100%",
                      marginBottom: 14,
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid rgba(243,233,218,0.15)",
                      background: "#14110D",
                      color: "#F3E9DA",
                      fontSize: 13.5,
                    }}
                  />
                )}

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    background: "#C9A227",
                    color: "#1A1208",
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "12px 18px",
                    borderRadius: 8,
                    border: "none",
                    cursor: sending ? "not-allowed" : "pointer",
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  {sending ? "Envoi..." : "Envoyer mon offre"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
