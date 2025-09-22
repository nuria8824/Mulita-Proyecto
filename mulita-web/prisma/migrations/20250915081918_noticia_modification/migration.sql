/*
  Warnings:

  - You are about to drop the `NoticiaArchivo` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Noticia" ADD COLUMN "archivo" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NoticiaArchivo";
PRAGMA foreign_keys=on;
