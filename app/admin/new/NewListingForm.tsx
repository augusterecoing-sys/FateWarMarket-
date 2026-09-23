"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { createListing } from "./actions";
import { ACCOUNT_TYPES } from "@/lib/accountTypes";

const field: React.CSSProperties = { display: "block", width: "100%", padding: 10, marginBottom: 14 };
const label: React.CSSProperties = { display: "block", fontSize: 13, marginBottom: 4, fontWeight: 600 };
const section: React.CSSProperties = { marginTop: 28, marginBottom: 10, fontSize: 15, fontWeight: 700, borderTop: "1px solid #ddd", paddingTop: 20 };

const CATEGORY_FIELDS: { field: string; category: string; label: string }[] = [
  { field: "photos_overview", category: "overview", label: "Vue d'ensemble" },
  { field: "photos_characters", category: "characters", label: "Personnages / Héros" },
  { field: "photos_runes", category: "runes", label: "Runes" },
  { field: "photos_equipment", category: "equipment", label: "Équipement" },
  { field: "photos_inventory", category: "inventory", label: "Sac à dos / Inventaire" },
  { field: "photos_skins", category: "skins", label: "Skins" },
];

// Miniature d'une photo choisie (pas encore envoyée), avec bouton × pour la retirer
function Thumb({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div style={{ position: "relative", width: 96, height: 72 }}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6, border: "1px solid #ccc" }} />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Retirer la photo"
        title="Retirer la photo"
        style={{
          position: "absolute",
          top: -8,
          right: -8,
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "none",
          background: "#D9372B",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          lineHeight: "24px",
          cursor: "pointer",
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

export default function NewListingForm() {
  // Photos choisies par catégorie (on peut en ajouter plusieurs fois et en retirer une par une)
  const [photos, setPhotos] = useState<Record<string, File[]>>({});

  function addPhotos(category: string, list: FileList | null) {
    if (!list || list.length === 0) return;
    const added = Array.from(list);
    setPhotos((prev) => ({ ...prev, [category]: [...(prev[category] ?? []), ...added] }));
  }

  function removePhoto(category: string, index: number) {
    setPhotos((prev) => ({ ...prev, [category]: (prev[category] ?? []).filter((_, i) => i !== index) }));
  }

  const formRef = useRef<HTMLFormElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setError("");
    setUploading(true);

    try {
      const formData = new FormData(formRef.current);
      const uploadedImages: { url: string; category: string }[] = [];

      for (const { field: fieldName, category, label: catLabel } of CATEGORY_FIELDS) {
        const files = photos[category] ?? [];
        for (let i = 0; i < files.length; i++) {
          setProgressText(`Envoi de la photo ${catLabel} (${i + 1}/${files.length})...`);
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
      setProgressText("Création de l'annonce...");
      await createListing(formData);
    } catch (err) {
      setError((err as Error).message || "Une erreur est survenue.");
      setUploading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <label style={label}>Titre</label>
      <input style={field} name="title" required placeholder="Compte Fate War niveau 87" />

      <label style={label}>Prix ($)</label>
      <input style={field} name="price" type="number" required placeholder="425" />

      <label style={label}>Niveau du compte</label>
      <input style={field} name="level" type="number" required placeholder="87" />

      <label style={label}>Nom du vendeur</label>
      <input style={field} name="sellerName" required placeholder="PlayerName" />

      <label style={label}>Discord du vendeur (mémo interne, jamais affiché publiquement)</label>
      <input style={field} name="sellerDiscord" placeholder="Ex: pseudo#1234 ou @pseudo" />

      <label style={label}>Email du vendeur (mémo interne, optionnel)</label>
      <input style={field} name="sellerEmail" type="email" placeholder="vendeur@example.com" />

      <label style={label}>Téléphone du vendeur (mémo interne, optionnel, avec indicatif)</label>
      <input style={field} name="sellerPhone" type="tel" placeholder="+33 6 12 34 56 78" />

      <label style={label}>Note (0–5, optionnel)</label>
      <input style={field} name="rating" type="number" step="0.1" placeholder="4.8" />

      <label style={label}>Résumé (affiché sur la carte)</label>
      <input style={field} name="statLine" required placeholder="120 Skins · 45 Characters · High Rune Collection" />

      <label style={label}>Type de compte</label>
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        {ACCOUNT_TYPES.map((t) => (
          <label key={t.value} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 400 }}>
            <input type="radio" name="accountType" value={t.value} required />
            {t.label}
          </label>
        ))}
      </div>

      <label style={label}>Étiquette (optionnel)</label>
      <input style={field} name="tag" placeholder="Featured" />

      <div style={section}>Photos par catégorie</div>
      <p style={{ fontSize: 13, color: "#666", marginTop: -4, marginBottom: 16 }}>
        Chaque catégorie devient un onglet sur la page du compte. Laisse vide celles que tu n'as pas.
      </p>

      {CATEGORY_FIELDS.map(({ field: fieldName, category, label: catLabel }) => {
        const list = photos[category] ?? [];
        return (
          <div key={fieldName} style={{ marginBottom: 18 }}>
            <label style={label}>
              {catLabel} {list.length > 0 && <span style={{ fontWeight: 400, color: "#666" }}>({list.length} photo{list.length > 1 ? "s" : ""})</span>}
            </label>

            {list.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "10px 0 12px" }}>
                {list.map((file, i) => (
                  <Thumb key={`${file.name}-${file.lastModified}-${i}`} file={file} onRemove={() => removePhoto(category, i)} />
                ))}
              </div>
            )}

            {/* Pas de "name" : les fichiers sont gérés dans l'état, pas dans le formulaire */}
            <input
              style={{ ...field, marginBottom: 0 }}
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => {
                addPhotos(category, e.target.files);
                e.target.value = ""; // permet de rechoisir la même photo après l'avoir retirée
              }}
            />
          </div>
        );
      })}

      <div style={section}>Infos & troupes</div>
      <label style={label}>Nombre de troupes, infos complémentaires</label>
      <textarea style={{ ...field, height: 90 }} name="troopsInfo" placeholder="Ex : 12 000 troupes, niveau de château 25, serveur EU..." />

      <label style={label}>Ou des liens d'images externes (optionnel, un par ligne, catégorie "vue d'ensemble")</label>
      <textarea style={{ ...field, height: 70 }} name="imageUrls" placeholder={"https://...\nhttps://..."} />

      <label style={{ display: "flex", gap: 8, marginBottom: 10, marginTop: 20 }}>
        <input type="checkbox" name="verified" /> Vendeur vérifié
      </label>
      <label style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input type="checkbox" name="middleman" defaultChecked /> Middleman disponible
      </label>
      <label style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input type="checkbox" name="featured" /> Mettre en avant (Featured)
      </label>
      <label style={{ display: "flex", gap: 8, marginBottom: 20, color: "#E2622B", fontWeight: 700 }}>
        <input type="checkbox" name="accountOfWeek" /> 🔥 Compte de la semaine (remplace l&apos;actuel)
      </label>
      <label style={{ display: "flex", gap: 8, marginBottom: 20, color: "#D9372B", fontWeight: 700 }}>
        <input type="checkbox" name="sold" /> Marquer SOLD (liseré rouge sur le compte)
      </label>

      {error && <p style={{ color: "#c0392b", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      <button type="submit" disabled={uploading} style={{ padding: "12px 20px", fontWeight: 700, opacity: uploading ? 0.6 : 1 }}>
        {uploading ? (progressText || "Envoi en cours...") : "Publier l'annonce"}
      </button>
    </form>
  );
}
