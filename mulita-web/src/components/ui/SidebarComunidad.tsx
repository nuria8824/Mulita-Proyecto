"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function SidebarComunidad({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    onClose();
  };

  const links = [
    {
      href: "/comunidad",
      label: "Foro",
      icon: "/images/foro.svg",
      iconActive: "/images/foro.svg",
      isActive: () => pathname === "/comunidad",
    },
    {
      href: "/buscar",
      label: "Buscar",
      icon: "/images/buscar.svg",
      iconActive: "/images/buscar.svg",
      isActive: () => pathname === "/buscar",
    },
    {
      href: "/comunidad/actividades/crear",
      label: "Crear",
      icon: "/images/crear.svg",
      iconActive: "/images/crear.svg",
      isActive: () => pathname.startsWith("/comunidad/actividades/crear"),
    },
    {
      href: "/colecciones",
      label: "Colecciones",
      icon: "/images/colecciones.svg",
      iconActive: "/images/colecciones.svg",
      isActive: () => pathname === "/colecciones",
    },
    {
      href: "/favoritos",
      label: "Favoritos",
      icon: "/images/favoritos.svg",
      iconActive: "/images/favoritos.svg",
      isActive: () => pathname === "/favoritos",
    },
    {
      href: "/configuracion",
      label: "Configuración",
      icon: "/images/configuracion.svg",
      iconActive: "/images/configuracion.svg",
      isActive: () => pathname === "/configuracion",
    },
  ];

  return (
    <>
      {/* Overlay en mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-60 bg-white text-gray-800 shadow-md border-r border-gray-200 z-50 transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200 relative">
          <Image
            src="/images/logosMulita/logo Mulita-12.svg"
            width={160}
            height={60}
            alt="Logo Mulita"
          />
          {/* Botón cerrar (solo móvil) */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 md:hidden text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1 p-3 text-sm">
          {links.map(({ href, label, icon, iconActive, isActive }) => {
            const active = isActive();
            return (
              <Link
                key={href}
                href={href}
                onClick={handleLinkClick}
                className={`rounded-md px-4 py-3 flex items-center gap-2 transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Image
                  src={active ? iconActive : icon}
                  width={20}
                  height={20}
                  alt={label}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
