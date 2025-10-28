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
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="w-full max-h-[80vh] object-contain rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl font-bold"
        >
          &times;
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
