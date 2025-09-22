import Header from "@/components/ui/Header";
import "./globals.css";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Mulita",
  description: "Comunidad y tienda oficial de Mulita",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="">
      <body className="bg-background text-foreground">
        <UserProvider>
          {/* Top bar */}
          <Header />

          <main>{children}</main>
          <Footer />
        </UserProvider>

      </body>
    </html>
  );
}
