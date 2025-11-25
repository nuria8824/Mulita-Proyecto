import { createClient } from "@supabase/supabase-js";

// Cliente para el servidor (API routes, middleware, etc.)
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
);