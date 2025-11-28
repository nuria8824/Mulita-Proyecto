import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  rol: string;
  nombre: string;
  apellido: string;
  telefono: string;
  acceso_comunidad: boolean;
  imagen?: string;
  docente?: any;
}

export function useUser() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Obtener usuario actual
  const { data: user, isLoading, error, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        return null; // No autenticado
      }

      if (!res.ok) {
        throw new Error("Error al obtener usuario");
      }

      const data = await res.json();
      return data.user as User;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 1000 * 60 * 5, // Revalidar cada 5 minutos
    retry: 1,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al cerrar sesión");
      }

      return res.json();
    },
    onSuccess: () => {
      // Limpiar todo el caché
      queryClient.clear();
      // Redirigir al inicio
      router.push("/");
    },
  });

  const isSuperAdmin = () => user?.rol === "superAdmin";

  // Wrapper que acepta callbacks opcionales
  const logout = (options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
    logoutMutation.mutate(undefined, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };

  return {
    user,
    isLoading,
    error: error?.message,
    isError,
    logout,
    isLoggingOut: logoutMutation.isPending,
    isSuperAdmin,
  };
}
