"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/subirArchivos";
import { toast } from "react-hot-toast";

interface MiembroEquipo {
  nombre: string;
  rol: string;
  imagen: File | string | null;
}

interface ErroresMiembro {
  nombre?: string;
  rol?: string;
  imagen?: string;
}

export default function GestionQuienesSomosPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [equipo, setEquipo] = useState<MiembroEquipo[]>([]);
  const [erroresMiembros, setErroresMiembros] = useState<ErroresMiembro[]>([]);
  const [erroresGenerales, setErroresGenerales] = useState<{ titulo?: string; descripcion?: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuienesSomos = async () => {
      try {
        const res = await fetch("/api/sobreNosotros/quienesSomos");
        if (!res.ok) throw new Error("No se pudo obtener la información");
        const data = await res.json();

        setTitulo(data.titulo || "");
        setDescripcion(data.descripcion || "");
        setEquipo(data.equipo?.map((m: any) => ({
          nombre: m.nombre || "",
          rol: m.rol || "",
          imagen: m.imagen || null
        })) || []);
        setErroresMiembros((data.equipo || []).map(() => ({})));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuienesSomos();
  }, []);

  const sanitizeFileName = (fileName: string) =>
    fileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.\-_]/g, "_");

  const handleMiembroChange = (index: number, field: keyof MiembroEquipo, value: string | File | null) => {
    const nuevoEquipo = [...equipo];
    nuevoEquipo[index] = { ...nuevoEquipo[index], [field]: value };
    setEquipo(nuevoEquipo);

    // Limpiar el error del campo específico
    const nuevosErrores = [...erroresMiembros];
    if (nuevosErrores[index]?.[field]) {
      nuevosErrores[index] = { ...nuevosErrores[index], [field]: undefined };
      setErroresMiembros(nuevosErrores);
    }
  };

  // Limpiar errores de título y descripción al escribir
  const handleTituloChange = (value: string) => {
    setTitulo(value);
    if (erroresGenerales.titulo) {
      setErroresGenerales({ ...erroresGenerales, titulo: undefined });
    }
  };

  const handleDescripcionChange = (value: string) => {
    setDescripcion(value);
    if (erroresGenerales.descripcion) {
      setErroresGenerales({ ...erroresGenerales, descripcion: undefined });
    }
  };

  const agregarMiembro = () => {
    setEquipo([...equipo, { nombre: "", rol: "", imagen: null }]);
    setErroresMiembros([...erroresMiembros, {}]);
  };

  const eliminarMiembro = (index: number) => {
    setEquipo(equipo.filter((_, i) => i !== index));
    setErroresMiembros(erroresMiembros.filter((_, i) => i !== index));
  };

  const validarFormulario = () => {
    let valido = true;
    const errores: ErroresMiembro[] = [];
    const erroresGen: { titulo?: string; descripcion?: string } = {};

    if (!titulo.trim()) {
      erroresGen.titulo = "El título principal es obligatorio";
      valido = false;
    }

    if (!descripcion.trim()) {
      erroresGen.descripcion = "La descripción principal es obligatoria";
      valido = false;
    }

    equipo.forEach((miembro, index) => {
      const error: ErroresMiembro = {};
      if (!miembro.nombre.trim()) {
        error.nombre = "Nombre obligatorio";
        valido = false;
      }
      if (!miembro.rol.trim()) {
        error.rol = "Rol obligatorio";
        valido = false;
      }
      if (!miembro.imagen) {
        error.imagen = "Imagen obligatoria";
        valido = false;
      }
      errores.push(error);
    });

    setErroresMiembros(errores);
    setErroresGenerales(erroresGen);

    return valido;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!validarFormulario()) {
      setSubmitting(false);
      return;
    }

    try {
      const equipoSubido: MiembroEquipo[] = [];

      for (let i = 0; i < equipo.length; i++) {
        const miembro = equipo[i];
        let imagenURL = "";

        if (miembro.imagen instanceof File) {
          const sanitizedFileName = sanitizeFileName(miembro.imagen.name);
          const filePath = `quienes_somos/miembros/${Date.now()}_${sanitizedFileName}`;
          imagenURL = await uploadFile(miembro.imagen, filePath);
        } else if (typeof miembro.imagen === "string") {
          imagenURL = miembro.imagen;
        }

        equipoSubido.push({ nombre: miembro.nombre, rol: miembro.rol, imagen: imagenURL });
      }

      const res = await fetch("/api/sobreNosotros/quienesSomos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descripcion,
          equipo: equipoSubido,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error actualizando Quiénes Somos");

      toast.success("Se actualizó correctamente");
      router.push("/dashboard/gestionLanding/gestionSobreNosotros");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar Quiénes Somos");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando datos...</p>;

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-black text-center">Gestión - ¿Quiénes Somos?</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {/* Título principal */}
          <div>
            <label className="block text-lg font-semibold mb-2">Título principal</label>
            <input
              aria-label="titulo"
              type="text"
              value={titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {erroresGenerales.titulo && <p className="text-red-500 text-sm">{erroresGenerales.titulo}</p>}
          </div>

          {/* Descripción principal */}
          <div>
            <label className="block text-lg font-semibold mb-2">Descripción principal</label>
            <textarea
              aria-label="descripcion"
              value={descripcion}
              onChange={(e) => handleDescripcionChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {erroresGenerales.descripcion && <p className="text-red-500 text-sm">{erroresGenerales.descripcion}</p>}
          </div>

          {/* Miembros del equipo */}
          <div className="border-t border-gray-300 pt-6 flex flex-col gap-6">
            <h2 className="text-xl font-semibold mb-4">Equipo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {equipo.map((miembro, index) => (
                <div key={index} className="border p-4 rounded-md relative">
                  <button
                    type="button"
                    onClick={() => eliminarMiembro(index)}
                    className="absolute top-0 right-2 text-4xl text-red-500 font-bold leading-none hover:text-red-800 transition"
                  >
                    ×
                  </button>

                  <label className="block text-lg font-semibold mb-2">Nombre</label>
                  <input
                    aria-label="nombre"
                    type="text"
                    value={miembro.nombre || ""}
                    onChange={(e) => handleMiembroChange(index, "nombre", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                  {erroresMiembros[index]?.nombre && <p className="text-red-500 text-sm">{erroresMiembros[index].nombre}</p>}

                  <label className="block text-lg font-semibold mt-4 mb-2">Rol</label>
                  <input
                    aria-label="rol"
                    type="text"
                    value={miembro.rol || ""}
                    onChange={(e) => handleMiembroChange(index, "rol", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                  {erroresMiembros[index]?.rol && <p className="text-red-500 text-sm">{erroresMiembros[index].rol}</p>}

                  {/* Imagen */}
                  <label className="block text-lg font-semibold mt-4 mb-2">Imagen</label>
                  <div className="flex flex-col gap-2">
                    {/* Previsualización */}
                    {miembro.imagen && typeof miembro.imagen === "string" && (
                      <div className="w-full h-64 md:h-72 lg:h-80 overflow-hidden rounded">
                        <img
                          src={miembro.imagen}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {miembro.imagen instanceof File && (
                      <div className="w-full h-64 md:h-72 lg:h-80 overflow-hidden rounded">
                        <img
                          src={URL.createObjectURL(miembro.imagen)}
                          alt={`Previsualización ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Input de archivo */}
                    <input
                      aria-label="imagen"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMiembroChange(index, "imagen", e.target.files?.[0] || null)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 cursor-pointer text-gray-600"
                    />
                  </div>
                  {erroresMiembros[index]?.imagen && (
                    <p className="text-red-500 text-sm">{erroresMiembros[index].imagen}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={agregarMiembro}
              className="w-full h-12 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition mt-4"
            >
              + Agregar miembro
            </button>
          </div>

          <div className="flex w-full gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/gestionLanding/gestionSobreNosotros")}
              className="w-1/2 h-12 bg-gray-300 text-[#003c71] font-semibold rounded-md shadow-md hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-1/2 h-12 bg-[#003c71] text-white font-semibold rounded-md shadow-md hover:bg-[#00264d] transition"
            >
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
