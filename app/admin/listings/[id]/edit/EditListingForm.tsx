"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { updateListing } from "./actions";
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

type Listing = {
  id: string;
  title: string;
  price: number;
  level: number;
  sellerName: string;
  sellerDiscord: string | null;
  sellerEmail: string | null;
  sellerPhone: string | null;
  accountType: string | null;
  verified: boolean;
  rating: number | null;
  statLine: string;
  tag: string | null;
  middleman: boolean;
  featured: boolean;
  accountOfWeek: boolean;
  troopsInfo: string | null;
  status: string;
};

export default function EditListingForm({ listing }: { listing: Listing }) {
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
        const files = formData.getAll(fieldName).filter((f): f is File => f instanceof File && f.size > 0);
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
      setProgressText("Mise à jour de l'annonce...");
      await updateListing(formData);
    } catch (err) {
      setError((err as Error).message || "Une erreur est survenue.");
      setUploading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={listing.id} />

      <label style={label}>Statut</label>
      <select style={field} name="status" defaultValue={listing.status}>
        <option value="active">En ligne</option>
        <option value="sold">Vendu</option>
        <option value="removed">Retiré</option>
      </select>

      <label style={label}>Titre</label>
      <input style={field} name="title" required defaultValue={listing.title} />

      <label style={label}>Prix ($)</label>
      <input style={field} name="price" type="number" required defaultValue={listing.price} />

      <label style={label}>Niveau du compte</label>
      <input style={field} name="level" type="number" required defaultValue={listing.level} />

      <label style={label}>Nom du vendeur</label>
      <input style={field} name="sellerName" required defaultValue={listing.sellerName} />

      <label style={label}>Discord du vendeur (mémo interne)</label>
      <input style={field} name="sellerDiscord" defaultValue={listing.sellerDiscord ?? ""} />

      <label style={label}>Email du vendeur (mémo interne)</label>
      <input style={field} name="sellerEmail" type="email" defaultValue={listing.sellerEmail ?? ""} />

      <label style={label}>Téléphone du vendeur (mémo interne, avec indicatif)</label>
      <input style={field} name="sellerPhone" type="tel" defaultValue={listing.sellerPhone ?? ""} />

      <label style={label}>Note (0–5, optionnel)</label>
      <input style={field} name="rating" type="number" step="0.1" defaultValue={listing.rating ?? ""} />

      <label style={label}>Résumé (affiché sur la carte)</label>
      <input style={field} name="statLine" required defaultValue={listing.statLine} />

      <label style={label}>Type de compte</label>
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        {ACCOUNT_TYPES.map((t) => (
          <label key={t.value} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 400 }}>
            <input type="radio" name="accountType" value={t.value} defaultChecked={listing.accountType === t.value} required />
            {t.label}
          </label>
        ))}
      </div>

      <label style={label}>Étiquette (optionnel)</label>
      <input style={field} name="tag" defaultValue={listing.tag ?? ""} />

      <div style={section}>Ajouter des photos (les photos déjà en ligne restent)</div>
      <p style={{ fontSize: 13, color: "#666", marginTop: -4, marginBottom: 16 }}>
        Il n&apos;est pas encore possible de supprimer une photo individuelle ici — seulement d&apos;en ajouter.
      </p>

      {CATEGORY_FIELDS.map(({ field: fieldName, label: catLabel }) => (
        <div key={fieldName}>
          <label style={label}>{catLabel}</label>
          <input style={field} name={fieldName} type="file" accept="image/*" multiple />
        </div>
      ))}

      <div style={section}>Infos & troupes</div>
      <label style={label}>Nombre de troupes, infos complémentaires</label>
      <textarea style={{ ...field, height: 90 }} name="troopsInfo" defaultValue={listing.troopsInfo ?? ""} />

      <label style={label}>Ou des liens d&apos;images externes (optionnel, un par ligne)</label>
      <textarea style={{ ...field, height: 70 }} name="imageUrls" placeholder={"https://...\nhttps://..."} />

      <label style={{ display: "flex", gap: 8, marginBottom: 10, marginTop: 20 }}>
        <input type="checkbox" name="verified" defaultChecked={listing.verified} /> Vendeur vérifié
      </label>
      <label style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input type="checkbox" name="middleman" defaultChecked={listing.middleman} /> Middleman disponible
      </label>
      <label style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input type="checkbox" name="featured" defaultChecked={listing.featured} /> Mettre en avant (Featured)
      </label>
      <label style={{ display: "flex", gap: 8, marginBottom: 20, color: "#E2622B", fontWeight: 700 }}>
        <input type="checkbox" name="accountOfWeek" defaultChecked={listing.accountOfWeek} /> 🔥 Compte de la semaine (remplace l&apos;actuel)
      </label>

      {error && <p style={{ color: "#c0392b", fontSize: 13, marginBottom: 14 }}>{error}</p>}

      <button type="submit" disabled={uploading} style={{ padding: "12px 20px", fontWeight: 700, opacity: uploading ? 0.6 : 1 }}>
        {uploading ? (progressText || "Envoi en cours...") : "Enregistrer les modifications"}
      </button>
    </form>
  );
}
