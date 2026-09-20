"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { createPublicListing } from "./actions";
import { ACCOUNT_TYPES } from "@/lib/accountTypes";

const field: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 12,
  marginBottom: 16,
  background: "#1D1812",
  border: "1px solid rgba(243,233,218,0.15)",
  borderRadius: 8,
  color: "#F3E9DA",
  fontSize: 14.5,
};
const label: React.CSSProperties = { display: "block", fontSize: 13, marginBottom: 6, fontWeight: 600, color: "#D8CFC2" };
const section: React.CSSProperties = {
  marginTop: 32,
  marginBottom: 4,
  fontSize: 15,
  fontWeight: 700,
  borderTop: "1px solid rgba(243,233,218,0.1)",
  paddingTop: 24,
  color: "#F3E9DA",
  fontFamily: "'Bricolage Grotesque',sans-serif",
};

// Les 4 premières catégories sont obligatoires : au moins une photo doit être fournie pour chacune.
const CATEGORY_FIELDS: { field: string; category: string; label: string; required: boolean }[] = [
  { field: "photos_overview", category: "overview", label: "Account profile", required: true },
  { field: "photos_characters", category: "characters", label: "Heroes", required: true },
  { field: "photos_runes", category: "runes", label: "Runes", required: true },
  { field: "photos_equipment", category: "equipment", label: "Equipment", required: true },
  { field: "photos_inventory", category: "inventory", label: "Inventory / Bag (optional)", required: false },
  { field: "photos_skins", category: "skins", label: "Skins (optional)", required: false },
];

export default function SellListingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [accountType, setAccountType] = useState("");
  const [contactMethod, setContactMethod] = useState<"discord" | "email" | "phone">("discord");

  const missingRequired = CATEGORY_FIELDS.filter((c) => c.required && !(counts[c.field] > 0));
  const canSubmit = missingRequired.length === 0 && accountType !== "" && !uploading;

  function handleFileChange(fieldName: string, files: FileList | null) {
    setCounts((prev) => ({ ...prev, [fieldName]: files ? files.length : 0 }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setError("");

    if (missingRequired.length > 0 || accountType === "") {
      const parts = [
        ...missingRequired.map((c) => c.label),
        ...(accountType === "" ? ["your account type"] : []),
      ];
      setError(`Please fill in: ${parts.join(", ")}.`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData(formRef.current);
      const uploadedImages: { url: string; category: string }[] = [];

      for (const { field: fieldName, category, label: catLabel } of CATEGORY_FIELDS) {
        const files = formData.getAll(fieldName).filter((f): f is File => f instanceof File && f.size > 0);
        for (let i = 0; i < files.length; i++) {
          setProgressText(`Uploading ${catLabel} photo (${i + 1}/${files.length})...`);
          const file = files[i];
          const blob = await upload(`listings/${category}/${Date.now()}-${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/blob-upload",
          });
          uploadedImages.push({ url: blob.url, category });
        }
        formData.delete(fieldName);
      }

      formData.set("uploadedImages", JSON.stringify(uploadedImages));
      setProgressText("Publishing your listing...");
      await createPublicListing(formData);
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
      setUploading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <label style={label}>Title</label>
      <input style={field} name="title" required placeholder="Fate War account level 87" />

      <label style={label}>Price ($)</label>
      <input style={field} name="price" type="number" required placeholder="425" />

      <label style={label}>Account level</label>
      <input style={field} name="level" type="number" required placeholder="87" />

      <label style={label}>Your in-game name</label>
      <input style={field} name="sellerName" required placeholder="PlayerName" />

      <label style={label}>How can we reach you? (private, never shown publicly)</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {([
          { value: "discord", label: "Discord" },
          { value: "email", label: "Email" },
          { value: "phone", label: "Phone" },
        ] as const).map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setContactMethod(m.value)}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: 8,
              border: `1px solid ${contactMethod === m.value ? "#E2622B" : "rgba(243,233,218,0.15)"}`,
              background: contactMethod === m.value ? "rgba(226,98,43,0.12)" : "#1D1812",
              color: contactMethod === m.value ? "#E2622B" : "#D8CFC2",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {contactMethod === "discord" && (
        <input style={field} name="sellerDiscord" required placeholder="Ex: pseudo#1234 or @pseudo" />
      )}
      {contactMethod === "email" && (
        <input style={field} name="sellerEmail" type="email" required placeholder="you@example.com" />
      )}
      {contactMethod === "phone" && (
        <>
          <input style={field} name="sellerPhone" type="tel" required placeholder="+33 6 12 34 56 78" />
          <p style={{ fontSize: 12.5, color: "#9C9186", marginTop: -12, marginBottom: 16 }}>
            Include the country code (e.g. +33 for France, +1 for the US).
          </p>
        </>
      )}

      <label style={label}>Summary (shown on the listing card)</label>
      <input style={field} name="statLine" required placeholder="120 Skins · 45 Characters · High Rune Collection" />

      <div style={section}>Account type</div>
      <p style={{ fontSize: 13, color: "#9C9186", marginTop: -2, marginBottom: 14, lineHeight: 1.6 }}>
        Confirm your account's main build so buyers can filter with more precision. <span style={{ color: "#E2622B" }}>Required.</span>
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {ACCOUNT_TYPES.map((t) => (
          <label
            key={t.value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 14.5,
              color: "#F3E9DA",
              background: "#1D1812",
              border: `1px solid ${accountType === t.value ? "#E2622B" : "rgba(243,233,218,0.15)"}`,
              borderRadius: 8,
              padding: "12px 14px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="accountType"
              value={t.value}
              checked={accountType === t.value}
              onChange={() => setAccountType(t.value)}
              required
            />
            {t.label}
          </label>
        ))}
      </div>

      <div style={section}>Photos by category</div>
      <p style={{ fontSize: 13, color: "#9C9186", marginTop: -2, marginBottom: 18, lineHeight: 1.6 }}>
        Screenshots become tabs on your account page. <strong style={{ color: "#E2622B" }}>Account profile, Heroes, Runes and Equipment are required</strong> — you can select several photos at once for each category.
      </p>

      {CATEGORY_FIELDS.map(({ field: fieldName, label: catLabel, required }) => {
        const count = counts[fieldName] || 0;
        return (
          <div key={fieldName}>
            <label style={label}>
              {catLabel}
              {required && <span style={{ color: "#E2622B" }}> *</span>}
              {required && count > 0 && <span style={{ color: "#7FB88A", fontWeight: 400 }}> — {count} photo{count > 1 ? "s" : ""} selected</span>}
            </label>
            <input
              style={{ ...field, borderColor: required && count === 0 ? "rgba(226,98,43,0.5)" : "rgba(243,233,218,0.15)" }}
              name={fieldName}
              type="file"
              accept="image/*"
              multiple
              required={required}
              onChange={(e) => handleFileChange(fieldName, e.target.files)}
            />
          </div>
        );
      })}

      <div style={section}>Troops & other info</div>
      <label style={label}>Troops count, server, anything else buyers should know</label>
      <textarea style={{ ...field, height: 90 }} name="troopsInfo" placeholder="Ex: 12 000 troops, castle level 25, EU server..." />

      <label style={{ display: "flex", gap: 8, marginBottom: 20, marginTop: 20, fontSize: 14, color: "#D8CFC2" }}>
        <input type="checkbox" name="middleman" defaultChecked /> I want to use the Middleman service
      </label>

      {error && (
        <p style={{ color: "#E2622B", fontSize: 13.5, marginBottom: 16, background: "rgba(226,98,43,0.1)", padding: 12, borderRadius: 8 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          padding: "14px 22px",
          fontWeight: 700,
          fontSize: 14.5,
          borderRadius: 8,
          border: "none",
          background: canSubmit ? "#E2622B" : "#4A4238",
          color: canSubmit ? "#14110D" : "#8A8175",
          cursor: canSubmit ? "pointer" : "not-allowed",
          width: "100%",
        }}
      >
        {uploading ? (progressText || "Uploading...") : "Publish my listing"}
      </button>
    </form>
  );
}
