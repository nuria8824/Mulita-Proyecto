import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 1️⃣ Crear usuario en Auth
    const { user, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.contrasena,
      email_confirm: false, // false = envía mail de confirmación
    });

    if (authError) throw authError;

    // 2️⃣ Insertar en tabla usuario
    const { error: dbError } = await supabaseAdmin
      .from("usuario")
      .insert({
        id: user.id,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        rol: data.rol,
      });

    if (dbError) throw dbError;

    // 3️⃣ Si es docente, insertar en tabla docentes
    if (data.rol === "docente") {
      const { error: docenteError } = await supabaseAdmin
        .from("docentes")
        .insert({
          usuario_id: user.id,
          institucion: data.institucion,
          pais: data.pais,
          provincia: data.provincia,
          ciudad: data.ciudad,
        });
      if (docenteError) throw docenteError;
    }

    return NextResponse.json({ success: true, userId: user.id });

  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
