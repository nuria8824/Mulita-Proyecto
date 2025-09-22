from fastapi import HTTPException, Header
from config import supabase

def verify_admin(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")

    token = authorization.split(" ")[1]

    user_resp = supabase.auth.api.get_user(token)
    user = getattr(user_resp, "user", None)

    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    if user.user_metadata.get("rol") not in ["admin", "superAdmin"]:
        raise HTTPException(status_code=403, detail="No tienes permisos")

    return user
