"use client";

import { useEffect, useState } from "react";
import ProductosWrapper from "@/components/ui/tienda/ProductosWrapper";

export default function TiendaPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const limit = 12;

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/productos?page=${page}&limit=${limit}`);
      const data = await res.json();

      setProductos(data?.productos || []);
      setTotal(data?.total || 0);
    } catch (err) {
      console.error("Error fetching productos:", err);
      setError("Error al cargar productos");
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4">
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#003c71]">Productos</h2>
        <p className="text-gray-500 max-w-xl mx-auto mt-4">
          Lorem ipsum dolor sit amet consectetur adipiscing elit tortor eu 
          egestas morbi sem vulputate etiam facilisis.
        </p>
      </div>

      {/* Productos con skeleton integrado */}
      <ProductosWrapper productos={productos} loading={loading} />

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
