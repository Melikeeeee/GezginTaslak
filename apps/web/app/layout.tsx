import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Gezgin - Nereyi keşfetmek istiyorsun?",
  description:
    "Discover places and organize them into realistic day-trip or multi-day travel plans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-[#f8fafc] text-gray-900 min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 pb-20">{children}</div>
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
