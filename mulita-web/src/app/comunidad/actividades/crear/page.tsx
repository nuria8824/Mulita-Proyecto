"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/subirArchivos";

interface Categoria {
  id: string;
  nombre: string;
}

interface ErroresFormulario {
  titulo?: string;
  descripcion?: string;
  categorias?: string;
}

interface ArchivoSubido {
  url: string;
  name: string;
  type: string;
}

export default function CrearActividadPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [errores, setErrores] = useState<ErroresFormulario>({});

  // Cargar categorías desde Supabase
  useEffect(() => {
    const fetchCategorias = async () => {
      const { data, error } = await supabase.from("categoria").select("id, nombre");
      if (!error && data) setCategorias(data);
      setCargandoCategorias(false);
    };
    fetchCategorias();
  }, []);

  const handleCategoriaChange = (id: string) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Manejo de archivos
  const handleArchivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevosArchivos = e.target.files ? Array.from(e.target.files) : [];
    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };

  const handleEliminarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
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
    if (!titulo.trim()) nuevosErrores.titulo = "Debes completar el título.";
    if (!descripcion.trim()) nuevosErrores.descripcion = "Debes completar la descripción.";
    if (categoriasSeleccionadas.length === 0)
      nuevosErrores.categorias = "Debes seleccionar al menos una categoría.";

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      // Subir archivos directamente a Supabase primero
      const archivosSubidos: ArchivoSubido[] = [];
      
      for (const archivo of archivos) {
        try {
          const sanitizedFileName = sanitizeFileName(archivo.name);
          const filePath = `comunidad/actividades/temp/${Date.now()}_${sanitizedFileName}`;
          
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
      
      // Enviar todos los datos en una sola llamada
      const res = await fetch("/api/comunidad/actividades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          categorias: categoriasSeleccionadas,
          archivos: archivosSubidos,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error.detail || error.message);
        alert("Error creando actividad");
        return;
      }

      router.push("/comunidad");
    } catch (err) {
      console.error("Error en fetch:", err);
      alert("Error creando actividad");
    }
  };

  const handleCancel = () => router.push("/comunidad");

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Encabezado */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold text-black">Crear Nueva Actividad</h1>
          <p className="text-base text-[#003c71]">Introduce los datos</p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          {/* Título */}
          <div>
            <label className="block text-lg font-semibold mb-2">Título *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                if (errores.titulo) setErrores({ ...errores, titulo: undefined });
              }}
              className={`w-full border rounded-md shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.titulo ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Título"
            />
            {errores.titulo && <p className="text-red-500 text-sm mt-1">{errores.titulo}</p>}
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

          {/* Categorías */}
          <div>
            <label className="block text-lg font-semibold mb-2">Categorías *</label>
            {cargandoCategorias ? (
              <p className="text-gray-500">Cargando categorías...</p>
            ) : categorias.length === 0 ? (
              <p className="text-gray-500">No hay categorías disponibles.</p>
            ) : (
              <div
                className={`flex flex-wrap gap-3 p-2 rounded-md border ${
                  errores.categorias ? "border-red-500" : "border-gray-200"
                }`}
              >
                {categorias.map((cat) => (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-2 border px-4 py-2 rounded-md cursor-pointer transition ${
                      categoriasSeleccionadas.includes(cat.id)
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={categoriasSeleccionadas.includes(cat.id)}
                      onChange={() => {
                        handleCategoriaChange(cat.id);
                        if (errores.categorias)
                          setErrores({ ...errores, categorias: undefined });
                      }}
                      className="accent-blue-600"
                    />
                    {cat.nombre}
                  </label>
                ))}
              </div>
            )}
            {errores.categorias && (
              <p className="text-red-500 text-sm mt-1">{errores.categorias}</p>
            )}
          </div>

          {/* Archivos */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Archivos (opcional)</label>

            <label className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition">
              <span className="text-gray-500">Sube uno o varios archivos</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleArchivosChange}
              />
            </label>

            {archivos.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {archivos.map((archivo, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border rounded-md px-3 py-1 bg-gray-50"
                  >
                    <span className="truncate">{archivo.name}</span>
                    <button
                      type="button"
                      onClick={() => handleEliminarArchivo(index)}
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
