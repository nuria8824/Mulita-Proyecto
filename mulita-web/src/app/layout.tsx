import Header from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import ProvidersWrapper from "@/components/ProvidersWrapper";

export const metadata = {
  title: "Mulita",
  description: "Comunidad y tienda oficial de Mulita",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/react-international-phone@4.6.1/lib/styles.css"
        />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <ProvidersWrapper>
          <CartProvider>
            <UserProvider>
              {/* Top bar */}
              <Header />
              <main className="flex-1">{children}</main>
              <Toaster position="bottom-right" />
              <Footer />
            </UserProvider>
          </CartProvider>
        </ProvidersWrapper>
      </body>
    </html>
  );
}
