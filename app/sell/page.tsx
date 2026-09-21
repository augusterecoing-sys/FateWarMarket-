import SellListingForm from "./SellListingForm";

export default function Sell() {
  return (
    <main>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 5%", borderBottom: "1px solid rgba(243,233,218,0.08)", flexWrap: "wrap", rowGap: 12 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#E2622B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: "#14110D" }}>F</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17 }}>Fate War Market</div>
        </a>
        <nav style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href="/browse" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Browse Accounts</a>
          <a href="/sell" style={{ fontSize: 14, fontWeight: 700, color: "#E2622B", textDecoration: "none" }}>Sell an Account</a>
          <a href="/middleman" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Middleman</a>
        <a href="/messages" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Messages</a>
        </nav>
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 5% 80px" }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Sell your account</h1>
        <p style={{ fontSize: 15, color: "#D8CFC2", lineHeight: 1.7, marginBottom: 32 }}>
          Fill in the form below — your listing goes live as soon as you publish it. Screenshots for
          the account profile, heroes, runes and equipment are required so buyers can trust the listing.
        </p>

        <SellListingForm />

        <p style={{ fontSize: 13, color: "#6E655B", lineHeight: 1.6, marginTop: 28, textAlign: "center" }}>
          Prefer to send everything on Discord instead? Add <strong style={{ color: "#9C9186" }}>0panda_roux0</strong> as a friend.
        </p>
      </div>
    </main>
  );
}
