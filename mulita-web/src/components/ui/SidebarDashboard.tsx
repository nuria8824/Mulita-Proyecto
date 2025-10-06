"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SidebarDashboard({
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
      href: "/",
      label: "Landing",
      icon: "/images/icons/dashboard/landing.svg",
      iconActive: "/images/icons/dashboard/landing.svg",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: "/images/icons/dashboard/dashboard.svg",
      iconActive: "/images/icons/dashboard/dashboard azul.svg",
    },
    {
      href: "/dashboard/gestionLanding",
      label: "Gestión de Landing",
      icon: "/images/icons/dashboard/gestion landing.svg",
      iconActive: "/images/icons/dashboard/gestion landing azul.svg",
    },
    {
      href: "/dashboard/usuarios",
      label: "Usuarios",
      icon: "/images/icons/dashboard/usuarios.svg",
      iconActive: "/images/icons/dashboard/usuarios azul.svg",
    },
    {
      href: "/dashboard/configuracion",
      label: "Configuración",
      icon: "/images/icons/dashboard/configuracion.svg",
      iconActive: "/images/icons/dashboard/configuracion azul.svg",
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
        className={`fixed left-0 top-0 h-full w-60 bg-[#003c71] text-white shadow-md border-r border-gray-200 z-50 transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center bg-[#003c71] relative">
          <div className="bg-white rounded-md p-2">
            <Image
              src="/images/logosMulita/logo Mulita-12.svg"
              width={160}
              height={60}
              alt="Logo Mulita"
            />
          </div>

          {/* Botón cerrar (solo móvil) */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 md:hidden text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 p-3 text-sm">
          {links.map(({ href, label, icon, iconActive }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={handleLinkClick}
                className={`rounded-md px-4 py-3 flex items-center gap-2 transition-colors ${
                  isActive
                    ? "bg-[#fedd00] font-bold"
                    : "bg-[#003c71] hover:bg-[#002a50]"
                }`}
              >
                <Image
                  src={isActive ? iconActive : icon}
                  width={20}
                  height={20}
                  alt={label}
                />
                <span
                  className={
                    isActive ? "text-[#003c71]" : "text-white"
                  }
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
