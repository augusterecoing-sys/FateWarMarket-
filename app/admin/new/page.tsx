import NewListingForm from "./NewListingForm";

export default function NewListing() {
  return (
    <main style={{ maxWidth: 560, margin: "48px auto", fontFamily: "sans-serif", paddingBottom: 80 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Nouvelle annonce</h1>
      <a href="/admin/listings" style={{ fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 20 }}>← Voir / supprimer les annonces existantes</a>
      <NewListingForm />
    </main>
  );
}
