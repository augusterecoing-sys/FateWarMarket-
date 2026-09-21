export default function Contact() {
  const discordInvite = process.env.DISCORD_INVITE_URL || "#";
  return (
    <main>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 5%", borderBottom: "1px solid rgba(243,233,218,0.08)", flexWrap: "wrap", rowGap: 12 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#E2622B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 15, color: "#14110D" }}>F</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17 }}>Fate War Market</div>
        </a>
        <nav style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href="/browse" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Browse Accounts</a>
          <a href="/sell" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Sell an Account</a>
          <a href="/middleman" style={{ fontSize: 14, fontWeight: 600, color: "#F3E9DA", textDecoration: "none" }}>Middleman</a>
        </nav>
      </header>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center", padding: "0 5%" }}>
        <div style={{ maxWidth: 460 }}>
          <h1 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Get in touch on Discord</h1>
          <p style={{ fontSize: 15, color: "#D8CFC2", lineHeight: 1.7, marginBottom: 12 }}>
            To contact a seller, ask about an account, or set up a Middleman, add
          </p>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 22, fontWeight: 700, color: "#F0793B", marginBottom: 20 }}>
            0panda_roux0
          </div>
          <p style={{ fontSize: 14, color: "#9C9186", lineHeight: 1.6, marginBottom: 28 }}>
            as a friend on Discord. Mention the account you're interested in, or what you need help with.
          </p>
          {discordInvite !== "#" && (
            <a
              href={discordInvite}
              style={{ display: "inline-block", background: "#5865F2", color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px 22px", borderRadius: 9, textDecoration: "none" }}
            >
              Or join the Discord server
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
