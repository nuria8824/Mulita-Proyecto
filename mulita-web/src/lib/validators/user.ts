// src/lib/validators/user.ts
import { z } from "zod";

export const registerSchema = z.object({
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  email: z.string().email(),
  telefono: z.string(),
  contrasena: z.string().min(6),
  rol: z.enum(["usuario", "docente"]).default("usuario"),
  institucion: z.string().optional(),
  pais: z.string().optional(),
  provincia: z.string().optional(),
  ciudad: z.string().optional(),
});
