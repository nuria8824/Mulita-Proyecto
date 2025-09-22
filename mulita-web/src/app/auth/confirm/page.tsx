"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ConfirmPage() {
  const [message, setMessage] = useState("Verificando tu cuenta...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmUser = async () => {
      try {
        // Revisamos si el usuario está logueado (confirmó el email)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!session?.user) {
          setMessage("No se pudo verificar tu cuenta. Intenta iniciar sesión después de confirmar el email.");
          setLoading(false);
          return;
        }

        // Recuperamos los datos guardados en localStorage
        const pending = localStorage.getItem("pendingUser");
        if (!pending) {
          setMessage("No hay datos pendientes de registro.");
          setLoading(false);
          return;
        }

        const userData = JSON.parse(pending);

        // Insertamos en la tabla usuario
        const { error: dbError } = await supabase
          .from("usuario")
          .insert({
            id: session.user.id,
            nombre: userData.nombre,
            apellido: userData.apellido,
            email: userData.email,
            telefono: userData.telefono,
            rol: userData.rol,
          });

        if (dbError) throw dbError;

        // Si es docente, insertamos en tabla docentes
        if (userData.rol === "docente") {
          const { error: docenteError } = await supabase
            .from("docentes")
            .insert({
              usuario_id: session.user.id,
              institucion: userData.institucion,
              pais: userData.pais,
              provincia: userData.provincia,
              ciudad: userData.ciudad,
            });
          if (docenteError) throw docenteError;
        }

        // Limpiamos localStorage
        localStorage.removeItem("pendingUser");

        setMessage("Registro completado correctamente. Redirigiendo...");
        setTimeout(() => window.location.href = "/", 2000);

      } catch (err: any) {
        console.error(err);
        setMessage("Ocurrió un error al completar el registro: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    confirmUser();
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">{loading ? "Procesando..." : "Confirmación"}</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}
