import { createClient } from "@supabase/supabase-js";

// Cliente para el frontend (con persistencia en localStorage)
export const createClientSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storage: typeof window !== 'undefined' ? localStorage : undefined,
      },
    }
  );
};

// Exportamos el cliente del frontend como default para compatibilidad
export const supabase = createClientSupabase();