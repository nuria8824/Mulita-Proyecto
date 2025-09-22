-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'usuario',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imagen" TEXT
);

-- CreateTable
CREATE TABLE "Docente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "institucion" TEXT,
    "pais" TEXT,
    "provincia" TEXT,
    "ciudad" TEXT,
    CONSTRAINT "Docente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_usuarioId_key" ON "Docente"("usuarioId");
