"use client";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

interface AddToCartButtonProps {
  productoId: string;
  nombre: string;
  precio: number;
  className?: string;
}

export function AddToCartButton({
  productoId,
  nombre,
  precio,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    // Verificar si el usuario está logueado
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
      return;
    }

    setLoading(true);
    try {
      await addItem(productoId, cantidad, precio);
      toast.success(`"${nombre}" añadido al carrito`);
      setCantidad(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al agregar al carrito";
      toast.error(message);
      console.error("Error al agregar al carrito:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="btn btn--outline flex-1"
        >
          <ShoppingCart className="w-5 h-5" />
          {loading ? "Agregando..." : "Carrito"}
        </button>
      </div>
    </div>
  );
}
