import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gezgin - Travel Discovery & Trip Planning",
  description:
    "Discover places and organize them into realistic day-trip or multi-day travel plans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
