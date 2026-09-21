"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { sendAdminMessage } from "./actions";

export default function AdminReplyForm({ conversationId }: { conversationId: string }) {
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        setSending(true);
        try {
          const file = fileInputRef.current?.files?.[0];
          if (file) {
            const blob = await upload(`messages/${Date.now()}-${file.name}`, file, {
              access: "public",
              handleUploadUrl: "/api/blob-upload",
            });
            formData.set("imageUrl", blob.url);
          }
          formData.delete("screenshot");
          await sendAdminMessage(formData);
          formRef.current?.reset();
          setPreview(null);
        } finally {
          setSending(false);
        }
      }}
      style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}
    >
      <input type="hidden" name="conversationId" value={conversationId} />

      {preview && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={preview} alt="Aperçu" style={{ maxWidth: 140, maxHeight: 190, borderRadius: 8, display: "block" }} />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            style={{ position: "absolute", top: -8, right: -8, background: "#E2622B", color: "#14110D", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <textarea
          name="body"
          rows={2}
          placeholder="Réponds à ce joueur..."
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
          style={{ background: "#E2622B", color: "#14110D", fontSize: 14, fontWeight: 700, padding: "0 18px", borderRadius: 8, border: "none", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1 }}
        >
          {sending ? "..." : "Envoyer"}
        </button>
      </div>

      <label style={{ fontSize: 12.5, color: "#9C9186", display: "flex", alignItems: "center", gap: 8 }}>
        📎 Joindre une capture
        <input ref={fileInputRef} type="file" name="screenshot" accept="image/*" onChange={handleFileChange} style={{ fontSize: 12.5 }} />
      </label>
    </form>
  );
}
