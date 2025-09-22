"use client";

import Image from "next/image";
import Link from "next/link";
import { Producto } from "@/lib/types";

export function SeccionProductos() {
  const productos: Producto[] = [
    {
      id: 1,
      nombre: "Kit Educativo Mulita (completo)",
      descripcion: "Incluye chasis, ruedas, sensores, placa controladora y manual de actividades.",
      precio: "89.00",
      imagen: "/images/productos/kit-educativo.jpg",
    },
    {
      id: 2,
      nombre: "Piezas individuales (chasis, ruedas, etc.)",
      descripcion: "Compra piezas sueltas para reemplazar o ampliar tu kit Mulita.",
      precio: "Desde 5.00",
      imagen: "/images/productos/piezas-individuales.jpg",
    },
    {
      id: 3,
      nombre: "Sensores y accesorios compatibles",
      descripcion: "Sensores de distancia, luz, línea y más para proyectos avanzados.",
      precio: "39.00",
      imagen: "/images/productos/sensores-accesorios.jpg",
    },
    {
      id: 4,
      nombre: "Repuestos rápidos",
      descripcion: "Ruedas, motores y otros repuestos para mantener tu Mulita en marcha.",
      precio: "12.00",
      imagen: "/images/productos/repuestos.jpg",
    },
  ];

  return (
    <section className="mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">Productos Destacados</h2>
        <p className="text-center text-muted-foreground mt-2">
          Todo lo necesario para implementar Mulita en tu institución.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map((p) => (
            <div
              key={p.id}
              className="relative rounded-xl border border-light bg-card p-5 flex flex-col"
            >
              {/* Precio en esquina */}
              <span className="absolute top-3 right-3 bg-white text-[#003C71] font-bold px-3 py-1 rounded-md shadow-md">
                ${p.precio}
              </span>

              {/* Imagen */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                <Image
                  src={p.imagen}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-4 flex-1">
                <h3 className="font-semibold text-[#003C71]">{p.nombre}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.descripcion}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="btn btn--blue flex-1">Comprar</button>
                <button className="btn btn--outline flex-1">Carrito</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/tienda" className="btn btn--blue">
            Ver todos los productos
          </Link>
        </div>
      </div>
    </section>
  );
}
