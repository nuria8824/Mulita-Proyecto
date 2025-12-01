"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/subirArchivos";
import { toast } from "react-hot-toast"

interface TipoProducto {
  id: string;
  nombre: string;
}

interface ErroresFormulario {
  nombre?: string;
  descripcion?: string;
  precio?: string;
  imagenes?: string;
}

interface ArchivoSubido {
  url: string;
  name: string;
  type: string;
}

// Tipos de productos disponibles (sin usar tabla de categorías)
const TIPOS_PRODUCTOS: TipoProducto[] = [
  { id: "kit", nombre: "Kit" },
  { id: "pieza", nombre: "Pieza" },
  { id: "capacitacion", nombre: "Capacitación" }
];

export default function CrearProductoPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [errores, setErrores] = useState<ErroresFormulario>({});

  // Manejo de imagenes
  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevasImagenes = e.target.files ? Array.from(e.target.files) : [];
    setImagenes((prev) => [...prev, ...nuevasImagenes]);
  };

  const handleEliminarImagen = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  // Función para limpiar nombres de archivo
  function sanitizeFileName(fileName: string) {
    return fileName
      .normalize("NFD") // separa letras y acentos
      .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
      .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // reemplaza cualquier caracter no válido
  }

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: ErroresFormulario = {};
    if (!nombre.trim()) nuevosErrores.nombre = "Debes completar el título.";
    if (!descripcion.trim()) nuevosErrores.descripcion = "Debes completar la descripción.";
    if (!precio.trim()) {
      nuevosErrores.precio = "Debes completar el precio.";
    } else if (isNaN(Number(precio))){
      nuevosErrores.precio = "El precio debe ser un número válido.";
    } else if (Number(precio) <= 0) {
      nuevosErrores.precio = "El precio debe ser mayor que 0.";
    }
    if (imagenes.length === 0) {
      nuevosErrores.imagenes = "Debes subir al menos una imagen.";
    } else if (imagenes.some((img) => !img.type.startsWith("image/"))) {
      nuevosErrores.imagenes = "Todos los archivos deben ser imágenes (JPG, PNG, WEBP, etc.).";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      const archivosSubidos: ArchivoSubido[] = [];
      for (const imagen of imagenes) {
        try {
          const sanitizedFileName = sanitizeFileName(imagen.name);
          const filePath = `productos/imagenes/${Date.now()}_${sanitizedFileName}`;
                    
          // Subir archivo usando la función uploadFile
          const url = await uploadFile(imagen, filePath);
          
          archivosSubidos.push({
            url,
            name: imagen.name,
            type: imagen.type,
          });
        } catch (error) {
          console.error(`Error subiendo ${imagen.name}:`, error);
        }
      }

      const res = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio,
          imagenes: archivosSubidos,
          tipo_producto: tipoSeleccionado || null,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error.detail || error.message);
        toast.error("Error creando producto");
        return;
      }

      toast.success("Producto creado exitosamente");
      router.push("/dashboard/gestionLanding/gestionProductos");
    } catch (err) {
      console.error("Error en fetch:", err);
      toast.error("Error creando producto");
    }
  };

  const handleCancel = () => router.push("/dashboard/gestionLanding/gestionProductos");

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Encabezado */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold text-black">Crear Nuevo Producto</h1>
          <p className="text-base text-[#003c71]">Introduce los datos</p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          {/* Título */}
          <div>
            <label className="block text-lg font-semibold mb-2">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (errores.nombre) setErrores({ ...errores, nombre: undefined });
              }}
              className={`w-full border rounded-md shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.nombre ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Título"
            />
            {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-lg font-semibold mb-2">Descripción *</label>
            <textarea
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                if (errores.descripcion) setErrores({ ...errores, descripcion: undefined });
              }}
              className={`w-full border rounded-md shadow-sm px-4 py-2 h-36 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.descripcion ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Descripción"
            />
            {errores.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errores.descripcion}</p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-lg font-semibold mb-2">Precio *</label>
            <input
              type="text"
              value={precio}
              onChange={(e) => {
                const normalizado = e.target.value.replace(/,/g, '.');
                setPrecio(normalizado);
                if (errores.precio) setErrores({ ...errores, precio: undefined });
              }}
              className={`w-full border rounded-md shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.precio ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="1234.50"
            />
            {errores.precio && (
              <p className="text-red-500 text-sm mt-1">{errores.precio}</p>
            )}
          </div>

          {/* Tipo de Producto */}
          <div>
            <label className="block text-lg font-semibold mb-2">Tipo de Producto</label>
            <select
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Seleccionar tipo...</option>
              {TIPOS_PRODUCTOS.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Imagenes */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Imagenes *</label>

            <label className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition">
              <span className="text-gray-500">Sube una o varias imagenes</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImagenesChange}
              />
            </label>

            {errores.imagenes && (
              <p className="text-red-500 text-sm mt-1">{errores.imagenes}</p>
            )}

            {imagenes.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {imagenes.map((archivo, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border rounded-md px-3 py-1 bg-gray-50"
                  >
                    <span className="truncate">{archivo.name}</span>
                    <button
                      type="button"
                      onClick={() => handleEliminarImagen(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Botones */}
          <div className="flex w-full gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/2 h-12 bg-gray-300 text-[#003c71] font-semibold rounded-md shadow-md hover:bg-gray-400 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-1/2 h-12 bg-[#003c71] text-white font-semibold rounded-md shadow-md hover:bg-[#00264d] transition"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
