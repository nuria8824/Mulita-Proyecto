from config import supabase
from typing import Optional

def get_all_noticias():
    resp = supabase.table("noticia").select("*").order("created_at", desc=True).execute()
    return resp.data

def insert_noticia(titulo, autor, introduccion, descripcion, img_url, file_url=None):
    resp = supabase.table("noticia").insert({
        "titulo": titulo,
        "autor": autor,
        "introduccion": introduccion,
        "descripcion": descripcion,
        "imagen_principal": img_url,
        "archivo": file_url
    }).execute()
    return resp.data

def get_noticia_by_id(noticia_id: int):
    resp = supabase.table("noticia").select("*").eq("id", noticia_id).single().execute()
    return resp.data  # será None si no existe

def update_noticia(noticia_id: int, data: dict):
    resp = supabase.table("noticia").update(data).eq("id", noticia_id).execute()
    return resp.data

def delete_noticia(noticia_id: int):
    resp = supabase.table("noticia").delete().eq("id", noticia_id).execute()
    return resp.data
