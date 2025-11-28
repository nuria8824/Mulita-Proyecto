"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export interface CartItem {
  id: string;
  producto_id: string;
  carrito_id: string;
  cantidad: number;
  precio: number;
  producto?: {
    id: string;
    nombre: string;
    descripcion?: string;
    imagen?: string;
    precio: number;
  };
}

export interface Cart {
  id: string;
  usuario_id: string;
  total: number;
  cantidad_items: number;
  items: CartItem[];
  creado_en: string;
  actualizado_en: string;
}

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  addItem: (productoId: string, cantidad: number, precio: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, cantidad: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart del usuario
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/carrito", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Cart data received:", data);
        setCart(data.carrito);
        setItems(data.items || []);
      } else if (res.status === 401) {
        console.warn("No autorizado al cargar carrito");
        setCart(null);
        setItems([]);
      } else if (res.status === 404) {
        setCart(null);
        setItems([]);
      } else {
        console.error("Error fetching cart:", res.status, res.statusText);
        setError(`Error al cargar carrito: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  // Agregar item al carrito
  const addItem = async (productoId: string, cantidad: number, precio: number) => {
    try {
      setLoading(true);
      const res = await fetch("/api/carrito", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto_id: productoId,
          cantidad,
          precio,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setItems(data.items);
          if (data.carrito) {
            setCart(data.carrito);
          }
        } else {
          await fetchCart();
        }
      } else {
        try {
          const errorData = await res.json();
          console.error("Error response:", res.status, errorData);
          throw new Error(errorData.error || `Error ${res.status}`);
        } catch {
          console.error("Error response:", res.status, res.statusText);
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
      }
    } catch (err) {
      console.error("Error adding item:", err);
      const message = err instanceof Error ? err.message : "Error al agregar item al carrito";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar item del carrito
  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/carrito/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setItems(data.items);
        } else {
          await fetchCart();
        }
      } else {
        throw new Error("Error al eliminar item");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Error al eliminar item");
      toast.error("Error al eliminar producto del carrito");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de item
  const updateItemQuantity = async (itemId: string, cantidad: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/carrito/${itemId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cantidad }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setItems(data.items);
        } else {
          await fetchCart();
        }
      } else {
        throw new Error("Error al actualizar cantidad");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Error al actualizar cantidad");
      toast.error("Error al actualizar cantidad");
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/carrito", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCart(null);
        setItems([]);
      } else {
        throw new Error("Error al vaciar carrito");
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Error al vaciar carrito");
      toast.error("Error al vaciar el carrito");
    } finally {
      setLoading(false);
    }
  };

  // Calcular precio total
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  // Calcular cantidad total de items
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  // Fetch cart al montar
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        loading,
        error,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        fetchCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de CartProvider");
  }
  return context;
}
