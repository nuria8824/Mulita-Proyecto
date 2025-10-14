"use client";

import { useState } from "react";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  acceso_comunidad: boolean;
}

interface Props {
  user: Usuario;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditPermissionsModal({ user, onClose, onUpdated }: Props) {
  const [permiso, setPermiso] = useState(user.acceso_comunidad);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch(`/api/usuarios/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acceso_comunidad: permiso }),
    });
    setLoading(false);

    if (res.ok) {
      alert("Permisos actualizados");
      onUpdated();
      onClose();
    } else {
      alert("Error al actualizar permisos");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center backdrop-blur-xs pointer-events-auto">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Editar permisos</h2>
        <p className="mb-2">
          Usuario: <span className="font-semibold">{user.nombre} {user.apellido}</span>
        </p>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={permiso}
            onChange={(e) => setPermiso(e.target.checked)}
          />
          Permitir acceso a la comunidad
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-3 py-1 rounded"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
