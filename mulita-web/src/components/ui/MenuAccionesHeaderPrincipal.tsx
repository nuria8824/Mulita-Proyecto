"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function MenuAccionesHeaderPrincipal() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-muted"
      >
        <img
          src={user.imagen || "/default-avatar.png"}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="i-lucide-chevron-down" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
          <Link
            href={`/perfil/${user.id}`}
            className="block px-4 py-2 text-sm hover:bg-muted"
          >
            Perfil
          </Link>
          <Link
            href="/configuracion"
            className="block px-4 py-2 text-sm hover:bg-muted"
          >
            Configuración
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
          >
            Salir
          </button>
        </div>
      )}
    </div>
  );
}
