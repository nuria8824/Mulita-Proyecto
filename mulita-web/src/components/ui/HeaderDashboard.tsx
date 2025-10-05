"use client";

import Image from "next/image";
import { useUser } from "@/context/UserContext";

export default function HeaderDashboard() {
  const { user } = useUser();

  return (
    <header className="w-full relative bg-white h-[79px] text-gray-600 font-inter text-base shadow">
      {/* Logo */}
      <Image
        src="/images/logosMulita/Logo Mulita-13.svg"
        alt="Logo Mulita"
        width={134}
        height={34}
        className="absolute top-[22.5px] left-[-462px]"
      />

      {/* Título Dashboard */}
      <b className="absolute top-[24.1px] left-[20px] text-black text-[15px] leading-[36px]">
        Dashboard
      </b>

      {/* Barra de navegación */}
      <div className="absolute top-[28px] left-[251px] w-[799px] h-[23px] flex items-center justify-end gap-[30px]">
        <div className="w-[58px] h-[18px] hidden"></div>

        {/* Avatar */}
        <div className="flex items-center pl-[159px] gap-2">
          <Image
            src={user?.imagen || "/default-avatar.png"}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>

        {/* Language */}
        <div className="w-[59px] flex items-center gap-2 overflow-hidden">
          <div className="relative w-6 h-6 flex-shrink-0">
            <Image src="/icons/vector1.svg" alt="" fill />
            <Image src="/icons/vector2.svg" alt="" fill />
            <Image src="/icons/vector3.svg" alt="" fill />
          </div>
          <b className="uppercase tracking-[0.2px]">ES</b>
        </div>
      </div>
    </header>
  );
}
