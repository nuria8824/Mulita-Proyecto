"use client";

import Productos from "./Productos";
import SkeletonProductos from "./skeletons/SkeletonProductos";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  eliminado: boolean;
  created_at: string;
  mostrar_en_inicio: boolean;
  producto_archivos: any[];
}

interface ProductosWrapperProps {
  productos: Producto[];
  loading: boolean;
  initialProductId?: string | null;
}

export default function ProductosWrapper({ productos, loading, initialProductId }: ProductosWrapperProps) {
  if (loading) {
    return <SkeletonProductos />;
  }

  return <Productos productos={productos} initialProductId={initialProductId} />;
}
