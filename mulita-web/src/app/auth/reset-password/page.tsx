"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const onResetClick = async () => {
    if (!email) {
      toast.error("Por favor ingresa tu email");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClientSupabase();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password-confirm`,
      });

      if (error) {
        toast.error(error.message || "Error al enviar el email");
        setLoading(false);
        return;
      }

      setSent(true);
      toast.success("Email de recuperación enviado");
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

  if (sent) {
    return (
      <div className="w-full bg-white flex flex-col items-center justify-start font-Inter text-base text-black pt-24 pb-6">
        <div className="w-96 flex flex-col items-center justify-start gap-6">
          <div className="flex flex-col items-center gap-1 text-center text-black">
            <h1 className="text-2xl font-semibold leading-[150%] tracking-tight">
              Email Enviado
            </h1>
            <p className="text-base text-[#003c71] leading-[150%]">
              Hemos enviado un email a <strong>{email}</strong> con instrucciones para recuperar tu contraseña
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
            <p className="text-sm text-gray-700">
              Por favor revisa tu correo (incluyendo la carpeta de spam) y haz clic en el enlace para cambiar tu contraseña.
            </p>
          </div>

          <div className="w-full">
            <Link
              href="/auth/login"
              className={`${buttonClass} text-center no-underline`}
            >
              <span className="font-medium text-white leading-[150%]">
                Volver a Iniciar Sesión
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col items-center justify-start font-Inter text-base text-black pt-24 pb-6">
      <div className="w-96 flex flex-col items-center justify-start gap-6">
        <div className="flex flex-col items-center gap-1 text-center text-black">
          <h1 className="text-2xl font-semibold leading-[150%] tracking-tight">
            Recuperar Contraseña
          </h1>
          <p className="text-base text-[#003c71] leading-[150%]">
            Ingresa tu email para recuperar tu contraseña
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full text-[#003c71]">
          <label className="inline-block w-52 font-bold">Correo electrónico</label>
          <input
            type="email"
            placeholder="usuario@mulita.com"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="w-full">
          <button
            type="button"
            className={buttonClass}
            onClick={onResetClick}
            disabled={!email || loading}
          >
            <span className="font-medium text-white leading-[150%]">
              {loading ? "Enviando..." : "Enviar Email"}
            </span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya recuerdas tu contraseña?{" "}
            <Link href="/auth/login" className="text-[#003c71] font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
