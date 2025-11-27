-- Script para Reparar/Crear Políticas RLS SOLO para el Carrito

-- ============================================
-- 1. HABILITAR RLS EN TABLAS
-- ============================================

ALTER TABLE IF EXISTS carritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS carrito_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS producto ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. ELIMINAR SOLO POLÍTICAS DEL CARRITO (antiguas)
-- ============================================

DROP POLICY IF EXISTS "Usuarios pueden ver su propio carrito" ON carritos;
DROP POLICY IF EXISTS "Usuarios pueden crear carrito" ON carritos;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su carrito" ON carritos;
DROP POLICY IF EXISTS "Usuarios pueden eliminar su carrito" ON carritos;

DROP POLICY IF EXISTS "Usuarios pueden ver items de su carrito" ON carrito_items;
DROP POLICY IF EXISTS "Usuarios pueden agregar items a su carrito" ON carrito_items;
DROP POLICY IF EXISTS "Usuarios pueden actualizar items de su carrito" ON carrito_items;
DROP POLICY IF EXISTS "Usuarios pueden eliminar items de su carrito" ON carrito_items;

-- Eliminar políticas nuevas si existen (para limpiar)
DROP POLICY IF EXISTS "carritos_select_own" ON carritos;
DROP POLICY IF EXISTS "carritos_insert_own" ON carritos;
DROP POLICY IF EXISTS "carritos_update_own" ON carritos;
DROP POLICY IF EXISTS "carritos_delete_own" ON carritos;

DROP POLICY IF EXISTS "carrito_items_select_own" ON carrito_items;
DROP POLICY IF EXISTS "carrito_items_insert_own" ON carrito_items;
DROP POLICY IF EXISTS "carrito_items_update_own" ON carrito_items;
DROP POLICY IF EXISTS "carrito_items_delete_own" ON carrito_items;

-- ============================================
-- 3. CREAR POLÍTICAS RLS PARA CARRITOS
-- ============================================

-- SELECT: Solo ver tu propio carrito
CREATE POLICY "carritos_select_own"
  ON carritos FOR SELECT
  USING (auth.uid() = usuario_id);

-- INSERT: Solo crear carrito para ti mismo
CREATE POLICY "carritos_insert_own"
  ON carritos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- UPDATE: Solo actualizar tu propio carrito
CREATE POLICY "carritos_update_own"
  ON carritos FOR UPDATE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- DELETE: Solo eliminar tu propio carrito
CREATE POLICY "carritos_delete_own"
  ON carritos FOR DELETE
  USING (auth.uid() = usuario_id);

-- ============================================
-- 4. CREAR POLÍTICAS RLS PARA CARRITO_ITEMS
-- ============================================

-- SELECT: Solo ver items de tu carrito
CREATE POLICY "carrito_items_select_own"
  ON carrito_items FOR SELECT
  USING (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  );

-- INSERT: Solo agregar items a tu carrito
CREATE POLICY "carrito_items_insert_own"
  ON carrito_items FOR INSERT
  WITH CHECK (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  );

-- UPDATE: Solo actualizar items de tu carrito
CREATE POLICY "carrito_items_update_own"
  ON carrito_items FOR UPDATE
  USING (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  )
  WITH CHECK (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  );

-- DELETE: Solo eliminar items de tu carrito
CREATE POLICY "carrito_items_delete_own"
  ON carrito_items FOR DELETE
  USING (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  );

-- ============================================
-- 5. CREAR POLÍTICAS RLS PARA PRODUCTO
-- ============================================

-- SELECT: Todos pueden ver productos (lectura pública)
CREATE POLICY "producto_select_all"
  ON producto FOR SELECT
  USING (true);

-- ============================================
-- 6. VERIFICAR QUE RLS ESTÉ ACTIVO
-- ============================================

-- Ejecuta esto para verificar que RLS esté habilitado:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('carritos', 'carrito_items', 'producto');

-- Debería mostrar:
-- tablename    | rowsecurity
-- carritos     | t
-- carrito_items | t
-- producto     | t

-- ============================================
-- 6. VER TODAS LAS POLÍTICAS ACTUALES
-- ============================================

-- Para ver todas las políticas del proyecto:
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
