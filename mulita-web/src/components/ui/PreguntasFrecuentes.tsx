"use client";

export function PreguntasFrecuentes() {
  return (
    <section className="mt-24 mb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-light p-6">
          <h3 className="text-lg font-bold">¿Para quién es?</h3>
          <p className="mt-3 text-muted-foreground">
            Visitantes que quieren conocer el proyecto, <strong>docentes</strong> que buscan
            recursos y <strong>compradores</strong> (escuelas, instituciones o particulares) que
            desean adquirir el kit o piezas.
          </p>
        </div>
        <div className="rounded-xl border border-light p-6">
          <h3 className="text-lg font-bold">¿Cómo se compra?</h3>
          <p className="mt-3 text-muted-foreground">
            Seleccionás productos, confirmás tus datos y el sistema genera una
            <strong> orden por WhatsApp</strong> con tu pedido y datos de facturación. Luego
            coordinamos el pago por ese medio.
          </p>
        </div>
        <div className="rounded-xl border border-light p-6">
          <h3 className="text-lg font-bold">Idiomas</h3>
          <p className="mt-3 text-muted-foreground">
            La plataforma está disponible en <strong>español</strong>, <strong>portugués</strong> e
            <strong> inglés</strong> para facilitar su uso en distintos países.
          </p>
        </div>
      </div>
    </section>
  );
}
