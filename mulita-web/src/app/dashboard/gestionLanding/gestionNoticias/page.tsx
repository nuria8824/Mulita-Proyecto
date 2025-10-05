"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import MenuAcciones from "@/components/ui/MenuAcciones";

interface Noticia {
  id: number;
  titulo: string;
}

export default function GestionNoticiasPage() {
  const { user, loading: userLoading} = useUser();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loadingNoticias, setLoadingNoticias] = useState(true);

  // Traer noticias desde la API
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch("/api/noticias");
        const data = await res.json();
        setNoticias((data ?? []).reverse()); // Las más recientes primero
      } catch (err) {
        console.error("Error fetching noticias:", err);
      } finally {
        setLoadingNoticias(false);
      }
    }
    fetchNoticias();
  }, []);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta noticia?")) return;

    try {
      await fetch(`/api/noticias/${id}`, { method: "DELETE" });
      setNoticias((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error eliminando noticia:", err);
    }
  };

  if (userLoading || loadingNoticias) {
    return <p className="text-center mt-10">Cargando noticias...</p>;
  }

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col items-center px-0 pb-10 box-border font-inter">
      
      {/* Header + botón agregar */}
      {/* Headings */}
      <div className="w-[1103px] h-[86px] flex flex-col items-start text-[36px]">
        <div className="relative leading-10 font-extrabold text-black">Gestión Noticias</div>
        <div className="w-[14px] h-[14px] relative opacity-0 text-xs"></div>
        <div className="w-[615px] relative text-left text-base leading-6 inline-block">
          Gestiona las noticias creadas o crea una nueva.
        </div>

       {/* Botón solo para admin/SuperAdmin */}
        {(user?.rol === "admin" || user?.rol === "superAdmin") && (
          <Link
            href="/noticias/crear"
            className="absolute top-5 right-20 shadow-md rounded-sm bg-[#f8faff] border border-[#e0e0e0] h-8 px-3 flex items-center justify-center cursor-pointer text-sm text-black font-semibold hover:bg-[#eef2ff]"
          >
            + Agregar
          </Link>
        )}
      </div>

      {/* Grid de noticias */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 w-[1100px] pt-[15px]">
        {noticias.map((noticia) => (
          <div
            key={noticia.id}
            className="w-full flex items-center justify-between p-6 bg-white border border-[#e1e4ed] rounded-lg shadow-sm relative hover:shadow-md transition"
          >
            {/* Título */}
            <div className="text-lg font-semibold text-black">{noticia.titulo}</div>

            {/* Botones de editar/eliminar */}
            {(user?.rol === "admin" || user?.rol === "superAdmin") && (
              <MenuAcciones noticiaId={noticia.id} onEliminar={handleEliminar} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
