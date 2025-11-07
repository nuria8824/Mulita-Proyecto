"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

interface Perfil {
  biografia: string;
  imagen: string;
  usuario: Usuario;
}

export default function PerfilPage() {
  const { id } = useParams();
  const { user, logout } = useUser();
  const router = useRouter();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/perfil/${id}`);
        if (!res.ok) throw new Error("Perfil no encontrado");
        const data = await res.json();
        setPerfil(data.perfil);
      } catch (err) {
        console.error(err);
        setPerfil(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Cargando perfil...
      </div>
    );

  if (!perfil)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Perfil no encontrado
      </div>
    );

  const esPropietario = user?.id === perfil.usuario.id;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center text-center text-xs text-[#6d758f] font-inter">
      {/* Sección superior */}
      <div className="w-full flex items-center justify-center gap-10 p-[60px_170px] relative text-left text-2xl text-black font-roboto">
        {/* Avatar */}
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
          <img
            src={perfil.imagen || "/images/icons/perfil/default-avatar.svg"}
            alt="Avatar"
            className={`w-full h-full object-cover ${!perfil.imagen ? "scale-50" : ""}`}
          />
        </div>

        {/* Info usuario */}
        <div className="flex-1 flex flex-col items-center gap-3">
          <b className="w-full leading-8 text-center text-black text-2xl">
            {perfil.usuario.nombre} {perfil.usuario.apellido}
          </b>
          <div className="w-full text-base leading-6 text-[#6d758f] text-center">
            {perfil.usuario.email}
          </div>
          {perfil.biografia && (
            <p className="text-sm max-w-xl text-[#6d758f] mt-2">
              {perfil.biografia}
            </p>
          )}
        </div>

        {/* Botones (solo si es su perfil) */}
        {esPropietario && (
          <div className="flex flex-col items-start gap-3 text-base text-[#003c71]">
            <button
              onClick={logout}
              className="w-[160px] rounded-lg border border-[#fedd00] flex items-center justify-center py-3 cursor-pointer"
            >
              <span className="leading-6 font-medium">Cerrar sesión</span>
            </button>

            <button
              onClick={() => router.push(`/perfil/editar/${perfil.usuario.id}`)}
              className="w-[160px] rounded-lg bg-[#003c71] text-white flex items-center justify-center py-3 cursor-pointer"
            >
              <span className="leading-6 font-medium">Editar perfil</span>
            </button>
          </div>
        )}

        {/* Línea divisoria */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200" />
      </div>

      {/* Secciones */}
      <div className="w-full max-w-[1200px] flex justify-end py-8 pr-[90px] text-left text-4xl text-white font-extrabold">
        <div className="flex items-center gap-4 text-center text-base text-[#6d758f]">
          <div className="shadow-sm rounded bg-[#f8faff] border border-[#f1f3f7] px-3 py-2 cursor-pointer">
            <span className="font-semibold text-[#003c71]">Mis Actividades</span>
          </div>

          <div className="shadow-sm rounded bg-[#f8faff] border border-[#f1f3f7] px-3 py-2 cursor-pointer">
            <span className="font-semibold text-[#003c71]">Favoritos</span>
          </div>

          <div className="rounded bg-[#003c71] px-3 py-2 text-white">
            <span className="font-semibold">Colecciones</span>
          </div>

          {esPropietario && (
            <div className="rounded border border-[#fedd00] px-3 py-2 text-[#003c71] cursor-pointer">
              <span className="font-semibold">Nueva colección</span>
            </div>
          )}
        </div>
      </div>

      {/* Cards de ejemplo */}
      <div className="flex flex-wrap justify-center gap-6 py-1">
        {[
          { titulo: "Actividades de Física", fecha: "Jan 22, 2024" },
          { titulo: "Ideas de Programación 💻", fecha: "Jan 22, 2024" },
          { titulo: "Matemática 🧮", fecha: "Jan 22, 2024" },
          { titulo: "Actividades de Robótica", fecha: "Jan 22, 2024" },
        ].map((card, i) => (
          <div
            key={i}
            className="w-[500px] h-[156px] shadow-sm border border-[#e1e4ed] rounded-lg bg-white flex flex-col justify-center relative p-6 text-left cursor-pointer hover:shadow-md transition"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#6d758f]">
                  {card.fecha}
                </span>
                <img
                  src="/menu-icon.svg"
                  alt="menu"
                  className="cursor-pointer w-6 h-6"
                />
              </div>
              <h3 className="text-2xl font-semibold text-[#003c71]">
                {card.titulo}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
