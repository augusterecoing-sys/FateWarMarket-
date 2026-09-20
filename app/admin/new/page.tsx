import { createListing } from "./actions";

const field: React.CSSProperties = { display: "block", width: "100%", padding: 10, marginBottom: 14 };
const label: React.CSSProperties = { display: "block", fontSize: 13, marginBottom: 4, fontWeight: 600 };
const section: React.CSSProperties = { marginTop: 28, marginBottom: 10, fontSize: 15, fontWeight: 700, borderTop: "1px solid #ddd", paddingTop: 20 };

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

        <label style={label}>Résumé (affiché sur la carte)</label>
        <input style={field} name="statLine" required placeholder="120 Skins · 45 Characters · High Rune Collection" />

        <label style={label}>Étiquette (optionnel)</label>
        <input style={field} name="tag" placeholder="Featured" />

        <div style={section}>Photos par catégorie</div>
        <p style={{ fontSize: 13, color: "#666", marginTop: -4, marginBottom: 16 }}>
          Chaque catégorie devient un onglet sur la page du compte. Laisse vide celles que tu n'as pas.
        </p>

        <label style={label}>Vue d'ensemble</label>
        <input style={field} name="photos_overview" type="file" accept="image/*" multiple />

        <label style={label}>Personnages / Héros</label>
        <input style={field} name="photos_characters" type="file" accept="image/*" multiple />

        <label style={label}>Runes</label>
        <input style={field} name="photos_runes" type="file" accept="image/*" multiple />

        <label style={label}>Équipement</label>
        <input style={field} name="photos_equipment" type="file" accept="image/*" multiple />

        <label style={label}>Sac à dos / Inventaire</label>
        <input style={field} name="photos_inventory" type="file" accept="image/*" multiple />

        <label style={label}>Skins</label>
        <input style={field} name="photos_skins" type="file" accept="image/*" multiple />

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

        <button type="submit" style={{ padding: "12px 20px", fontWeight: 700 }}>
          Publier l'annonce
        </button>
      </form>
    </main>
  );
}
