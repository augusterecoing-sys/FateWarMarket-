export default function Middleman() {
  const discordInvite = process.env.DISCORD_INVITE_URL || "#";
  return (
    <main>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 5%", borderBottom: "1px solid rgba(243,233,218,0.08)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#E2622B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: "#14110D" }}>F</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17 }}>Fate War Market</div>
        </a>
        <nav style={{ display: "flex", gap: 28 }}>
          <a href="/browse" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Browse Accounts</a>
          <a href="/sell" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Sell an Account</a>
          <a href="/middleman" style={{ fontSize: 14, fontWeight: 700, color: "#E2622B", textDecoration: "none" }}>Middleman</a>
        </nav>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 5% 80px" }}>
        <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Middleman service</h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#D8CFC2", marginBottom: 32 }}>
          Every transaction is handled personally — not by a bot, not by a random volunteer. Here's how it works.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 40 }}>
          <div style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>Handled personally</div>
            <div style={{ fontSize: 13.5, color: "#9C9186", lineHeight: 1.6 }}>I personally oversee every deal from start to finish, for both the buyer and the seller.</div>
          </div>
          <div style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>Voice chat available</div>
            <div style={{ fontSize: 13.5, color: "#9C9186", lineHeight: 1.6 }}>If you'd rather talk it through than type, voice chat on Discord is available on request.</div>
          </div>
          <div style={{ background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>Payments via PayPal</div>
            <div style={{ fontSize: 13.5, color: "#9C9186", lineHeight: 1.6 }}>All transactions go through PayPal. Details are confirmed with both parties before anything is sent.</div>
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Fees</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10 }}>
            <span style={{ fontSize: 14 }}>Accounts under $500</span>
            <span style={{ fontWeight: 700 }}>10% fee</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", background: "#1D1812", border: "1px solid rgba(243,233,218,0.09)", borderRadius: 10 }}>
            <span style={{ fontSize: 14 }}>Accounts under $1,000</span>
            <span style={{ fontWeight: 700 }}>5% fee</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", background: "#1D1812", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 10 }}>
            <span style={{ fontSize: 14 }}>Accounts above $1,000</span>
            <span style={{ fontWeight: 700, color: "#C9A227" }}>Custom pricing</span>
          </div>
          <div style={{ fontSize: 12.5, color: "#6E655B" }}>The final fee is always confirmed with both parties before a transaction begins.</div>
        </div>

        <a
          href={discordInvite}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#5865F2", color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px 22px", borderRadius: 9, textDecoration: "none" }}
        >
          Request Middleman on Discord
        </a>
      </div>
    </main>
  );
}
