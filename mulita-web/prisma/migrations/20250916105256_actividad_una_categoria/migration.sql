/*
  Warnings:

  - You are about to drop the `_ActividadToCategoria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_ActividadToCategoria_B_index";

-- DropIndex
DROP INDEX "_ActividadToCategoria_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ActividadToCategoria";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Actividad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "archivo" TEXT,
    "categoriaId" INTEGER,
    CONSTRAINT "Actividad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Actividad_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Actividad" ("archivo", "descripcion", "fecha", "id", "titulo", "usuarioId") SELECT "archivo", "descripcion", "fecha", "id", "titulo", "usuarioId" FROM "Actividad";
DROP TABLE "Actividad";
ALTER TABLE "new_Actividad" RENAME TO "Actividad";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
