import { supabase } from "./supabase";

// Utilidad para guardar archivos en Supabase Storage
export async function uploadFile(file: File, folder: string) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Nombre único para evitar sobreescritura
    const fileName = `${Date.now()}_${file.name}`;

    // Subir al bucket 'mulita-files' dentro de la carpeta correspondiente
    const { data, error } = await supabase.storage
      .from("mulita-files") // bucket único
      .upload(`${folder}/${fileName}`, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error(error.message);

    // Obtener URL pública
    const { data: publicData } = supabase.storage
      .from("mulita-files")
      .getPublicUrl(`${folder}/${fileName}`);

    return publicData.publicUrl;
  } catch (err: any) {
    console.error("Error subiendo archivo:", err.message);
    throw new Error(err.message);
  }
}
