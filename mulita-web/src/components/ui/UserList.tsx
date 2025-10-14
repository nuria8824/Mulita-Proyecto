"use client";

import MenuAccionesUsuarios from "./MenuAccionesUsuarios";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  created_at: string;
  acceso_comunidad: boolean;
}

interface Props {
  usuarios: Usuario[];
  onUpdate: () => void;
}

export default function UserList({ usuarios, onUpdate }: Props) {
  if (!usuarios?.length) {
    return <p className="text-gray-500">No se encontraron usuarios.</p>;
  }

  return (
    <>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Apellido</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Creado</th>
            <th className="border p-2">Acceso Comunidad</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="text-center">
              <td className="border p-2">{u.nombre}</td>
              <td className="border p-2">{u.apellido}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.telefono}</td>
              <td className="border p-2">{u.rol}</td>
              <td className="border p-2">
                {new Date(u.created_at).toLocaleDateString()}
              </td>
              <td className="border p-2">
                {u.acceso_comunidad ? "Sí" : "No"}
              </td>
              <td className="border p-2">
                <MenuAccionesUsuarios user={u} onUpdate={onUpdate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
