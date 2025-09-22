from fastapi import File, UploadFile, Form, Depends, APIRouter, HTTPException
from typing import Optional
from config import supabase
from auth.dependencies import verify_admin
import crud_noticias
from datetime import datetime

router = APIRouter()

# --- GET todas las noticias ---
@router.get("")
async def get_noticias():
    try:
        noticias = crud_noticias.get_all_noticias() or []
        return {"noticias": noticias}
    except Exception as e:
        print("Error get_noticias:", e)
        raise HTTPException(status_code=500, detail="Error al obtener noticias")

# --- POST crear noticia ---
@router.post("")
async def create_noticia(
    titulo: str = Form(...),
    autor: str = Form(...),
    introduccion: str = Form(...),
    descripcion: str = Form(...),
    imagen_principal: UploadFile = File(...),
    archivo: UploadFile | None = File(None),
    user=Depends(verify_admin)
):
    # Subir imagen principal a Supabase Storage
    imagen_bytes = await imagen_principal.read()
    supabase.storage.from_("noticias").upload(
        f"imagenes/{imagen_principal.filename}", 
        imagen_bytes
    )

    imagen_url = supabase.storage.from_("noticias").get_public_url(
        f"imagenes/{imagen_principal.filename}"
    )

    # Subir archivo si existe
    archivo_url = None
    if archivo:
        archivo_bytes = await archivo.read()
        supabase.storage.from_("noticias").upload(
            f"archivos/{archivo.filename}", 
            archivo_bytes
        )
        archivo_url = supabase.storage.from_("noticias").get_public_url(
            f"archivos/{archivo.filename}"
        )

    # Insertar en la tabla noticia
    noticia = supabase.table("noticia").insert({
        "titulo": titulo,
        "autor": autor,
        "introduccion": introduccion,
        "descripcion": descripcion,
        "imagenprincipal": imagen_url,
        "archivo": archivo_url,
        "createdat": datetime.utcnow().isoformat()
    }).execute()

    return {"success": True, "noticia": noticia.data}

# --- GET una noticia por su id ---
@router.get("/{noticia_id}")
async def get_noticia(noticia_id: int):
    noticia = crud_noticias.get_noticia_by_id(noticia_id)
    if not noticia:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return {"noticia": noticia}

# --- PUT actualizar noticia ---
@router.put("/{noticia_id}")
async def update_noticia(
    noticia_id: int,
    titulo: Optional[str] = Form(None),
    autor: Optional[str] = Form(None),
    introduccion: Optional[str] = Form(None),
    descripcion: Optional[str] = Form(None),
    imagen_principal: Optional[UploadFile] = File(None),
    archivo: Optional[UploadFile] = File(None),
    user=Depends(verify_admin)
):
    data = {}
    if titulo: data["titulo"] = titulo
    if autor: data["autor"] = autor
    if introduccion: data["introduccion"] = introduccion
    if descripcion: data["descripcion"] = descripcion

    if imagen_principal:
        img_data = await imagen_principal.read()
        supabase.storage.from_("noticias").upload(f"imagenes/{imagen_principal.filename}", img_data, {"content-type": imagen_principal.content_type})
        data["imagen_principal"] = f"{supabase.storage_url}/noticias/imagenes/{imagen_principal.filename}"

    if archivo:
        file_data = await archivo.read()
        supabase.storage.from_("noticias").upload(f"archivos/{archivo.filename}", file_data, {"content-type": archivo.content_type})
        data["archivo"] = f"{supabase.storage_url}/noticias/archivos/{archivo.filename}"

    noticia = crud_noticias.update_noticia(noticia_id, data)
    return {"noticia": noticia}

# --- DELETE noticia ---
@router.delete("/{noticia_id}")
async def delete_noticia(noticia_id: int, user=Depends(verify_admin)):
    result = crud_noticias.delete_noticia(noticia_id)
    return {"deleted": result}
