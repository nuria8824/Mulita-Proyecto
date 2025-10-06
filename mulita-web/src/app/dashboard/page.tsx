"use client";

import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-10 pb-10 text-center text-xs text-[#6d758f] font-inter">
      
      {/* Headings */}
      <div className="w-full max-w-5xl flex flex-col items-start text-[28px] sm:text-[36px]">
        <div className="font-extrabold text-black">Dashboard</div>
        <div className="text-left text-base leading-6 mt-2">
          Resumen del estado actual de la página Mulita
        </div>
      </div>

      {/* Grid de cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* NUEVAS ACTIVIDADES */}
        <Card
          title="Nuevas Actividades"
          value="10"
          subtitle="en los últimos 30 días"
          color="text-[#68bb6c]"
          icon="/images/icons/dashboard/actividades.svg"
        />

        {/* TOTAL ACTIVIDADES */}
        <Card
          title="Total de Actividades"
          value="25"
          subtitle="actividades creadas"
          color="text-[#68bb6c]"
          icon="/images/icons/dashboard/actividades.svg"
        />

        {/* NUEVOS USUARIOS */}
        <Card
          title="Nuevos Usuarios"
          value="12"
          subtitle="en los últimos 30 días"
          color="text-[#ec9d54]"
          icon="/images/icons/dashboard/usuario.svg"
        />

        {/* TOTAL USUARIOS */}
        <Card
          title="Total de Usuarios"
          value="51"
          subtitle="usuarios registrados"
          color="text-[#ec9d54]"
          icon="/images/icons/dashboard/usuario.svg"
        />

        {/* NUEVOS PEDIDOS */}
        <Card
          title="Nuevos Pedidos"
          value="10"
          subtitle="en los últimos 30 días"
          color="text-[#bd76c4]"
          icon="/images/icons/dashboard/pedidos.svg"
        />

        {/* TOTAL PEDIDOS */}
        <Card
          title="Total de Pedidos"
          value="25"
          subtitle="pedidos realizados"
          color="text-[#bd76c4]"
          icon="/images/icons/dashboard/pedidos.svg"
        />
      </div>
    </div>
  );
}

/* 🔹 Componente reutilizable para cada card */
function Card({
  title,
  value,
  subtitle,
  color,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="relative flex flex-col justify-center bg-white border border-[#e1e4ed] rounded-lg shadow-sm p-6 text-left min-h-[120px]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg text-black font-semibold">{title}</div>
          <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
          <div className="text-sm text-[#6d758f]">{subtitle}</div>
        </div>
        <Image src={icon} alt={title} width={32} height={32} />
      </div>
    </div>
  );
}
