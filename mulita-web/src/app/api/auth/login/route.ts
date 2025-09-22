import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  contrasena: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    // 1. Intentar login con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.contrasena,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const user = authData.user;
    if (!user) {
      throw new Error("No se encontró el usuario");
    }

    // 2. Buscar datos adicionales en tabla usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", user.id)
      .single();

    if (usuarioError) {
      throw new Error(usuarioError.message);
    }

    // 3. Si es docente, buscar sus datos también
    let docente = null;
    if (usuario.rol === "docente") {
      const { data: docenteData, error: docenteError } = await supabase
        .from("docente")
        .select("*")
        .eq("id_usuario", user.id)
        .single();

      if (docenteError && docenteError.code !== "PGRST116") {
        // PGRST116 = not found (sin registro)
        throw new Error(docenteError.message);
      }
      docente = docenteData;
    }

    // 4. Devolver todo junto
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        docente,
      },
      session: authData.session, // incluye access_token y refresh_token
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
