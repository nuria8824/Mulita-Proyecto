"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/queries";
import MenuAccionesProductos from "@/components/ui/tienda/MenuAccionesProductos";

interface Producto {
  id: number;
  nombre: string;
}

export default function GestionproductosPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  // Traer productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("/api/productos");
        const data = await res.json();
        const productosArray = Array.isArray(data) ? data : (data?.productos || []);
        setProductos(productosArray.reverse()); // Las más recientes primero
      } catch (err) {
        console.error("Error fetching productos:", err);
        setProductos([]);
      } finally {
        setLoadingProductos(false);
      }
    };
    fetchProductos();
  }, []);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta producto?")) return;
    try {
      await fetch(`/api/productos/${id}`, { method: "DELETE" });
      setProductos((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  if (isUserLoading || loadingProductos) {
    return <p className="text-center mt-10">Cargando productos...</p>;
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex flex-col items-center px-4 sm:px-6 pb-10 box-border font-inter">
      {/* Header + botón agregar */}
      <div className="w-full max-w-[1103px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <div className="flex flex-col text-[28px] sm:text-[32px] md:text-[36px]">
          <h1 className="leading-tight font-extrabold text-black">
            Gestión productos
          </h1>
          <p className="mt-2 text-left text-sm sm:text-base leading-6 text-[#6d758f]">
            Gestiona las productos creadas o crea una nueva.
          </p>
        </div>

        {(user?.rol === "admin" || user?.rol === "superAdmin") && (
          <Link
            href="/productos/crear"
            className="shadow-md rounded-md bg-[#f8faff] border border-[#e0e0e0] py-2 px-4 text-sm text-black font-semibold hover:bg-[#eef2ff] transition self-start sm:self-auto"
          >
            + Agregar
          </Link>
        )}
      </div>

      {/* Lista de productos */}
      <div className="flex-1 w-full max-w-[1100px] mt-6 flex flex-col gap-4">
        {productos.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No hay productos disponibles.
          </p>
        ) : (
          productos.map((producto) => (
            <div
              key={producto.id}
              className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 bg-white border border-[#e1e4ed] rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="text-base sm:text-lg font-semibold text-black break-words">
                {producto.nombre}
              </div>

              {(user?.rol === "admin" || user?.rol === "superAdmin") && (
                <div className="self-end sm:self-auto">
                  <MenuAccionesProductos
                    productoId={producto.id}
                    onEliminar={handleEliminar}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
