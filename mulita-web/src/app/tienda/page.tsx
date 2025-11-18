"use client";

import { useEffect, useState } from "react";
import Productos from "@/components/ui/tienda/Productos";

export default function TiendaPage() {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const fetchProductos = async () => {
    const res = await fetch(`/api/productos?page=${page}&limit=${limit}`);
    const data = await res.json();

    setProductos(data.productos);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchProductos();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Productos productos={productos} />

      {/* Paginación */}
      <div className="flex justify-center gap-4 my-10">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-lg font-medium">
          {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Siguiente
        </button>

      </div>
    </div>
  );
}
