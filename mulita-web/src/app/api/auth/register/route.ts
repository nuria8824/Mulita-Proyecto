import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const registerSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  email: z.email(),
  telefono: z.string().min(7).max(15),
  contrasena: z.string().min(6),
  rol: z.enum(["usuario", "docente"]),
  institucion: z.string().optional(),
  pais: z.string().optional(),
  provincia: z.string().optional(),
  ciudad: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.contrasena,
    });

    if (authError) {
      console.error("Supabase auth error:", authError)
      console.log("Payload:", data);
      console.log("Auth result:", authData, authError);
      throw new Error(authError.message);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error("No se pudo obtener el ID del usuario de Supabase Auth");
    }

    // 2. Insertar en tabla usuario
    const { error: userError } = await supabase.from("usuario").update([
      {
        id: userId,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        rol: data.rol,
      },
    ])
    .eq("id", userId);

    if (userError) {
      throw new Error(userError.message);
    }

    // 3. Si es docente, insertar en tabla docente
    if (data.rol === "docente") {
      const { error: docenteError } = await supabase.from("docente").insert([
        {
          id_usuario: userId,
          institucion: data.institucion || "",
          pais: data.pais || "",
          provincia: data.provincia || "",
          ciudad: data.ciudad || "",
        },
      ]);

      if (docenteError) {
        throw new Error(docenteError.message);
      }
    }

    // 4. Guardar tokens en cookies HTTP-only
    const res = NextResponse.json({
      success: true,
      user: { id: userId, email: data.email, rol: data.rol },
    });

    res.cookies.set("sb-access-token", authData.session?.access_token!, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });

    res.cookies.set("sb-refresh-token", authData.session?.refresh_token!, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error: any) {
    console.error("Error en register:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
