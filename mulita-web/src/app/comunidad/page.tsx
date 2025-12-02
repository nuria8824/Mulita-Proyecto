import { Suspense } from "react";
import Comunidad from "@/components/ui/comunidad/Comunidad";

export default function ComunidadPage() {
  return (
    <Suspense>
      <Comunidad />
    </Suspense>
  );
}
