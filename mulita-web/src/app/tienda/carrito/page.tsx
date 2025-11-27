import { CarritoPage } from "@/components/ui/CarritoPage";
import { CartProvider } from "@/context/CartContext";

export default function Carrito() {
  return (
    <CartProvider>
      <CarritoPage />
    </CartProvider>
  );
}
