"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const { user, logout } = useUser();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/noticias/crear") ||
    pathname.startsWith("/noticias/editar")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-light">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/logosMulita/Logo Mulita-13.svg"
            alt="LogoMulita13"
            className="h-8 w-8 rounded-full object-contain"
          />
          <Link href="/" className="font-semibold tracking-tight">
            Mulita
          </Link>
        </div>

        <ul className="hidden md:flex items-center gap-8 text-[15px]">
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/noticias">Noticias</Link></li>
          <li><Link href="/comunidad">Comunidad</Link></li>
          <li><Link href="/tienda">Tienda</Link></li>
          <li><Link href="/sobreNosotros">Sobre nosotros</Link></li>

          {/* Boton Dashboard solo para admins */}
          {(user?.rol === "admin" || user?.rol === "superAdmin") && (
            <li>
              <Link
                href="/dashboard"
                className="btn btn--yellow"
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/auth/register" className="btn btn--yellow">Registro</Link>
              <Link href="/auth/login" className="btn btn--blue">Log In</Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropDownOpen(prev => !prev)}
                className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-muted"
              >
                <img
                  src={user.imagen || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="i-lucide-chevron-down" />
              </button>

              {dropDownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <Link href={`/perfil/${user.id}`} className="block px-4 py-2 text-sm hover:bg-muted">Perfil</Link>
                  <Link href="/configuracion" className="block px-4 py-2 text-sm hover:bg-muted">Configuración</Link>
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
          )}
        </div>
      </nav>
      <div className="h-[3px] w-full bg-primary" />
    </header>
  );
}
