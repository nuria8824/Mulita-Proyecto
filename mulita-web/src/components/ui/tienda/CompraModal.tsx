"use client";

import { useEffect, useState } from "react";
import { set } from "zod";

export type CompraModalProps = {
  open: boolean;
  onClose: () => void;
  usuarioId: string;
  producto: {
    id: string;
    nombre: string;
    precio: number;
  };
  onConfirm?: (data: {
    producto_id: string;
    cantidad: number;
    razon_social: string;
    cuit: string;
  }) => void;
};

function validarCuit(cuit: string): boolean {
  if (!/^\d{11}$/.test(cuit)) return false;

  const coef = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;

  for (let i = 0; i < 10; i++) {
    suma += parseInt(cuit[i], 10) * coef[i];
  }

  const resto = suma % 11;
  const digitoVerificador = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;

  return digitoVerificador === parseInt(cuit[10], 10);
}

function validarRazonSocial(nombre: string): boolean {
  if (!nombre) return false;
  if (nombre.trim().length < 3) return false;
  return /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ ,.()\-]+$/.test(nombre.trim());
}

export default function CompraModal({ open, onClose, producto, usuarioId, onConfirm }: CompraModalProps) {
  const [cantidad, setCantidad] = useState(1);

  // Datos fiscales
  const [razonSocial, setRazonSocial] = useState("");
  const [cuit, setCuit] = useState("");
  const [fiscalId, setFiscalId] = useState<string | null>(null);

  const [errores, setErrores] = useState({
    razonSocial: "",
    cuit: "",
  })

  const getWhatsAppUrl = ({
    producto,
    cantidad,
    razonSocial,
    cuit,
  }: {
    producto: { nombre: string; precio: number };
    cantidad: number;
    razonSocial: string;
    cuit: string;
  }) => {
    const telefono = "59896401738"; // <-- tu número

    const total = producto.precio * cantidad;

    const mensaje = `
      Hola! Quiero confirmar esta compra:

      🛒 *Producto:* ${producto.nombre}
      🔢 *Cantidad:* ${cantidad}
      💵 *Precio unitario:* $${producto.precio}
      💰 *Total:* $${total}

      📄 *Razón social:* ${razonSocial}
      🔢 *CUIT/CUIL:* ${cuit}
    `;

    return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  };


  // Cargar datos fiscales al abrir
  useEffect(() => {
    if (!open) return;

    (async () => {
      const res = await fetch("/api/datosFiscales", {
        headers: { "x-user-id": usuarioId },
      });

      const data = await res.json();
      if (data.datosFiscales) {
        setFiscalId(data.datosFiscales.id);
        setRazonSocial(data.datosFiscales.razon_social);
        setCuit(data.datosFiscales.cuit_cuil);
      }
    })();
  }, [open, usuarioId]);

  if (!open) return null;

  const confirmarCompra = async () => {
    let erroresTemp = { razonSocial: "", cuit: "" };
    let valido = true;

    if (!validarRazonSocial(razonSocial)) {
      erroresTemp.razonSocial = "Razón social inválida. La razón social debe tener al menos 3 caracteres y no contener caracteres especiales.";
      valido = false;
    }

    if (!validarCuit(cuit)) {
      erroresTemp.cuit = "El CUIT/CUIL debe tener 11 dígitos y ser válido.";
      valido = false;
    }

    setErrores(erroresTemp);

    if (!valido) return;

    if (!razonSocial || !cuit) return;

    let finalFiscalId = fiscalId;

    // Crear / actualizar datos fiscales
    if (fiscalId) {
      // PATCH (actualizar)
      const res = await fetch("/api/datosFiscales", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: fiscalId,
          razon_social: razonSocial,
          cuit_cuil: cuit,
        }),
      });

      const { datosFiscales } = await res.json();

      if (!datosFiscales) {
        console.error("Error actualizando datos fiscales");
        return;
      }

      finalFiscalId = datosFiscales.id;

    } else {
      // POST (crear)
      const res = await fetch("/api/datosFiscales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razon_social: razonSocial,
          cuit_cuil: cuit,
          usuario_id: usuarioId,
        }),
      });

      const { datosFiscales } = await res.json();

      if (!datosFiscales) {
        console.error("Error creando datos fiscales");
        return;
      }

      finalFiscalId = datosFiscales.id;
    }

    if (!finalFiscalId) {
      console.error("No se encontró el ID fiscal después de crear/actualizar.");
      return;
    }

    // Crear la orden
    await fetch("/api/orden", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: usuarioId,
        datos_fiscales_id: finalFiscalId,
        items: [
          {
            producto_id: producto.id,
            cantidad,
            precio_unitario: producto.precio,
          },
        ],
      }),
    });

    // Generar URL de WhatsApp
    const waUrl = getWhatsAppUrl({
      producto,
      cantidad,
      razonSocial,
      cuit,
    });

    window.open(waUrl, "_blank");

    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#003C71]">
            Comprar {producto.nombre}
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500">
            ✕
          </button>
        </div>

        {/* CANTIDAD */}
        <label className="block font-semibold text-gray-700 mb-2">
          Cantidad
        </label>
        <input
          aria-label="Cantidad"
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="w-full border rounded-md px-3 py-2"
        />

        {/* RAZÓN SOCIAL */}
        <label className="block font-semibold text-gray-700 mt-4">
          Razón social
        </label>
        <input
          aria-label="Razón social"
          type="text"
          value={razonSocial}
          onChange={(e) => setRazonSocial(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        {errores.razonSocial && (
          <p className="text-red-600 text-sm mt-1">{errores.razonSocial}</p>
        )}

        {/* CUIT */}
        <label className="block font-semibold text-gray-700 mt-4">
          CUIT / CUIL
        </label>
        <input
          aria-label="CUIT o CUIL"
          type="text"
          value={cuit}
          onChange={(e) => setCuit(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        {errores.cuit && (
          <p className="text-red-600 text-sm mt-1">{errores.cuit}</p>
        )}

        {/* BOTÓN */}
        <button
          onClick={confirmarCompra}
          className="mt-6 w-full bg-[#003C71] text-white py-2 rounded-md hover:bg-blue-900"
        >
          Confirmar compra
        </button>
      </div>
    </div>
  );
}


{/* <a
  href={getWhatsAppUrl(producto.nombre, producto.precio)}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn--blue flex-1 text-center"
  onClick={(e) => e.stopPropagation()} // evita abrir el modal
>
  Comprar
</a> */}

  // const getWhatsAppUrl = (producto) => {
  //   const telefono = "59896401738";
  //   const mensaje = `Hola! Quiero comprar el producto: ${producto.nombre} (Precio: $${producto.precio}).`;
  //   return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  // };