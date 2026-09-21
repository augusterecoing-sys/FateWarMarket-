"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { startConversation } from "./actions";

export default function StartConversationForm({
  listingId,
  listingTitle,
}: {
  listingId?: string;
  listingTitle?: string;
}) {
  const [sending, setSending] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function removeImage() {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form
      action={async (formData) => {
        setSending(true);
        try {
          const file = fileInputRef.current?.files?.[0];
          if (file) {
            setProgressText("Envoi de l'image...");
            const blob = await upload(`messages/${Date.now()}-${file.name}`, file, {
              access: "public",
              handleUploadUrl: "/api/blob-upload",
            });
            formData.set("imageUrl", blob.url);
          }
          formData.delete("screenshot");
          setProgressText("Envoi du message...");
          await startConversation(formData);
        } finally {
          setSending(false);
          setProgressText("");
        }
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

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
          Capture d'écran (optionnel)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          name="screenshot"
          accept="image/*"
          onChange={handleFileChange}
          style={{ fontSize: 13, color: "#D8CFC2" }}
        />
        {preview && (
          <div style={{ marginTop: 10, position: "relative", display: "inline-block" }}>
            <img src={preview} alt="Aperçu" style={{ maxWidth: 160, maxHeight: 220, borderRadius: 8, display: "block" }} />
            <button
              type="button"
              onClick={removeImage}
              style={{ position: "absolute", top: -8, right: -8, background: "#E2622B", color: "#14110D", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              ×
            </button>
          </div>
        )}
      </div>

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
        {sending ? progressText || "Envoi..." : "Envoyer"}
      </button>

      <p style={{ fontSize: 12, color: "#6E665C", margin: 0 }}>
        Ce fil est privé entre toi et le vendeur. Il reste accessible depuis ce navigateur.
      </p>
    </form>
  );
}
