"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Categoria {
  id: string;
  nombre: string;
}

interface CategoriasPorTipo {
  materias: Categoria[];
  grados: Categoria[];
  dificultades: Categoria[];
}

interface ErroresFormulario {
  titulo?: string;
  descripcion?: string;
  categorias?: string;
}

interface CategoriasSeleccionadas {
  materia?: string;
  grado?: string;
  dificultad?: string;
}

export default function CrearActividadPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);
  const [categorias, setCategorias] = useState<CategoriasPorTipo>({
    materias: [],
    grados: [],
    dificultades: [],
  });
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] =
    useState<CategoriasSeleccionadas>({});
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [errores, setErrores] = useState<ErroresFormulario>({});

  // 🔹 Cargar categorías desde el endpoint
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("/api/categorias", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al cargar categorías");
        setCategorias(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      } finally {
        setCargandoCategorias(false);
      }
    };
    fetchCategorias();
  }, []);

  // 🔹 Seleccionar categoría única por tipo
  const handleCategoriaChange = (tipo: keyof CategoriasSeleccionadas, id: string) => {
    setCategoriasSeleccionadas((prev) => ({
      ...prev,
      [tipo]: prev[tipo] === id ? undefined : id,
    }));
  };

  // 🔹 Manejo de archivos
  const handleArchivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevosArchivos = e.target.files ? Array.from(e.target.files) : [];
    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };

  const handleEliminarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: ErroresFormulario = {};
    if (!titulo.trim()) nuevosErrores.titulo = "Debes completar el título.";
    if (!descripcion.trim()) nuevosErrores.descripcion = "Debes completar la descripción.";
    if (
      !categoriasSeleccionadas.materia ||
      !categoriasSeleccionadas.grado ||
      !categoriasSeleccionadas.dificultad
    ) {
      nuevosErrores.categorias =
        "Debes seleccionar una materia, un grado y una dificultad.";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("categoria_materia", categoriasSeleccionadas.materia!);
    formData.append("categoria_grado", categoriasSeleccionadas.grado!);
    formData.append("categoria_dificultad", categoriasSeleccionadas.dificultad!);
    archivos.forEach((archivo) => formData.append("archivos", archivo));

    try {
      const res = await fetch("/api/comunidad/actividades", {
        method: "POST",
        body: formData,
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

  // 🔹 Componente reutilizable para cada grupo de categorías
  const CategoriaGrupo = ({
    titulo,
    tipo,
    lista,
  }: {
    titulo: string;
    tipo: keyof CategoriasSeleccionadas;
    lista: Categoria[];
  }) => (
    <div>
      <h3 className="text-md font-semibold text-gray-700 mb-2">{titulo}</h3>
      {lista.length === 0 ? (
        <p className="text-gray-500 text-sm mb-3">No hay categorías de este tipo.</p>
      ) : (
        <div className="flex flex-wrap gap-3 mb-4">
          {lista.map((cat) => (
            <label
              key={cat.id}
              className={`flex items-center gap-2 border px-4 py-2 rounded-md cursor-pointer transition ${
                categoriasSeleccionadas[tipo] === cat.id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name={tipo}
                checked={categoriasSeleccionadas[tipo] === cat.id}
                onChange={() => handleCategoriaChange(tipo, cat.id)}
                className="accent-blue-600"
              />
              {cat.nombre}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold text-black">Crear Nueva Actividad</h1>
          <p className="text-base text-[#003c71]">Introduce los datos</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          {/* 🔹 Título */}
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

          {/* 🔹 Descripción */}
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

          {/* 🔹 Categorías */}
          <div>
            <label className="block text-lg font-semibold mb-2">Categorías *</label>
            {cargandoCategorias ? (
              <p className="text-gray-500">Cargando categorías...</p>
            ) : (
              <>
                <CategoriaGrupo titulo="Materia" tipo="materia" lista={categorias.materias} />
                <CategoriaGrupo titulo="Grado" tipo="grado" lista={categorias.grados} />
                <CategoriaGrupo titulo="Dificultad" tipo="dificultad" lista={categorias.dificultades} />
              </>
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
              <input type="file" multiple className="hidden" onChange={handleArchivosChange} />
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