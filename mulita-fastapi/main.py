from fastapi import FastAPI
from routers import noticias  # <-- importamos el router de noticias

app = FastAPI(
    title="API de Noticias",
    description="Backend para manejar noticias con autenticación",
    version="1.0.0",
)

# Registramos el router
app.include_router(
    noticias.router,  # router definido en /routers/noticias.py
    prefix="/noticias",  # todas las rutas del router van a empezar con /noticias
    tags=["Noticias"]   # tag opcional para la documentación Swagger
)
