"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    // Si estamos en una página anidada de gestión, volver a la sección anterior
    // Ejemplo: /dashboard/gestionLanding/gestionCategorias -> /dashboard/gestionLanding
    if (pathname.includes("/dashboard/gestionLanding/")) {
      router.push("/dashboard/gestionLanding");
    } 
    // Si estamos en gestionLanding o gestionUsuarios, volver a /dashboard
    else if (pathname.includes("/dashboard/gestion")) {
      router.push("/dashboard");
    } 
    // Para otras páginas del dashboard, usar historial
    else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      title="Volver"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  );
}
