"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

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
  const { addItem, error: cartError } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddToCart = async () => {
    setLoading(true);
    setShowError(false);
    try {
      await addItem(productoId, cantidad, precio);
      setShowNotification(true);
      setCantidad(1);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al agregar al carrito";
      setErrorMessage(message);
      setShowError(true);
      console.error("Error al agregar al carrito:", error);
      setTimeout(() => setShowError(false), 5000);
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

      {showNotification && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          ✓ "{nombre}" añadido al carrito
        </div>
      )}

      {showError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ✗ {errorMessage || "Error al agregar al carrito"}
        </div>
      )}
    </div>
  );
}
