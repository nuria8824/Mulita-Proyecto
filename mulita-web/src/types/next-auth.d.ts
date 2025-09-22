import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol: "superAdmin" | "admin" | "docente" | "usuario";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    rol: "superAdmin" | "admin" | "docente" | "usuario";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    rol: "superAdmin" | "admin" | "docente" | "usuario";
  }
}
