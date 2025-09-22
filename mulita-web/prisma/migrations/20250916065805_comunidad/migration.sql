-- CreateTable
CREATE TABLE "Actividad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "archivo" TEXT,
    CONSTRAINT "Actividad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ActividadCategorias" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ActividadCategorias_A_fkey" FOREIGN KEY ("A") REFERENCES "Actividad" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ActividadCategorias_B_fkey" FOREIGN KEY ("B") REFERENCES "Categoria" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_usuarioId_key" ON "Actividad"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "_ActividadCategorias_AB_unique" ON "_ActividadCategorias"("A", "B");

-- CreateIndex
CREATE INDEX "_ActividadCategorias_B_index" ON "_ActividadCategorias"("B");
