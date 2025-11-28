import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export function useCart() {
  const queryClient = useQueryClient();

  // Obtener carrito
  const { data: cartData, isLoading, error, isError } = useQuery({
    queryKey: ["carrito"],
    queryFn: async () => {
      const res = await fetch("/api/carrito", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        return { carrito: null, items: [] };
      }

      if (!res.ok) {
        throw new Error("Error al cargar carrito");
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 1,
  });

  const cart = cartData?.carrito;
  const items = cartData?.items || [];

  // Agregar item
  const addItemMutation = useMutation({
    mutationFn: async (variables: {
      productoId: string;
      cantidad: number;
      precio: number;
    }) => {
      const res = await fetch("/api/carrito", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_id: variables.productoId,
          cantidad: variables.cantidad,
          precio: variables.precio,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al agregar item");
      }

      return res.json();
    },
    onSuccess: () => {
      // Revalidar carrito
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },
  });

  // Eliminar item
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`/api/carrito/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar item");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },
  });

  // Actualizar cantidad
  const updateItemQuantityMutation = useMutation({
    mutationFn: async (variables: { itemId: string; cantidad: number }) => {
      const res = await fetch(`/api/carrito/${variables.itemId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad: variables.cantidad }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar item");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },
  });

  // Limpiar carrito
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/carrito", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al limpiar carrito");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrito"] });
    },
  });

  const getTotalPrice = () => {
    return items.reduce((total: number, item: CartItem) => total + item.precio * item.cantidad, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total: number, item: CartItem) => total + item.cantidad, 0);
  };

  // Wrappers que aceptan callbacks en el segundo parámetro
  const addItem = (
    variables: { productoId: string; cantidad: number; precio: number },
    options?: { onSuccess?: () => void; onError?: (error: any) => void }
  ) => {
    addItemMutation.mutate(variables, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };

  const removeItem = (
    variables: { itemId: string },
    options?: { onSuccess?: () => void; onError?: (error: any) => void }
  ) => {
    removeItemMutation.mutate(variables.itemId, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };

  const updateItemQuantity = (
    variables: { itemId: string; newQuantity: number },
    options?: { onSuccess?: () => void; onError?: (error: any) => void }
  ) => {
    updateItemQuantityMutation.mutate(
      { itemId: variables.itemId, cantidad: variables.newQuantity },
      {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
      }
    );
  };

  const clearCart = (
    variables?: any,
    options?: { onSuccess?: () => void; onError?: (error: any) => void }
  ) => {
    clearCartMutation.mutate(undefined, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };

  return {
    cart,
    items,
    isLoading,
    error: error?.message,
    isError,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isAddingItem: addItemMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isUpdatingItem: updateItemQuantityMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
}
