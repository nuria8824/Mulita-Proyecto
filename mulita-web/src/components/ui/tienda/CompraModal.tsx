"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UbicacionInput from "./ubicacion/UbicacionInput";
import { useUser } from "@/hooks/queries";
import { useCart } from "@/hooks/queries";
import { toast } from "react-hot-toast";
import { CartItem } from "@/context/CartContext";

export type CompraModalProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  source?: "cart" | "product"; // 'cart' = desde el carrito, 'product' = desde un producto
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

export default function CompraModal({ open, onClose, items, source = "cart" }: CompraModalProps) {
  const { user: usuario } = useUser();
  const { clearCart } = useCart();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);

  // Datos fiscales
  const [razonSocial, setRazonSocial] = useState("");
  const [cuit, setCuit] = useState("");
  const [fiscalId, setFiscalId] = useState<string | null>(null);

  const [ubicacion, setUbicacion] = useState("");
  const [coordenadas, setCoordenadas] = useState<{ lat: string; lon: string } | null>(null);


  const [errores, setErrores] = useState({
    razonSocial: "",
    cuit: "",
    cantidad: "",
    direccion: "",
  })

  // Si el usuario no está logueado mostrar toast y redirigir a login
  useEffect(() => {
    if (open && !usuario) {
      toast.error("Debes iniciar sesión para poder comprar");
      onClose();
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    }
  }, [open, usuario, onClose, router]);

  const getWhatsAppUrl = ({
    codigo,
    fecha,
    nombre,
    telefono,
    razonSocial,
    cuit,
    direccion,
    items,
    total,
  }: {
    codigo: string;
    fecha: string;
    nombre: string;
    telefono: string;
    razonSocial: string;
    cuit: string;
    direccion: string;
    items: { nombre: string; cantidad: number; precio_unitario: number }[];
    total: number;
  }) => {
    const telefonoWhatsApp = "59896401738";

    const mensaje = `Hola! Quiero confirmar esta compra:

    *Orden:* ${codigo}
    *Fecha:* ${new Date(fecha).toLocaleDateString()}
    *Nombre:* ${nombre}
    *Teléfono:* ${telefono}

    *Razón social:* ${razonSocial}
    *CUIT/CUIL:* ${cuit}

    *Dirección:* ${direccion}

    Mi pedido es

    ${items.map((i) => 
      `• ${i.cantidad}x *${i.nombre}*: $${i.precio_unitario}`
    )
    .join("\n")}

    *TOTAL: $${total}*

    _Espero tu confirmación. ¡Gracias!_
    `;

    return `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  };


  // Cargar datos fiscales al abrir
  useEffect(() => {
    if (!open || !usuario) return;

    (async () => {
      const res = await fetch("/api/datosFiscales", {
        headers: { "x-user-id": usuario.id },
      });

      const data = await res.json();
      if (data.datosFiscales) {
        setFiscalId(data.datosFiscales.id);
        setRazonSocial(data.datosFiscales.razon_social);
        setCuit(data.datosFiscales.cuit_cuil);
      }
    })();
  }, [open, usuario]);

  // Early returns después de todos los hooks
  if (!open) return null;
  if (!usuario) return null;

  const confirmarCompra = async () => {
    const erroresTemp = {
      razonSocial: "",
      cuit: "",
      cantidad: "",
      direccion: "",
    };

    let valido = true;

    if (!validarRazonSocial(razonSocial)) {
      erroresTemp.razonSocial = "Razón social inválida. La razón social debe tener al menos 3 caracteres y no contener caracteres especiales.";
      valido = false;
    }

    if (!validarCuit(cuit)) {
      erroresTemp.cuit = "El CUIT/CUIL debe tener 11 dígitos y ser válido.";
      valido = false;
    }

    if (!cantidad || cantidad <= 0) {
      erroresTemp.cantidad = "La cantidad debe ser mayor a 0.";
      valido = false;
    }

    if (!ubicacion || ubicacion.trim().length < 3) {
      erroresTemp.direccion = "Debes ingresar una dirección válida.";
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
          usuario_id: usuario.id,
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

    const itemsPayload = items.map((item) => ({
      producto_id: item.producto_id,
      nombre: item.producto?.nombre ?? "Producto",
      cantidad: item.cantidad,
      precio_unitario: item.producto?.precio ?? item.precio,
    }));

    // Crear la orden
    const res = await fetch("/api/orden", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: usuario.id,
        datos_fiscales_id: finalFiscalId,
        ubicacion,
        lat: coordenadas?.lat ?? null,
        lon: coordenadas?.lon ?? null,
        items: itemsPayload,
      }),
    });

    const data = await res.json();
    console.log("orden", data.orden);
    console.log("itemsOrden", data.items);

    if (!data) {
      console.error("Error creando la orden");
      return;
    }

    // Generar URL de WhatsApp
    const waUrl = getWhatsAppUrl({
      codigo: data.orden.id,
      fecha: data.orden.created_at,
      nombre: `${usuario.nombre} ${usuario.apellido}`,
      telefono: usuario.telefono,
      direccion: data.orden.direccion,
      razonSocial,
      cuit,
      items: data.items,
      total: data.orden.total,
    });

    window.open(waUrl, "_blank");

    // Vaciar el carrito solo si la compra es desde el carrito
    if (source === "cart") {
      await clearCart();
      toast.success("Orden enviada a WhatsApp. Carrito vaciado.");
    } else {
      toast.success("Orden enviada a WhatsApp.");
    }

    onClose();
  };

  // Si no hay usuario, no renderizar el modal
  if (!usuario) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#003C71]">
            Comprar
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500">
            ✕
          </button>
        </div>

        {/* CANTIDAD */}
        {/* <label className="block font-semibold text-gray-700 mb-2">
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
        {errores.cantidad && (
          <p className="text-red-600 text-sm mt-1">{errores.cantidad}</p>
        )} */}

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

        <label className="block font-semibold text-gray-700 mt-4">
          Dirección
        </label>
        <UbicacionInput
          value={ubicacion}
          onSelect={(lugar) => {
            setUbicacion(lugar.display_name);
            setCoordenadas({ lat: lugar.lat, lon: lugar.lon });
          }}
        />
        {errores.direccion && (
          <p className="text-red-600 text-sm mt-1">{errores.direccion}</p>
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
