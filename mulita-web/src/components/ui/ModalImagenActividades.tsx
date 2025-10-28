"use client";

import { useState } from "react";

type ImagenModalProps = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function ModalImagenActividades({
  images,
  initialIndex,
  onClose,
}: ImagenModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
        />
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold"
        >
          &times;
        </button>

        {/* Navegación entre imágenes */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
