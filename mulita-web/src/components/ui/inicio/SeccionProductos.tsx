"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductoModal from "../tienda/ProductoModal";
import { SkeletonProductos } from "./skeletons/SkeletonProductos";
import { fi } from "zod/locales";
import { set } from "zod";

export type Archivo = { archivo_url: string };

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  mostrar_en_inicio: boolean;
  producto_archivos: Archivo[];
};

export function SeccionProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [loadingProductos, setLoadingProductos] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoadingProductos(true);
      try {
        const res = await fetch("/api/inicio/productos");
        const data = await res.json();
        setProductos(data ?? []);
      } catch (err) {
        console.error("Error al obtener productos destacados:", err);
      } finally {
        setLoadingProductos(false);
      }
    };
    fetchProductos();
  }, []);

  if (loadingProductos) {
    return <SkeletonProductos />;
  }

  const abrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setProductoSeleccionado(null);
  }

  if (productos.length === 0) {
    return (
      <section className="mt-24 text-center">
        <p className="text-muted-foreground">
          No hay productos destacados por el momento.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#003c71]">Productos</h2>
          <p className="text-gray-500 max-w-xl mx-auto mt-4">
            Herramientas y recursos ideales para tu institución.
          </p>
        </div>

        {/* GRID */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,280px))] gap-6 justify-center">
          {productos.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-light bg-card p-5 flex flex-col shadow-sm hover:shadow-lg transition"
              onClick={() => abrirModal(p)}
            >
              {/* Imagen con precio encima */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                
                {/* Precio */}
                <span className="absolute top-3 right-3 bg-white text-[#003C71] font-bold px-3 py-1 rounded-md shadow-md z-10">
                  ${p.precio}
                </span>

                {/* Imagen */}
                {p.producto_archivos?.[0] ? (
                  <img
                    src={p.producto_archivos[0].archivo_url}
                    alt={p.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
              </div>

              {/* Texto */}
              <div className="mt-4 flex-1">
                <h3 className="font-semibold text-[#003C71] text-lg">
                  {p.nombre}
                </h3>

                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {p.descripcion}
                </p>
              </div>

              {/* Botones */}
              <div className="mt-4 flex gap-2">
                <button className="btn btn--blue flex-1">Comprar</button>
                <button className="btn btn--outline flex-1">Carrito</button>
              </div>
            </div>
          ))}
        </div>

        {/* Botón ver más */}
        <div className="mt-8 flex justify-center">
          <Link href="/tienda" className="btn btn--blue">
            Ver todos los productos
          </Link>
        </div>

        {/* MODAL DE PRODUCTO */}
        <ProductoModal
          open={modalOpen}
          onClose={cerrarModal}
          producto={{
            nombre: productoSeleccionado?.nombre ?? "",
            descripcion: productoSeleccionado?.descripcion ?? "",
            precio: productoSeleccionado?.precio ?? 0,
            imagenes: productoSeleccionado?.producto_archivos?.map(a => a.archivo_url) ?? ["/placeholder.png"]
          }}
        />
      </div>
    </section>
  );
}
