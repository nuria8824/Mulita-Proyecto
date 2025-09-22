"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface UserData {
  id: string;
  email: string;
}

export default function Perfil() {
  const {user, logout, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-6 shadow-xl text-center w-80">
          <h2 className="text-xl font-bold mb-4">
            Necesitas una cuenta para ver tu perfil
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-4">Perfil de Usuario</h1>
      <p>
        <span className="font-semibold">ID:</span> {user.id}
      </p>
      <p>
        <span className="font-semibold">Email:</span> {user.email}
      </p>
      <p>
        <span className="font-semibold">Nombre:</span> {user.nombre}
      </p>
      <p>
        <span className="font-semibold">Apellido:</span> {user.apellido}
      </p>

      <button
        onClick={async () => {
          await logout();
          router.push("/"); // redirige al home
        }}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
