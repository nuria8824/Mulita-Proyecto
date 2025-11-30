"use client";

import React, { useState, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import PhoneInputWithCountry from "@/components/PhoneInputWithCountry";

export default function RegisterPage() {
  const [esDocente, setEsDocente] = useState(false);
  const [loading, setLoading] = useState(false);
  const [telefono, setTelefono] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const onContinuarClick = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const rol: "usuario" | "docente" = esDocente ? "docente" : "usuario";

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre")?.toString() ?? "";
    const apellido = formData.get("apellido")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const contrasena = formData.get("contrasena")?.toString() ?? "";
    
    // Validar nombre - no debe contener números
    if (/\d/.test(nombre)) {
      toast.error("El nombre no puede contener números");
      setLoading(false);
      return;
    }

    // Validar apellido - no debe contener números
    if (/\d/.test(apellido)) {
      toast.error("El apellido no puede contener números");
      setLoading(false);
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("El email no es válido");
      setLoading(false);
      return;
    }

    // Validar teléfono - debe tener mínimo 7 y máximo 30 dígitos
    const phoneDigits = telefono.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      toast.error("El teléfono es muy corto");
      setLoading(false);
      return;
    }
    if (phoneDigits.length > 30) {
      toast.error("El teléfono no puede tener más de 30 dígitos");
      setLoading(false);
      return;
    }

    // Validar contraseña - debe tener mínimo 6 caracteres
    if (contrasena.length < 6) {
      toast.error("La contraseña es muy corta");
      setLoading(false);
      return;
    }

    const data = {
      nombre,
      apellido,
      email,
      telefono,
      contrasena,
      rol,
      institucion: formData.get("institucion")?.toString() ?? "",
      pais: formData.get("pais")?.toString() ?? "",
      provincia: formData.get("provincia")?.toString() ?? "",
      ciudad: formData.get("ciudad")?.toString() ?? "",
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json();

      if (!result.success) throw new Error(result.message || "Error al registrar usuario");

      toast.success("Usuario registrado. Revisa tu email para confirmar tu cuenta.");

      formRef.current?.reset();
      setEsDocente(false);
      setTelefono("");
    } catch (err: any) {
      console.error(err);
      toast.error("Error al registrar usuario: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [esDocente, telefono]);

  const inputClass =
    "w-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-lg border border-gray-300 h-10 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600";

  const buttonClass =
    "w-full bg-[#003c71] text-white rounded-lg h-10 flex items-center justify-center cursor-pointer hover:bg-blue-800";

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4">
      <form
        ref={formRef}
        className="w-full max-w-md flex flex-col gap-6"
        onSubmit={onContinuarClick}
      >
        {/* Títulos */}
        <div className="flex flex-col items-center gap-1 text-center text-black">
          <h1 className="text-2xl font-semibold">Crea una cuenta</h1>
          <p className="text-base text-[#003c71]">Introduce tus datos</p>
        </div>

        {/* Formulario */}
        <div className="flex flex-col gap-4 text-left text-lg">
          <input name="nombre" type="text" placeholder="Nombre" className={inputClass} required />
          <input name="apellido" type="text" placeholder="Apellido" className={inputClass} required />
          <input name="email" type="email" placeholder="Email" className={inputClass} required />
          <PhoneInputWithCountry
            value={telefono}
            onChange={(value) => setTelefono(value)}
            placeholder="Teléfono"
          />
          <input name="contrasena" type="password" placeholder="Contraseña" className={inputClass} required />

          <label className="flex items-center gap-2 cursor-pointer">
            <span>Docente:</span>
            <input
              type="checkbox"
              name="docente"
              className="w-5 h-5"
              checked={esDocente}
              onChange={() => setEsDocente(!esDocente)}
            />
          </label>

          {esDocente && (
            <>
              <input name="pais" type="text" placeholder="País" className={inputClass} />
              <input name="provincia" type="text" placeholder="Provincia" className={inputClass} />
              <input name="ciudad" type="text" placeholder="Ciudad" className={inputClass} />
              <input name="institucion" type="text" placeholder="Institución" className={inputClass} />
            </>
          )}

          <button type="submit" className={buttonClass} disabled={loading}>
            {loading ? "Enviando..." : "Continuar"}
          </button>
        </div>

        <p className="text-sm">
          Al hacer clic en continuar, acepta nuestros{" "}
          <span className="text-black font-semibold">Términos de servicio y Política de privacidad</span>.
        </p>
      </form>
    </div>
  );
}
