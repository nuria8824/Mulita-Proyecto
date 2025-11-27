-- Crear tabla de carritos
CREATE TABLE IF NOT EXISTS carritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) DEFAULT 0,
  cantidad_items INTEGER DEFAULT 0,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id)
);

-- Crear tabla de items del carrito
CREATE TABLE IF NOT EXISTS carrito_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrito_id UUID NOT NULL REFERENCES carritos(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  precio DECIMAL(10, 2) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW(),
  UNIQUE(carrito_id, producto_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_carritos_usuario_id ON carritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_carrito_items_carrito_id ON carrito_items(carrito_id);
CREATE INDEX IF NOT EXISTS idx_carrito_items_producto_id ON carrito_items(producto_id);

-- Políticas de Row Level Security (RLS)
ALTER TABLE carritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrito_items ENABLE ROW LEVEL SECURITY;

-- Políticas para carritos
CREATE POLICY "Usuarios pueden ver su propio carrito"
  ON carritos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear carrito"
  ON carritos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar su carrito"
  ON carritos FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar su carrito"
  ON carritos FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para items del carrito
CREATE POLICY "Usuarios pueden ver items de su carrito"
  ON carrito_items FOR SELECT
  USING (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden agregar items a su carrito"
  ON carrito_items FOR INSERT
  WITH CHECK (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden actualizar items de su carrito"
  ON carrito_items FOR UPDATE
  USING (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden eliminar items de su carrito"
  ON carrito_items FOR DELETE
  USING (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  );
