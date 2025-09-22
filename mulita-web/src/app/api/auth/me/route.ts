import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    let access_token = req.cookies.get("sb-access-token")?.value;
    const refresh_token = req.cookies.get("sb-refresh-token")?.value;

    // Si no hay access_token pero sí refresh_token, intentar renovar
    if (!access_token && refresh_token) {
      const { data, error } = await supabase.auth.refreshSession({ refresh_token });

      if (error || !data.session) {
        return NextResponse.json({ user: null });
      }

      access_token = data.session.access_token;

      // Actualizar la cookie con el nuevo access_token
      const res = NextResponse.json({ user: data.user });
      res.cookies.set("sb-access-token", access_token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });

      return res;
    }

    // Si hay access_token, obtener el usuario
    if (!access_token) return NextResponse.json({ user: null });

    const { data: { user }, error } = await supabase.auth.getUser(access_token);

    if (error || !user) return NextResponse.json({ user: null });

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null });
  }
}
