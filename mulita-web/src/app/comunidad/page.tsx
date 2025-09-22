import { Sidebar } from "@/components/ui/Sidebar";
import Actividades from "./actividades/page";

export default function Comunidad() {
  return (
    <div className="flex h-screen">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido desplazable */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <Actividades />
      </main>
    </div>
  );
}
