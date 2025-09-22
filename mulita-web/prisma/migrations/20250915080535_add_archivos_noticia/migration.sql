/*
  Warnings:

  - You are about to drop the column `archivo` on the `Noticia` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "NoticiaArchivo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "noticiaId" INTEGER NOT NULL,
    CONSTRAINT "NoticiaArchivo_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "Noticia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Noticia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "introduccion" TEXT NOT NULL,
    "imagenPrincipal" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Noticia" ("autor", "createdAt", "descripcion", "id", "imagenPrincipal", "introduccion", "titulo") SELECT "autor", "createdAt", "descripcion", "id", "imagenPrincipal", "introduccion", "titulo" FROM "Noticia";
DROP TABLE "Noticia";
ALTER TABLE "new_Noticia" RENAME TO "Noticia";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
