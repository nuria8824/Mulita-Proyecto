import { supabase } from "@/lib/supabase";

interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  contrasena: string;
  rol: "usuario" | "docente";
  institucion?: string;
  pais?: string;
  provincia?: string;
  ciudad?: string;
}

export const registerUser = async (data: RegisterData) => {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.contrasena,
    options: {
      // redirect URL que el usuario verá después de confirmar
      emailRedirectTo: `${window.location.origin}/auth/confirm`
    },
  });

  if (error) throw error;

  // Guardamos temporalmente los datos en localStorage
  localStorage.setItem("pendingUser", JSON.stringify(data));

  return authData.user;
};
