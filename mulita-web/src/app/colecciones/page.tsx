import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function ColeccionesPage() {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: colecciones } = await supabase
    .from("colecciones")
    .select("*")
    .eq("usuario_id", user?.id);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Mis colecciones</h1>
      <Link href="/colecciones/new" className="text-blue-600">+ Nueva colección</Link>

      <ul className="mt-4 space-y-2">
        {colecciones?.map(c => (
          <li key={c.id} className="border p-3 rounded">
            <Link href={`/colecciones/${c.id}`} className="text-lg font-medium">
              {c.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
