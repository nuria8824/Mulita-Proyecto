"use client";

import Link from "next/link";
import Image from "next/image";

export function InfoGeneral() {
  return (
    <section className="mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
        <div className="rounded-2xl border border-light p-6">
          <h3 className="text-xl font-bold">Aprender con Mulita</h3>
          <p className="mt-3 text-muted-foreground">
            Mulita es un <strong>robot programable</strong> sencillo de usar, ideal para iniciar a
            niñas, niños y adolescentes en robótica, programación y electrónica.
            La plataforma reúne contenidos, ejemplos y manuales para docentes y
            estudiantes, todo en un mismo lugar.
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-5 text-muted-foreground">
            <li>Guías de uso, misión y visión del proyecto.</li>
            <li>Casos de implementación en escuelas.</li>
            <li>Documentación técnica y manuales de construcción.</li>
          </ul>
          <Link href="/noticias" className="mt-4 inline-block text-primary font-medium">
            Ver novedades →
          </Link>
        </div>

        <div className="rounded-2xl border border-light p-6">
          <h3 className="text-xl font-bold">Comunidad educativa</h3>
          <p className="mt-3 text-muted-foreground">
            Registrate para <strong>subir actividades</strong> (texto, PDF, imágenes o video),
            organizarlas por <em>materias</em> y <em>niveles</em>, y participar en el foro con
            comentarios y “me gusta”. También podés crear colecciones y llevar
            tus favoritos.
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-5 text-muted-foreground">
            <li>Perfiles de usuario y de docente con institución y ubicación.</li>
            <li>Foro colaborativo con crédito al autor al reutilizar actividades.</li>
            <li>Colecciones personales y lista de favoritos.</li>
          </ul>
          <Link href="/comunidad" className="mt-4 inline-block text-primary font-medium">
            Entrar a la comunidad →
          </Link>
        </div>

        <div className="rounded-2xl border border-light p-6">
          <h3 className="text-xl font-bold">Tienda y pedido simple</h3>
          <p className="mt-3 text-muted-foreground">
            Mirá kits y piezas con precios, agregá al carrito y generá tu
            <strong> orden por WhatsApp</strong> con los datos requeridos para facturación.
            Coordinamos el pago por ese medio y te acompañamos con la info que
            necesitás para empezar.
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-5 text-muted-foreground">
            <li>Kits completos y piezas por separado.</li>
            <li>Formulario de cierre con DNI/CUIT/CUIL y razón social.</li>
            <li>Soporte en español, portugués e inglés.</li>
          </ul>
          <Link href="/tienda" className="mt-4 inline-block text-primary font-medium">
            Ir a la tienda →
          </Link>
        </div>
      </div>
    </section>
  );
}
