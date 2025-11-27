"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { AddToCartButton } from "./carrito/AddToCartButton";
import CompraModal from "./CompraModal";
import { toast } from "react-hot-toast";

type ProductoModalProps = {
  open: boolean;
  onClose: () => void;
  producto: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenes: string[];
  };
};

export default function ProductoModal({ open, onClose, producto }: ProductoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compraOpen, setCompraOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleComprar = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para poder comprar");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
      return;
    }
    setCompraOpen(true);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? producto.imagenes.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIndex((i) => (i === producto.imagenes.length - 1 ? 0 : i + 1));
  };

  const hasMultiple = producto.imagenes.length > 1;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="
          relative bg-white rounded-lg flex justify-between items-center 
          overflow-hidden w-full max-w-[1100px] h-[612px] 
          p-[80px_0] gap-5 text-center text-[12px] text-[#6d758f] font-inter
        "
      >
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="
            absolute top-[17px] left-[22px] z-20 
            cursor-pointer transition-transform duration-150 hover:scale-110
          "
          aria-label="Cerrar modal"
        >
          <img
            src="/images/icons/productos/cerrar.svg"
            alt="Cerrar"
            className="w-4 h-4"
          />
        </button>

        {/* COLUMNA IZQUIERDA */}
        <div
          className="
            w-[467px] flex flex-col items-start absolute
            top-1/2 -translate-y-1/2 left-[calc(50%-495.5px)]
            max-h-[440px] pr-4
          "
        >
          <div className="flex items-center gap-4">
            <h1 className="text-[48px] leading-[48px] font-extrabold text-[#003c71] text-left">
              {producto.nombre}
            </h1>

            <span className="text-[28px] font-bold text-[#003c71] bg-[#e8edf3] px-4 py-1 rounded-md">
              ${producto.precio}
            </span>
          </div>


          <div className="mt-4" />

          <div className="mt-4 max-h-[200px] overflow-y-auto pr-2">
            <p className="text-left text-[16px] leading-6">
              {producto.descripcion}
            </p>
          </div>

          <div className="mt-6" />

          {/* BOTONES */}
          <div className="flex items-center gap-4 text-[16px] text-white mt-4">
            <button
              className="
                bg-[#003c71] shadow-[0px_1px_4px_rgba(25,33,61,0.08)]
                rounded-md px-[28px] py-[10px] 
                flex items-center justify-center gap-[6px]
                cursor-pointer font-semibold flex-1
                transition-all duration-200
                hover:bg-[#004a8d] hover:scale-[1.02] hover:shadow-md
              "
              onClick={handleComprar}
            >
              Comprar
              <img
                src="/images/icons/productos/flecha.svg"
                width={14}
                height={14}
                alt="Ir"
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            <div onClick={(e) => e.stopPropagation()}>
              <AddToCartButton 
                productoId={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
              />
            </div>
          </div>
        </div>

        {/* IMAGEN DERECHA + FLECHAS */}
        <div
          className="
            absolute top-[calc(50%-226px)] left-[calc(50%+104.5px)]
            w-[390px] h-[452px] flex items-center justify-center
          "
        >
          {/* Flecha izquierda */}
          {hasMultiple && (
            <button
              onClick={prev}
              className="
                absolute left-[-40px] z-20 bg-white/70 hover:bg-white text-black border border-gray-300
                w-[32px] h-[32px] rounded-full shadow-md flex items-center justify-center
                transition-all duration-200 hover:scale-110
              "
            >
              🡨
            </button>
          )}

          {/* Imagen actual */}
          <img
            src={producto.imagenes[currentIndex]}
            alt={producto.nombre}
            className="
              w-[390px] h-[452px] object-contain rounded-lg z-10
            "
          />

          {/* Flecha derecha */}
          {hasMultiple && (
            <button
              onClick={next}
              className="
                absolute right-[-40px] z-20 bg-white/70 hover:bg-white text-black border border-gray-300
                w-[32px] h-[32px] rounded-full shadow-md flex items-center justify-center
                transition-all duration-200 hover:scale-110
              "
            >
              🡪
            </button>
          )}
        </div>
      </div>

      {/* MODAL DE COMPRA */}
      <CompraModal
        open={compraOpen}
        onClose={() => setCompraOpen(false)}
        producto={{
          id: producto?.id ?? "",
          nombre: producto?.nombre ?? "",
          precio: producto?.precio ?? 0,
        }}
        onConfirm={(data) => {
          console.log("Datos listos para enviar:", data);
        }}
      />
    </div>
  );
}
