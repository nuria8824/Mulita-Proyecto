import { CarritoPage } from "@/components/ui/tienda/carrito/CarritoPage";
import { CartProvider } from "@/context/CartContext";

export default function Carrito() {
  return (
    <CartProvider>
      <CarritoPage />
    </CartProvider>
  );
}
