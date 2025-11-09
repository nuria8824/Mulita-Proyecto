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

interface Actividad {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  actividad_archivos?: { archivo_url: string; tipo: string; nombre: string }[];
  actividad_categoria?: { categoria: { nombre: string } }[];
}

export default function PerfilPage() {
  const { id } = useParams();
  const { user, logout } = useUser();
  const router = useRouter();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loadingActividades, setLoadingActividades] = useState(false);
  const [vista, setVista] = useState<"colecciones" | "actividades">("colecciones");

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

  useEffect(() => {
    const fetchActividades = async () => {
      if (vista !== "actividades") return;
      try {
        setLoadingActividades(true);
        const res = await fetch(`/api/perfil/${id}/actividades`);
        if (!res.ok) throw new Error("Error al obtener actividades");
        const data = await res.json();
        setActividades(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingActividades(false);
      }
    };

    fetchActividades();
  }, [vista, id]);

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
            className={`w-full h-full object-cover ${
              !perfil.imagen ? "scale-50" : ""
            }`}
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
              onClick={() =>
                router.push(`/perfil/editar/${perfil.usuario.id}`)
              }
              className="w-[160px] rounded-lg bg-[#003c71] text-white flex items-center justify-center py-3 cursor-pointer"
            >
              <span className="leading-6 font-medium">Editar perfil</span>
            </button>
          </div>
        )}

        {/* Línea divisoria */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200" />
      </div>

      {/* Menú de secciones */}
      <div className="w-full max-w-[1200px] flex justify-end py-8 pr-[90px] text-left text-4xl text-white font-extrabold">
        <div className="flex items-center gap-4 text-center text-base text-[#6d758f]">
          <div
            onClick={() => setVista("actividades")}
            className={`shadow-sm rounded border px-3 py-2 cursor-pointer ${
              vista === "actividades"
                ? "bg-[#003c71] text-white border-[#003c71]"
                : "bg-[#f8faff] border-[#f1f3f7] text-[#003c71]"
            }`}
          >
            <span className="font-semibold">Actividades</span>
          </div>

          <div
            onClick={() => setVista("colecciones")}
            className={`shadow-sm rounded border px-3 py-2 cursor-pointer ${
              vista === "colecciones"
                ? "bg-[#003c71] text-white border-[#003c71]"
                : "bg-[#f8faff] border-[#f1f3f7] text-[#003c71]"
            }`}
          >
            <span className="font-semibold">Colecciones</span>
          </div>

          {esPropietario && (
            <div className="rounded border border-[#fedd00] px-3 py-2 text-[#003c71] cursor-pointer">
              <span className="font-semibold">Nueva colección</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido dinámico */}
      {vista === "actividades" ? (
        <div className="flex flex-wrap justify-center gap-6 py-1">
          {loadingActividades ? (
            <div className="text-gray-500">Cargando actividades...</div>
          ) : actividades.length > 0 ? (
            actividades.map((actividad) => (
              <div
                key={actividad.id}
                className="w-[500px] h-[156px] shadow-sm border border-[#e1e4ed] rounded-lg bg-white flex flex-col justify-center relative p-6 text-left cursor-pointer hover:shadow-md transition"
              >
                <div className="flex flex-col justify-between h-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#6d758f]">
                      {new Date(actividad.fecha).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <img
                      src="/menu-icon.svg"
                      alt="menu"
                      className="cursor-pointer w-6 h-6"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#003c71]">
                    {actividad.titulo}
                  </h3>
                  <p className="text-sm text-[#6d758f] line-clamp-2">
                    {actividad.descripcion}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">Este usuario no tiene actividades.</div>
          )}
        </div>
      ) : (
        // vista "colecciones"
        <div className="flex flex-wrap justify-center gap-6 py-1">
          <div className="text-gray-500 italic">
            Aquí irán las colecciones del usuario...
          </div>
        </div>
      )}
    </div>
  );
}
