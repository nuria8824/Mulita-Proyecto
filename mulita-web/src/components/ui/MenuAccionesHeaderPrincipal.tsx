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
        className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden hover:opacity-90 transition"
      >
        <img
          src={user.imagen || "/images/icons/perfil/default-avatar.svg"}
          alt="Avatar"
          className={`w-full h-full object-cover ${!user.imagen ? "scale-50" : ""}`}
        />
        <span className="absolute right-[-4px] bottom-[-2px] i-lucide-chevron-down text-gray-600 bg-white rounded-full p-[2px] shadow-sm" />
      </button>


      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
          <Link
            href={`/perfil/${user.id}`}
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-muted"
          >
            Perfil
          </Link>
          {/* <Link
            href="/configuracion"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-muted"
          >
            Configuración
          </Link> */}
          <button
            type="button"
            onClick={async () => {
              await logout();
              setOpen(false);
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
