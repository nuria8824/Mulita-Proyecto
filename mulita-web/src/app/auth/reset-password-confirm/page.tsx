"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

export default function ResetPasswordConfirmPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Validar que el usuario tenga una sesión válida (desde el link del email)
    const validateSession = async () => {
      try {
        const supabase = createClientSupabase();
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          toast.error("Link expirado o inválido. Por favor solicita otro email de recuperación");
          setTimeout(() => router.push("/auth/reset-password"), 2000);
          return;
        }

        setIsValid(true);
      } catch (err) {
        console.error(err);
        toast.error("Error al validar el link");
        setTimeout(() => router.push("/auth/reset-password"), 2000);
      } finally {
        setValidating(false);
      }
    };

    validateSession();
  }, [router]);

  const onUpdateClick = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClientSupabase();
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast.error(error.message || "Error al cambiar la contraseña");
        setLoading(false);
        return;
      }

      toast.success("Contraseña actualizada correctamente");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-lg border border-gray-300 h-10 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600";

  const buttonClass =
    "w-full bg-[#003c71] text-white rounded-lg h-10 flex items-center justify-center cursor-pointer hover:bg-blue-800";

  if (validating) {
    return (
      <div className="w-full bg-white flex flex-col items-center justify-center font-Inter text-base text-black min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold mb-2">Validando...</h1>
          <p className="text-gray-600">Por favor espera mientras validamos tu solicitud</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return null; // El componente redirigirá automáticamente
  }

  return (
    <div className="w-full bg-white flex flex-col items-center justify-start font-Inter text-base text-black pt-24 pb-6">
      <div className="w-96 flex flex-col items-center justify-start gap-6">
        <div className="flex flex-col items-center gap-1 text-center text-black">
          <h1 className="text-2xl font-semibold leading-[150%] tracking-tight">
            Cambiar Contraseña
          </h1>
          <p className="text-base text-[#003c71] leading-[150%]">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full text-[#003c71]">
          <div>
            <label className="inline-block w-full font-bold mb-2">Nueva Contraseña</label>
            <input
              type="password"
              placeholder="Nueva contraseña"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="inline-block w-full font-bold mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="w-full">
          <button
            type="button"
            className={buttonClass}
            onClick={onUpdateClick}
            disabled={!newPassword || !confirmPassword || loading}
          >
            <span className="font-medium text-white leading-[150%]">
              {loading ? "Actualizando..." : "Cambiar Contraseña"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
