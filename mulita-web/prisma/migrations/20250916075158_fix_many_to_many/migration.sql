/*
  Warnings:

  - You are about to drop the `_ActividadCategorias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Actividad_usuarioId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ActividadCategorias";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_ActividadToCategoria" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ActividadToCategoria_A_fkey" FOREIGN KEY ("A") REFERENCES "Actividad" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ActividadToCategoria_B_fkey" FOREIGN KEY ("B") REFERENCES "Categoria" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActividadToCategoria_AB_unique" ON "_ActividadToCategoria"("A", "B");

-- CreateIndex
CREATE INDEX "_ActividadToCategoria_B_index" ON "_ActividadToCategoria"("B");
