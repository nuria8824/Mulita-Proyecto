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
  const [razonSocial, setRazonSocial] = useState<"Consumidor Final" | "Responsable Inscripto">("Consumidor Final");
  const [cuit, setCuit] = useState("");
  const [fiscalId, setFiscalId] = useState<string | null>(null);

  const [ubicacion, setUbicacion] = useState("");
  const [coordenadas, setCoordenadas] = useState<{ lat: string; lon: string } | null>(null);

  const [errores, setErrores] = useState({
    razonSocial: "",
    cuit: "",
    direccion: "",
  });

  const limpiarError = (campo: keyof typeof errores) => {
    setErrores((prev) => ({ ...prev, [campo]: "" }));
  };


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

  useEffect(() => {
  if (!open) {
    setUbicacion("");
    setCoordenadas(null);
  }
}, [open]);

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
      `• ${i.cantidad}x *${i.nombre}*: $${i.precio_unitario.toFixed(2).toLocaleString("es-AR")}`
    )
    .join("\n")}

    *TOTAL: $${total.toFixed(2).toLocaleString("es-AR")}*

    _Espero tu confirmación y los datos bancarios para el pago. ¡Gracias!_
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

  const itemsPayload = items.map((item) => ({
    producto_id: item.producto_id,
    nombre: item.producto?.nombre ?? "Producto",
    cantidad: item.cantidad,
    precio_unitario: item.producto?.precio ?? item.precio,
  }));

  // Calcular total
  const total = itemsPayload.reduce(
    (acc: number, item: any) =>
      acc + item.cantidad * item.precio_unitario,
    0
  );

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

    // Validación condicional del CUIT según tipo fiscal
    if (razonSocial === "Responsable Inscripto") {
      if (!validarCuit(cuit)) {
        erroresTemp.cuit = "El CUIT es obligatorio para Responsable Inscripto y debe ser válido.";
        valido = false;
      }
    } else {
      // Consumidor final → CUIT no obligatorio, pero si lo escribe debe ser válido
      if (cuit.trim() !== "" && !validarCuit(cuit.replace(/\D/g, ""))) {
        erroresTemp.cuit = "El CUIT ingresado no es válido.";
        valido = false;
      }
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

    if (!razonSocial || (razonSocial === "Responsable Inscripto" && !cuit)) return;

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
        total,
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

  const handleCuitChange = (value: string) => {
    // Eliminar todo lo que NO sea número
    const limpio = value.replace(/\D/g, "");

    // No dejar más de 11 dígitos reales
    const max11 = limpio.slice(0, 11);

    // Aplicar formato dinámico XX-XXXXXXXX-X
    let formateado = max11;

    if (max11.length > 2 && max11.length <= 10) {
      formateado = `${max11.slice(0, 2)}-${max11.slice(2)}`;
    } 
    else if (max11.length === 11) {
      formateado = `${max11.slice(0, 2)}-${max11.slice(2, 10)}-${max11.slice(10)}`;
    }

    setCuit(formateado);
    limpiarError("cuit");
  };


  // Si no hay usuario, no renderizar el modal
  if (!usuario) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 overflow-y-auto flex flex-col justify-start pt-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg m-auto mb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#003C71]">
            Comprar
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500">
            ✕
          </button>
        </div>

        {/* RAZÓN SOCIAL */}
        <label className="block font-semibold text-gray-700 mt-4">
          Razón Social
        </label>
        <select
          aria-label="Razon social"
          value={razonSocial}
          onChange={(e) => {
            setRazonSocial(e.target.value as any);
            limpiarError("razonSocial");
          }}
          className="border rounded p-2 w-full"
        >
          <option value="Consumidor Final">Consumidor Final</option>
          <option value="Responsable Inscripto">Responsable Inscripto</option>
        </select>

        {errores.razonSocial && (
          <p className="text-red-500 text-sm">{errores.razonSocial}</p>
        )}

        {/* CUIT */}
        <label className="block font-semibold text-gray-700 mt-4">
          CUIT / CUIL
        </label>
        <input
          aria-label="CUIT o CUIL"
          type="text"
          value={cuit}
          onChange={(e) => handleCuitChange(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          maxLength={13}
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
            limpiarError("direccion")
          }}
        />
        {errores.direccion && (
          <p className="text-red-600 text-sm mt-1">{errores.direccion}</p>
        )}

        {/* TOTAL DEL PEDIDO */}
        <div className="text-right mb-4 mt-4">
          <p className="text-lg font-semibold">
            Total: ${total.toFixed(2).toLocaleString("es-AR")}
          </p>
        </div>

        {/* AVISO IMPORTANTE */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">⚠️ Nota importante:</span> El precio mostrado no incluye los costos de envío. El total final se coordinará vía WhatsApp.
          </p>
          <p className="text-xs text-amber-800">
            <span className="font-semibold">*Envíos disponibles solo en Argentina. Para envíos a otro país contáctate por WhatsApp.</span>
          </p>
        </div>

        {/* BOTÓN */}
        <button
          onClick={confirmarCompra}
          className="mt-6 w-full bg-[#003C71] text-white py-2 rounded-md hover:bg-blue-900"
        >
          Confirmar compra
        </button>
        </div>
      </div>
    </div>
  );
}
