/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `Actividad` table. All the data in the column will be lost.

*/
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
    CONSTRAINT "Actividad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Actividad" ("archivo", "descripcion", "fecha", "id", "titulo", "usuarioId") SELECT "archivo", "descripcion", "fecha", "id", "titulo", "usuarioId" FROM "Actividad";
DROP TABLE "Actividad";
ALTER TABLE "new_Actividad" RENAME TO "Actividad";
CREATE UNIQUE INDEX "Actividad_usuarioId_key" ON "Actividad"("usuarioId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
