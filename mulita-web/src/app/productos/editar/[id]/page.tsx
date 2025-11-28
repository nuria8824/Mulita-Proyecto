"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { uploadFile } from "@/lib/subirArchivos";
import { toast } from "react-hot-toast"

interface ArchivoExistente {
  archivo_url: string;
  nombre: string;
  eliminado?: boolean;
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


export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  const [archivosNuevos, setArchivosNuevos] = useState<File[]>([]);
  const [archivosExistentes, setArchivosExistentes] = useState<ArchivoExistente[]>([]);
  const [loading, setLoading] = useState(true);
  const [errores, setErrores] = useState<ErroresFormulario>({});

  // Cargar datos iniciales
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`/api/productos/${params.id}`, { credentials: "include" });
        const data = await res.json();

        if (!res.ok) {
          console.error("Error:", data.error);
          alert("No se pudo cargar el producto.");
          router.push("/dashboard/gestionLanding/gestionProductos");
          return;
        }

        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setPrecio(String(data.precio));
        setArchivosExistentes(
          (data.producto_archivos || []).map((a: any) => ({
            archivo_url: a.archivo_url,
            nombre: a.archivo_url.split("/").pop(),
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [params.id, router]);

  // Manejo de archivos
  const handleArchivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevos = e.target.files ? Array.from(e.target.files) : [];
    setArchivosNuevos((prev) => [...prev, ...nuevos]);
  };

  const handleEliminarArchivoNuevo = (index: number) => {
    setArchivosNuevos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEliminarArchivoExistente = (nombre: string) => {
    setArchivosExistentes((prev) =>
      prev.map((a) => (a.nombre === nombre ? { ...a, eliminado: true } : a))
    );
  };

  function sanitizeFileName(fileName: string) {
    return fileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.\-_]/g, "_");
  }

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: ErroresFormulario = {};
    if (!nombre.trim()) nuevosErrores.nombre = "Debes completar el nombre.";
    if (!descripcion.trim()) nuevosErrores.descripcion = "Debes completar la descripción.";
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0)
      nuevosErrores.precio = "Ingresa un precio válido.";
    if (archivosExistentes.filter((a) => !a.eliminado).length + archivosNuevos.length === 0) {
      nuevosErrores.imagenes = "Debes agregar al menos una imagen.";
    } else if (archivosNuevos.some((img) => !img.type.startsWith("image/"))) {
      nuevosErrores.imagenes = "Todos los archivos deben ser imágenes (JPG, PNG, WEBP, etc.).";
    }
      
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const urlsExistentes = archivosExistentes
      .filter((a) => !a.eliminado)
      .map((a) => a.archivo_url);

    try {
      const archivosSubidos: ArchivoSubido[] = [];
      
      for (const archivo of archivosNuevos) {
        try {
          const sanitizedFileName = sanitizeFileName(archivo.name);
          const filePath = `productos/imagenes/${Date.now()}_${sanitizedFileName}`;
          
          // Subir archivo usando la función uploadFile
          const url = await uploadFile(archivo, filePath);
          
          archivosSubidos.push({
            url,
            name: archivo.name,
            type: archivo.type,
          });
        } catch (error) {
          console.error(`Error subiendo ${archivo.name}:`, error);
        }
      }
      const res = await fetch(`/api/productos/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio,
          archivosNuevos: archivosSubidos,
          archivosExistentes: urlsExistentes,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error);
        toast.error("Error al actualizar el producto");
        return;
      }

      toast.success("Producto actualizado exitosamente")
      router.push("/dashboard/gestionLanding/gestionProductos");
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando el producto");
    }
  };

  const handleCancel = () => router.push("/dashboard/gestionLanding/gestionProductos");

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center text-[#003c71]">
        Cargando producto...
      </div>
    );

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold text-black">Editar Producto</h1>
          <p className="text-base text-[#003c71]">Modifica los datos del producto</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          {/* Nombre */}
          <div>
            <label className="block text-lg font-semibold mb-2">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full border rounded-md px-4 py-2 ${
                errores.nombre ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nombre del producto"
            />
            {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-lg font-semibold mb-2">Descripción *</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={`w-full border rounded-md px-4 py-2 h-36 resize-none ${
                errores.descripcion ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Descripción"
            />
            {errores.descripcion && (
              <p className="text-red-500 text-sm">{errores.descripcion}</p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-lg font-semibold mb-2">Precio *</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className={`w-full border rounded-md px-4 py-2 ${
                errores.precio ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Precio"
            />
            {errores.precio && <p className="text-red-500 text-sm">{errores.precio}</p>}
          </div>

          {/* Archivos existentes */}
          {archivosExistentes.some((a) => !a.eliminado) && (
            <div>
              <label className="block text-lg font-semibold mb-2">Imágenes actuales</label>
              <ul className="space-y-1 text-sm">
                {archivosExistentes
                  .filter((a) => !a.eliminado)
                  .map((archivo) => (
                    <li
                      key={archivo.nombre}
                      className="flex justify-between items-center border rounded-md px-3 py-1 bg-gray-50"
                    >
                      <a href={archivo.archivo_url} target="_blank" className="text-blue-600">
                        {archivo.nombre}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleEliminarArchivoExistente(archivo.nombre)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Nuevas imágenes */}
          <div>
            <label className="block text-lg font-semibold mb-2">Agregar nuevas imágenes</label>

            <label className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
              <span className="text-gray-500">Sube una o varias imágenes</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleArchivosChange} />
            </label>

            {errores.imagenes && (
              <p className="text-red-500 text-sm mt-2">{errores.imagenes}</p>
            )}

            {archivosNuevos.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {archivosNuevos.map((archivo, index) => (
                  <li key={index} className="flex justify-between items-center border px-3 py-1 bg-gray-50">
                    {archivo.name}
                    <button
                      type="button"
                      onClick={() => handleEliminarArchivoNuevo(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
            >
              Guardar cambios
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-200 rounded-md py-2 hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
