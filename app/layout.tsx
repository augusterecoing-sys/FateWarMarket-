export const metadata = {
  title: "Fate War Market",
  description: "Fate War account marketplace",
};

import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap"
        />
      </head>
      <body style={{ margin: 0, background: "#14110D", color: "#F3E9DA", fontFamily: "'Manrope',sans-serif" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
