import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { z } from "zod";

const registerSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  email: z.email(),
  telefono: z.string().min(7).max(30),
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

    // 0. Verificar si el email ya existe en la tabla usuario
    const { data: existingUser, error: checkError } = await supabaseServer
      .from("usuario")
      .select("id, email")
      .eq("email", data.email)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking email:", checkError);
      throw new Error("Error al verificar el email");
    }

    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseServer.auth.signUp({
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
    const { error: userError } = await supabaseServer.from("usuario").update([
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
      console.log("Error inserting into usuario table:", userError);
      throw new Error(userError.message);
    }

    // 3. Si es docente, insertar en tabla docente
    if (data.rol === "docente") {
      const { error: docenteError } = await supabaseServer.from("docente").insert([
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

    return res;
  } catch (error: any) {
    console.error("Error en register:", error);
    return NextResponse.json({ success: false, message: error.message || "Error al registrar" }, { status: 400 });
  }
}
