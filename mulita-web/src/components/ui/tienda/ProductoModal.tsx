"use client";

import { useState, useEffect } from "react";
import { AddToCartButton } from "../AddToCartButton";

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
          <div className="w-full mt-4" onClick={(e) => e.stopPropagation()}>
            <AddToCartButton 
              productoId={producto.id}
              nombre={producto.nombre}
              precio={producto.precio}
              className="w-full"
            />
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
    </div>
  );
}
