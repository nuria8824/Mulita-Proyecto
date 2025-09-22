const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";

export interface Noticia {
  id: number;
  titulo: string;
  autor: string;
  introduccion: string;
  descripcion: string;
  imagen_principal: string;
  archivo?: string | null;
  created_at: string;
}

export async function fetchNoticias(): Promise<Noticia[]> {
  const res = await fetch(`${BASE_URL}/noticias`);
  if (!res.ok) throw new Error("Error fetching noticias");
  const data = await res.json();
  return data.noticias;
}

export async function crearNoticia(
  noticia: FormData,
  token: string
): Promise<Noticia> {
  const res = await fetch(`${BASE_URL}/noticias`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: noticia,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error creando noticia");
  }
  const data = await res.json();
  return data.noticia;
}

export async function fetchNoticiaById(id: number): Promise<Noticia> {
  const res = await fetch(`${BASE_URL}/noticias/${id}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Error al obtener la noticia");
  }
  const data = await res.json();
  return data.noticia;
}

export async function actualizarNoticia(
  id: number,
  noticia: FormData,
  token: string
): Promise<Noticia> {
  const res = await fetch(`${BASE_URL}/noticias/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: noticia,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error actualizando noticia");
  }
  const data = await res.json();
  return data.noticia;
}

export async function eliminarNoticia(id: number, token: string) {
  const res = await fetch(`${BASE_URL}/noticias/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error eliminando noticia");
  }
  return true;
}
