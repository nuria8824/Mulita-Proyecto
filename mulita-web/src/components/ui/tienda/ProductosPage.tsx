"use client";

import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Heart } from "lucide-react";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  stock: number;
}

export function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("disponible", true);

        if (error) throw error;
        setProductos(data || []);
      } catch (err) {
        console.error("Error fetching productos:", err);
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tienda</h1>
        <p className="text-gray-600 mb-8">{productos.length} productos disponibles</p>

        {productos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {/* Imagen */}
                {producto.imagen && (
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                    />
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:shadow-md transition">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                )}

                {/* Contenido */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  {producto.descripcion && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {producto.descripcion}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-2xl font-bold text-blue-600">
                        ${producto.precio.toLocaleString("es-AR")}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          producto.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {producto.stock > 0 ? `${producto.stock} en stock` : "Sin stock"}
                      </p>
                    </div>

                    {producto.stock > 0 && (
                      <AddToCartButton
                        productoId={producto.id}
                        nombre={producto.nombre}
                        precio={producto.precio}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
