// import bcrypt from "bcrypt";
// import jwt, { verify } from "jsonwebtoken";
// import { NextRequest } from "next/server";

// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// // Hash de contraseña
// export const hashPassword = async (password: string) =>
//   await bcrypt.hash(password, 10);

// // Comparar contraseña
// export const verifyPassword = async (hash: string, password: string) =>
//   await bcrypt.compare(password, hash);

// // Generar JWT
// export const signToken = (payload: object) =>
//   jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

// // Verificar JWT
// export const verifyToken = (token: string) =>
//   jwt.verify(token, JWT_SECRET);


// export function getUserFromRequest(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   if (!token) return null;

//   try {
//     const payload = verify(token, JWT_SECRET) as { id: string; rol: string };
//     return payload;
//   } catch {
//     return null;
//   }
// }

// export function requireAdmin(req: NextRequest) {
//   const user = getUserFromRequest(req);
//   console.log("User from token:", user);
//   if (!user || (user.rol !== "admin" && user.rol !== "superAdmin")) {
//     throw new Error("No tienes permisos");
//   }
//   return user;
// }