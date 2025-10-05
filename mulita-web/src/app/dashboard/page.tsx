"use client";

import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="w-full relative overflow-hidden flex flex-col items-center px-0 pb-10 box-border text-center text-xs text-[#6d758f] font-inter">
      
      {/* Headings */}
      <div className="w-[1103px] h-[86px] flex flex-col items-start text-[36px]">
        <div className="relative leading-10 font-extrabold text-black">Dashboard</div>
        <div className="w-[14px] h-[14px] relative opacity-0 text-xs"></div>
        <div className="w-[615px] relative text-left text-base leading-6 inline-block">
          Resumen del estado actual de la página Mulita
        </div>
      </div>

      {/* Fila 1 */}
      <div className="h-[117px] flex items-start gap-[22px] mt-6">
        {/* Card 1 */}
        <div className="w-[487px] h-[118px] flex flex-col items-center p-[0px_25px] bg-white border border-[#e1e4ed] rounded-lg shadow-sm relative">
          <div className="w-10 h-10 relative opacity-0 z-0" />
          <div className="absolute w-[435px] h-[84px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-start z-10">
            <div className="flex items-center text-lg text-black">
              <div className="relative leading-[22px] font-semibold">Nuevas Actividades</div>
            </div>
            <div className="w-[244px] relative text-2xl font-extrabold text-[#68bb6c] text-left">
              10
            </div>
            <div className="w-[292px] relative text-sm leading-[22px] text-left">
              en los últimos 30 días
            </div>
          </div>
          <Image
            src="/images/icons/dashboard/actividades.svg"
            alt="actividades"
            width={20}
            height={20}
            className="absolute top-[8px] right-[18px] z-20"
          />
        </div>

        {/* Card 2 */}
        <div className="w-[487px] h-[118px] flex flex-col items-center p-[0px_25px] bg-white border border-[#e1e4ed] rounded-lg shadow-sm relative">
          <div className="w-10 h-10 relative opacity-0 z-0" />
          <div className="absolute w-[435px] h-[84px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-start z-10">
            <div className="flex items-center text-lg text-black">
              <div className="relative leading-[22px] font-semibold">Total de Actividades</div>
            </div>
            <div className="w-[244px] relative text-2xl font-extrabold text-[#68bb6c] text-left">
              25
            </div>
            <div className="w-[292px] relative text-sm leading-[22px] text-left">
              actividades creadas
            </div>
          </div>
          <Image
            src="/images/icons/dashboard/actividades.svg"
            alt="actividades"
            width={20}
            height={20}
            className="absolute top-[8px] right-[18px] z-20"
          />
        </div>
      </div>

      {/* Fila 2 */}
      <div className="h-[117px] flex items-start gap-[22px] mt-6">
        {/* Card 1 */}
        <div className="w-[487px] h-[118px] flex flex-col items-center p-[0px_25px] bg-white border border-[#e1e4ed] rounded-lg shadow-sm relative">
          <div className="absolute w-[435px] h-[84px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-start">
            <div className="flex items-center text-lg text-black">
              <div className="relative font-semibold">Nuevos Usuarios</div>
            </div>
            <div className="w-[244px] relative text-2xl font-extrabold text-[#ec9d54] text-left">
              12
            </div>
            <div className="w-[292px] relative text-sm leading-[22px] text-left">
              en los últimos 30 días
            </div>
          </div>
          <Image
            src="/images/icons/dashboard/usuario.svg"
            alt="usuarios"
            width={20}
            height={20}
            className="absolute top-[8px] right-[18px] z-20"
          />
        </div>

        {/* Card 2 */}
        <div className="w-[487px] h-[118px] flex flex-col items-center p-[0px_25px] bg-white border border-[#e1e4ed] rounded-lg shadow-sm relative">
          <div className="absolute w-[435px] h-[84px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-start">
            <div className="flex items-center text-lg text-black">
              <div className="relative font-semibold">Total de Usuarios</div>
            </div>
            <div className="w-[244px] relative text-2xl font-extrabold text-[#ec9d54] text-left">
              51
            </div>
            <div className="w-[292px] relative text-sm leading-[22px] text-left">
              usuarios registrados
            </div>
          </div>
          <Image
            src="/images/icons/dashboard/usuario.svg"
            alt="usuarios"
            width={20}
            height={20}
            className="absolute top-[8px] right-[18px] z-20"
          />
        </div>
      </div>

      {/* Fila 3 */}
      <div className="h-[117px] flex items-start gap-[22px] mt-6">
        {/* Card 1 */}
        <div className="w-[487px] h-[118px] flex flex-col items-center p-[0px_25px] bg-white border border-[#e1e4ed] rounded-lg shadow-sm relative">
          <div className="absolute w-[435px] h-[84px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-start">
            <div className="flex items-center text-lg text-black">
              <div className="relative font-semibold">Nuevos Pedidos</div>
            </div>
            <div className="w-[244px] relative text-2xl font-extrabold text-[#bd76c4] text-left">
              10
            </div>
            <div className="w-[292px] relative text-sm leading-[22px] text-left">
              en los últimos 30 días
            </div>
          </div>
          <Image
            src="/images/icons/dashboard/pedidos.svg"
            alt="pedidos"
            width={20}
            height={20}
            className="absolute top-[8px] right-[18px] z-20"
          />
        </div>

        {/* Card 2 */}
        <div className="w-[487px] h-[118px] flex flex-col items-center p-[0px_25px] bg-white border border-[#e1e4ed] rounded-lg shadow-sm relative">
          <div className="absolute w-[435px] h-[84px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-start">
            <div className="flex items-center text-lg text-black">
              <div className="relative font-semibold">Total de Pedidos</div>
            </div>
            <div className="w-[244px] relative text-2xl font-extrabold text-[#bd76c4] text-left">
              25
            </div>
            <div className="w-[292px] relative text-sm leading-[22px] text-left">
              pedidos realizados
            </div>
          </div>
          <Image
            src="/images/icons/dashboard/pedidos.svg"
            alt="pedidos"
            width={20}
            height={20}
            className="absolute top-[8px] right-[18px] z-20"
          />
        </div>
      </div>
    </div>
  );
}
