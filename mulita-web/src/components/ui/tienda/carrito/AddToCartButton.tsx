"use client";

import { useCart, useUser } from "@/hooks/queries";
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
  const { addItem, isAddingItem } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);

  const handleAddToCart = () => {
    // Verificar si el usuario está logueado
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
      return;
    }

    addItem(
      { productoId, cantidad, precio },
      {
        onSuccess: () => {
          toast.success(`"${nombre}" añadido al carrito`);
          setCantidad(1);
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Error al agregar al carrito";
          toast.error(message);
          console.error("Error al agregar al carrito:", error);
        },
      }
    );
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isAddingItem}
          className="btn btn--outline flex-1"
        >
          <ShoppingCart className="w-5 h-5" />
          {isAddingItem ? "Agregando..." : "Carrito"}
        </button>
      </div>
    </div>
  );
}
