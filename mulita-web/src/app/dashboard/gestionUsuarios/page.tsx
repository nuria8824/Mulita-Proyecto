"use client";

import { useEffect, useState } from "react";
import UserList from "../../../components/ui/UserList";
import UserSearch from "../../../components/ui/UserSearch";
import Pagination from "../../../components/ui/Pagination";

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const fetchUsuarios = async () => {
    const res = await fetch(
      `/api/usuarios?page=${page}&limit=${limit}&search=${search}`
    );
    const data = await res.json();
    setUsuarios(data.usuarios);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchUsuarios();
  }, [page, search]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      <UserSearch search={search} setSearch={setSearch} />

      <UserList usuarios={usuarios} onUpdate={fetchUsuarios} />

      <Pagination
        page={page}
        setPage={setPage}
        total={total}
        limit={limit}
      />
    </div>
  );
}
