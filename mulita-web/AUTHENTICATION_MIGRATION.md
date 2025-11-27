# Migración de Autenticación: Backend a Frontend con SDK de Supabase

## Resumen de los Cambios

Hemos migrado el flujo de autenticación desde el backend hacia el frontend utilizando el SDK de Supabase. Esto permite que el cliente realice operaciones directamente con Supabase mientras mantenemos la validación y persistencia en el backend.

## Nuevo Flujo de Autenticación

### 1. Login (Frontend)
- El usuario ingresa email y contraseña en [`/app/auth/login/page.tsx`](src/app/auth/login/page.tsx)
- Se utiliza el SDK de Supabase para autenticar directamente: `supabase.auth.signInWithPassword()`
- Si la autenticación es exitosa, se envían los tokens al endpoint `/api/auth/validate-token`

### 2. Validación y Creación de Cookies (Backend)
- El endpoint [`/api/auth/validate-token/route.ts`](src/app/api/auth/validate-token/route.ts) recibe los tokens
- Valida los tokens con Supabase
- Obtiene datos adicionales del usuario (perfil, rol, etc.)
- Crea cookies HTTP-only para persistencia de sesión

### 3. Sincronización de Sesión
- El [`UserContext`](src/context/UserContext.tsx) se sincroniza con el estado de autenticación de Supabase
- Utiliza `onAuthStateChange` para detectar cambios en la autenticación
- Mantiene el estado del usuario actualizado

### 4. Middleware de Autenticación
- El [`middleware.ts`](src/middleware.ts) verifica las cookies de autenticación
- Puede refrescar tokens automáticamente usando refresh tokens
- Valida permisos de acceso a rutas protegidas

## Archivos Modificados

### 1. Cliente de Supabase
- **Archivos**:
  - [`src/lib/supabase.ts`](src/lib/supabase.ts) - Cliente para frontend
  - [`src/lib/supabase-server.ts`](src/lib/supabase-server.ts) - Cliente para servidor
- **Cambios**:
  - Creación de `createClientSupabase()` para el frontend con persistencia en localStorage
  - Separación de `supabaseServer` en archivo dedicado para operaciones del servidor
  - Manejo diferenciado entre cliente y servidor para evitar conflictos de importación

### 2. Página de Login
- **Archivo**: [`src/app/auth/login/page.tsx`](src/app/auth/login/page.tsx)
- **Cambios**:
  - Uso directo del SDK de Supabase para autenticación
  - Envío de tokens a `/api/auth/validate-token` para validación
  - Manejo de estados de carga

### 3. Nuevo Endpoint de Validación
- **Archivo**: [`src/app/api/auth/validate-token/route.ts`](src/app/api/auth/validate-token/route.ts)
- **Función**: Validar tokens del frontend y crear cookies HTTP-only

### 4. Contexto de Usuario
- **Archivo**: [`src/context/UserContext.tsx`](src/context/UserContext.tsx)
- **Cambios**:
  - Sincronización con estado de autenticación de Supabase
  - Manejo de eventos `onAuthStateChange`
  - Logout mejorado que limpia tanto frontend como backend

### 5. Middleware
- **Archivo**: [`src/middleware.ts`](src/middleware.ts)
- **Cambios**:
  - Uso de `supabaseServer` para validación
  - Refresco automático de tokens
  - Mejor manejo de errores

### 6. Endpoint /me
- **Archivo**: [`src/app/api/auth/me/route.ts`](src/app/api/auth/me/route.ts)
- **Cambios**:
  - Uso de `supabaseServer`
  - Inclusión de todos los datos del usuario incluyendo `acceso_comunidad` y `docente`

## Ventajas del Nuevo Flujo

1. **Mejor UX**: Respuestas más rápidas al autenticar directamente desde el frontend
2. **Operaciones Directas**: El SDK de Supabase está autorizado para realizar operaciones desde el frontend
3. **Persistencia Dual**: Tanto en localStorage (frontend) como en cookies (backend)
4. **Sincronización Automática**: El contexto se mantiene sincronizado con Supabase
5. **Refresco de Tokens**: Manejo automático de refresh tokens

## Ejemplos de Uso del SDK

Ver [`src/lib/supabase-client-example.ts`](src/lib/supabase-client-example.ts) para ejemplos completos de cómo utilizar el SDK de Supabase directamente desde el frontend:

### Operaciones Comunes
```typescript
import { createClientSupabase } from '@/lib/supabase';

const supabase = createClientSupabase();

// Leer datos
const { data } = await supabase.from('actividades').select('*');

// Escribir datos
const { data } = await supabase.from('actividades').insert({ titulo: 'Nueva actividad' });

// Subir archivos
const { data } = await supabase.storage.from('bucket').upload('path', file);

// Suscripciones en tiempo real
const subscription = supabase.channel('table').on('postgres_changes', callback).subscribe();
```

## Consideraciones de Seguridad

1. **Cookies HTTP-Only**: Los tokens sensibles se almacenan en cookies HTTP-only
2. **Validación Backend**: Todos los tokens se validan en el backend antes de crear cookies
3. **RLS**: Las políticas de Row Level Security de Supabase siguen aplicándose
4. **Permisos**: El middleware sigue validando permisos de acceso a rutas

## Pruebas

Para probar el nuevo flujo:

1. Inicia sesión en la aplicación
2. Verifica que se creen las cookies `sb-access-token` y `sb-refresh-token`
3. Navega a rutas protegidas (/comunidad, /dashboard)
4. Intenta operaciones CRUD usando el SDK directamente
5. Verifica que las suscripciones en tiempo real funcionen

## Migration Checklist

- [x] Crear cliente de Supabase para frontend
- [x] Modificar página de login
- [x] Crear endpoint de validación
- [x] Actualizar UserContext
- [x] Modificar middleware
- [x] Actualizar endpoint /me
- [ ] Probar flujo completo
- [ ] Actualizar componentes para usar SDK directamente
- [ ] Documentar para el equipo