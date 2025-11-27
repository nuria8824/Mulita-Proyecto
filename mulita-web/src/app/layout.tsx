import Header from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";


export const metadata = {
  title: "Mulita",
  description: "Comunidad y tienda oficial de Mulita",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="">
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <CartProvider>
          <UserProvider>
            {/* Top bar */}
            <Header />

            <main className="flex-1">{children}</main>
            <Footer />
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}
