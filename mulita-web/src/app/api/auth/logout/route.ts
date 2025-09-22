import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    await supabase.auth.signOut(); // opcional, puedes mantenerlo

    const response = NextResponse.json({ success: true });

    response.cookies.delete({ name: "sb-access-token", path: "/" });
    response.cookies.delete({ name: "sb-refresh-token", path: "/" });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
