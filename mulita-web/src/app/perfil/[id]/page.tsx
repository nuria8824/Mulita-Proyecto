"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

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
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);
      const res = await fetch(`/api/perfil/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPerfil(data.perfil);
      }
      setLoading(false);
    };

    fetchPerfil();
  }, [id]);

  if (loading) return <div className="text-center py-20">Cargando...</div>;
  if (!perfil) return <div className="text-center py-20">Perfil no encontrado</div>;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center text-center text-gray-600 font-inter">
      <div className="flex items-center justify-center gap-10 p-16 text-left w-full max-w-6xl">
        <Image
          src={perfil.imagen || "/default-avatar.png"}
          alt={`${perfil.usuario.nombre} ${perfil.usuario.apellido}`}
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
        <div className="flex-1 flex flex-col items-center gap-3">
          <b className="text-2xl">{perfil.usuario.nombre} {perfil.usuario.apellido}</b>
          <div className="text-base">{perfil.biografia}</div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            className="w-40 px-3 py-2 rounded border border-yellow-400 text-yellow-600"
          >
            Cerrar sesión
          </button>
          <button
            className="w-40 px-3 py-2 rounded bg-blue-900 text-white"
          >
            Editar perfil
          </button>
        </div>
      </div>

      {/* Badges / actividades */}
      <div className="w-full max-w-4xl flex justify-between items-center py-8 text-white text-2xl font-bold">
        <div>Mis Actividades</div>
        <div>Favoritos</div>
        <div className="bg-blue-900 px-4 py-2 rounded">Colecciones</div>
        <div className="border border-yellow-400 px-4 py-2 rounded text-yellow-600 cursor-pointer">
          Nueva colección
        </div>
      </div>

      {/* Cards de ejemplo */}
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="w-[500px] h-40 bg-white border shadow rounded flex flex-col p-6 cursor-pointer">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Jan 22, 2024</span>
            <span>24</span>
          </div>
          <div className="text-blue-900 font-semibold text-xl mt-2">Actividades de Física</div>
        </div>

        <div className="w-[500px] h-40 bg-white border shadow rounded flex flex-col p-6 cursor-pointer">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Jan 22, 2024</span>
            <span>24</span>
          </div>
          <div className="text-blue-900 font-semibold text-xl mt-2">Ideas de actividades de Programación 💻</div>
        </div>
      </div>
    </div>
  );
}
