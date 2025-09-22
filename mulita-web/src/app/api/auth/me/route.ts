import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const access_token = req.cookies.get("sb-access-token")?.value;

    if (!access_token) {
      return NextResponse.json({ user: null });
    }

    const { data: { user }, error } = await supabase.auth.getUser(access_token);

    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null });
  }
}
