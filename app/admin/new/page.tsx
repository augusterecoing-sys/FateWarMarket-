import { createListing } from "./actions";

const field: React.CSSProperties = { display: "block", width: "100%", padding: 10, marginBottom: 14 };
const label: React.CSSProperties = { display: "block", fontSize: 13, marginBottom: 4, fontWeight: 600 };

export default function NewListing() {
  return (
    <main style={{ maxWidth: 560, margin: "48px auto", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Nouvelle annonce</h1>
      <form action={createListing}>
        <label style={label}>Titre</label>
        <input style={field} name="title" required placeholder="Compte Fate War niveau 87" />

        <label style={label}>Prix ($)</label>
        <input style={field} name="price" type="number" required placeholder="425" />

        <label style={label}>Niveau du compte</label>
        <input style={field} name="level" type="number" required placeholder="87" />

        <label style={label}>Nom du vendeur</label>
        <input style={field} name="sellerName" required placeholder="PlayerName" />

        <label style={label}>Note (0–5, optionnel)</label>
        <input style={field} name="rating" type="number" step="0.1" placeholder="4.8" />

        <label style={label}>Ligne de statistiques</label>
        <input style={field} name="statLine" required placeholder="120 Skins · 45 Characters · High Rune Collection" />

        <label style={label}>Catégorie de l'image principale</label>
        <input style={field} name="imageLabel" placeholder="Account overview" />

        <label style={label}>Étiquette (optionnel)</label>
        <input style={field} name="tag" placeholder="Featured" />

        <label style={label}>Photos du compte (depuis ton ordinateur)</label>
        <input style={field} name="photos" type="file" accept="image/*" multiple />

        <label style={label}>Ou des liens d'images externes (optionnel, un par ligne)</label>
        <textarea style={{ ...field, height: 80 }} name="imageUrls" placeholder={"https://...\nhttps://..."} />

        <label style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input type="checkbox" name="verified" /> Vendeur vérifié
        </label>
        <label style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input type="checkbox" name="middleman" defaultChecked /> Middleman disponible
        </label>
        <label style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <input type="checkbox" name="featured" /> Mettre en avant (Featured)
        </label>

        <button type="submit" style={{ padding: "12px 20px", fontWeight: 700 }}>
          Publier l'annonce
        </button>
      </form>
    </main>
  );
}
