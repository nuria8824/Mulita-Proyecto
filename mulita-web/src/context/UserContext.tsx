"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  rol: string;
  nombre?: string;
  apellido?: string;
  imagen?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Recuperar sesión desde la API al montar
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // Importante para cookies HttpOnly
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error recuperando sesión:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    
    const interval = setInterval(fetchUser, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Cerrar sesión
  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Error cerrando sesión:", err);
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context;
}
