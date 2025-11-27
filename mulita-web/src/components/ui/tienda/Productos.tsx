"use client"

import { useState } from "react";
import ProductoModal from "./ProductoModal";
import { AddToCartButton } from "./carrito/AddToCartButton";
import CompraModal from "./CompraModal";

export type Archivo = { archivo_url: string };

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  eliminado: boolean;
  created_at: string;
  mostrar_en_inicio: boolean;
  producto_archivos: Archivo[];
};

export default function Productos({ productos }: { productos: Producto[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const [compraOpen, setCompraOpen] = useState(false);
  const [productoCompra, setProductoCompra] = useState<Producto | null>(null);

  const abrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setProductoSeleccionado(null);
  }
  
  const abrirModalCompra = (producto: Producto) => {
    setProductoCompra(producto);
    setCompraOpen(true);
  };
  
  if (productos.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto text-center py-12">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* GRID */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-light bg-card p-5 flex flex-col shadow-sm hover:shadow-lg transition cursor-pointer"
            onClick={() => abrirModal(p)}
          >
            {/* Imagen con precio encima */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              
              {/* Precio dentro de la imagen */}
              <span className="absolute top-3 right-3 bg-white text-[#003C71] font-bold px-3 py-1 rounded-md shadow-md z-10">
                ${p.precio}
              </span>

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

            {/* Contenido */}
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
              <button
                className="btn btn--blue flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  abrirModalCompra(p);
                }}
              >
                Comprar
              </button>

              <div onClick={(e) => e.stopPropagation()}>
                <AddToCartButton 
                  productoId={p.id}
                  nombre={p.nombre}
                  precio={p.precio}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE PRODUCTO */}
      <ProductoModal
        open={modalOpen}
        onClose={cerrarModal}
        producto={{
          id: productoSeleccionado?.id ?? "",
          nombre: productoSeleccionado?.nombre ?? "",
          descripcion: productoSeleccionado?.descripcion ?? "",
          precio: productoSeleccionado?.precio ?? 0,
          imagenes: productoSeleccionado?.producto_archivos?.map(a => a.archivo_url) ?? ["/placeholder.png"]
        }}
      />

      {/* MODAL DE COMPRA */}
      <CompraModal
        open={compraOpen}
        onClose={() => setCompraOpen(false)}
        producto={{
          id: productoCompra?.id ?? "",
          nombre: productoCompra?.nombre ?? "",
          precio: productoCompra?.precio ?? 0,
        }}
        onConfirm={(data) => {
          console.log("Datos listos para enviar:", data);
        }}
      />
    </div>
  );
}
