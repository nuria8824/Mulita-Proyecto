-- CreateTable
CREATE TABLE "Noticia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "introduccion" TEXT NOT NULL,
    "imagenPrincipal" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "archivo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
