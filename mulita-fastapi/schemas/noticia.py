from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NoticiaBase(BaseModel):
    titulo: str
    autor: str
    introduccion: str
    descripcion: str
    imagen_principal: Optional[str] = None
    archivo: Optional[str] = None

class NoticiaCreate(NoticiaBase):
    pass

class NoticiaUpdate(BaseModel):
    titulo: Optional[str] = None
    autor: Optional[str] = None
    introduccion: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_principal: Optional[str] = None
    archivo: Optional[str] = None

class NoticiaOut(NoticiaBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
