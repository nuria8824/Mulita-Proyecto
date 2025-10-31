"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import MenuAccionesHeaderPrincipal from "./MenuAccionesHeaderPrincipal";

export default function Header() {
  const { user } = useUser();
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
            <MenuAccionesHeaderPrincipal />
          )}
        </div>
      </nav>
      <div className="h-[3px] w-full bg-primary" />
    </header>
  );
}
