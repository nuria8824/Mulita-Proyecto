# Mulita Web - Documentación Técnica Completa del Proyecto

## Índice
1. Visión General del Proyecto
2. Stack Tecnológico
3. Arquitectura General
4. Estructura de Carpetas
5. Componentes Principales
6. Páginas (Rutas)
7. Autenticación y Seguridad
8. Base de Datos (Supabase)
9. API Routes
10. Sistema de Carrito
11. Flujos Principales
12. Decisiones Técnicas

---

## 1. Visión General del Proyecto

### Qué es Mulita

Mulita es una plataforma web de e-commerce que permite:
- Comprar productos en una tienda online
- Crear y gestionar comunidad de usuarios
- Leer noticias y artículos
- Ver información sobre la empresa
- Gestionar perfil de usuario
- Carrito de compras persistente
- Panel de administración para gestionar contenido

### Usuarios del Sistema

- **Usuario Anónimo**: Puede ver productos, noticias, información
- **Usuario Registrado**: Puede comprar, participar en comunidad, editar perfil
- **Administrador**: Puede gestionar todo el contenido (dashboard)

---

## 2. Stack Tecnológico

### Frontend

- **Next.js 15.4.6**: Framework React con SSR/SSG
  - Por qué: Excelente para e-commerce (SEO, performance)
  - Turbopack: Compilación super rápida en desarrollo
  
- **React 19.1.0**: Librería UI
  - Por qué: Standard de la industria, componentes reutilizables
  
- **TypeScript 5**: Tipado estático
  - Por qué: Previene errores, mejor DX (developer experience)
  
- **TailwindCSS 4.1.12**: Estilos CSS
  - Por qué: Utility-first, rápido de desarrollar, responsive built-in
  
- **Lucide React**: Iconos SVG
  - Por qué: Ligero, muchos iconos, fácil de personalizar

### Backend

- **Next.js API Routes**: Backend en la misma aplicación
  - Por qué: Monolítico, una sola app, fácil de desplegar
  
- **Node.js**: Runtime de JavaScript
  - Por qué: JavaScript full-stack (frontend y backend)

### Base de Datos

- **Supabase PostgreSQL**: Base de datos relacional
  - Por qué: PostgreSQL gestionado, autenticación built-in, RLS
  
- **Row Level Security (RLS)**: Seguridad a nivel de datos
  - Por qué: Proteger datos de usuarios del frontend

### Autenticación

- **Supabase Auth**: Sistema de autenticación
  - Por qué: OAuth, JWT, manejo de sesiones automático
  
- **JWT Tokens**: En cookies para validación de servidor

### Almacenamiento

- **Supabase Storage**: Archivos en cloud
  - Por qué: Integrado con Supabase, escalable

---

## 3. Arquitectura General

### Capas de la Aplicación

```
┌─────────────────────────────────────────────────┐
│         Navegador (Frontend React)              │
│                                                 │
│  ├─ Páginas (pages/)                           │
│  ├─ Componentes (components/)                  │
│  └─ Contextos (context/)                       │
└──────────────────┬──────────────────────────────┘
                   │ HTTPS / Cookies
                   v
┌─────────────────────────────────────────────────┐
│      Next.js Server (API Routes)                │
│                                                 │
│  ├─ Validación de autenticación                │
│  ├─ Lógica de negocio                          │
│  └─ Consultas a base de datos                  │
└──────────────────┬──────────────────────────────┘
                   │ SDK Supabase
                   v
┌─────────────────────────────────────────────────┐
│    Supabase (PostgreSQL + Auth + Storage)       │
│                                                 │
│  ├─ Tablas de datos                            │
│  ├─ Políticas RLS                              │
│  ├─ Autenticación de usuarios                  │
│  └─ Almacenamiento de archivos                 │
└─────────────────────────────────────────────────┘
```

### Flujo de Solicitud

```
1. Usuario interactúa con la UI
   ↓
2. Componente React hace fetch() a API Route
   (con token en headers/cookies)
   ↓
3. API Route recibe la solicitud
   ↓
4. Valida el token y obtiene el usuario
   ↓
5. Ejecuta lógica de negocio
   ↓
6. Consulta Supabase con supabaseAdmin
   (después de validar al usuario)
   ↓
7. Retorna datos al cliente
   ↓
8. Componente actualiza su estado y re-renderiza
```

---

## 4. Estructura de Carpetas

```
mulita-web/
│
├── src/
│   ├── app/
│   │   ├── page.tsx                          // Página de inicio
│   │   ├── layout.tsx                        // Layout principal (CartProvider, Header, Footer)
│   │   ├── globals.css                       // Estilos globales
│   │   │
│   │   ├── api/                              // API Routes del servidor
│   │   │   ├── auth/                         // Autenticación
│   │   │   │   ├── login/
│   │   │   │   ├── logout/
│   │   │   │   ├── register/
│   │   │   │   └── me/                       // Usuario actual
│   │   │   │
│   │   │   ├── carrito/                      // Carrito de compras
│   │   │   │   ├── route.ts                  // GET, POST, DELETE
│   │   │   │   └── [id]/                     // Items específicos
│   │   │   │       └── route.ts              // PUT, DELETE
│   │   │   │
│   │   │   ├── productos/                    // Gestión de productos
│   │   │   ├── categorias/
│   │   │   ├── colecciones/
│   │   │   ├── noticias/
│   │   │   ├── usuarios/
│   │   │   ├── comunidad/
│   │   │   └── sobreNosotros/
│   │   │
│   │   ├── auth/                             // Páginas de autenticación
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── confirm/page.tsx
│   │   │
│   │   ├── tienda/                           // Páginas de compra
│   │   │   ├── page.tsx                      // Listado de productos
│   │   │   └── carrito/page.tsx              // Página del carrito
│   │   │
│   │   ├── productos/                        // Gestión de productos (admin)
│   │   │   ├── crear/page.tsx
│   │   │   ├── editar/[id]/page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── noticias/                         // Gestión de noticias
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   ├── crear/page.tsx
│   │   │   └── editar/[id]/page.tsx
│   │   │
│   │   ├── colecciones/                      // Colecciones de productos
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── comunidad/                        // Comunidad de usuarios
│   │   │   ├── page.tsx
│   │   │   ├── actividades/
│   │   │   └── comentarios/
│   │   │
│   │   ├── perfil/                           // Perfil de usuario
│   │   │   ├── [id]/page.tsx                 // Ver perfil
│   │   │   └── editar/[id]/page.tsx          // Editar perfil
│   │   │
│   │   ├── sobreNosotros/                    // Información de empresa
│   │   │   ├── page.tsx
│   │   │   ├── quienesSomos/
│   │   │   ├── misionVision/
│   │   │   ├── dondeEstamos/
│   │   │   └── secciones/
│   │   │
│   │   ├── dashboard/                        // Panel de administración
│   │   │   ├── page.tsx                      // Dashboard principal
│   │   │   ├── layout.tsx
│   │   │   ├── gestionLanding/               // Gestión landing
│   │   │   ├── gestionNoticias/
│   │   │   ├── gestionProductos/
│   │   │   ├── gestionCategories/
│   │   │   └── gestionUsuarios/
│   │   │
│   │   └── middleware.ts                     // Middleware para rutas protegidas
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Header.tsx                    // Header principal
│   │   │   ├── Footer.tsx                    // Footer
│   │   │   ├── CartIcon.tsx                  // Ícono carrito
│   │   │   ├── CartPage.tsx                  // Página carrito
│   │   │   ├── AddToCartButton.tsx           // Botón agregar carrito
│   │   │   ├── CarritoPage.tsx               // Página completa carrito
│   │   │   ├── MenuAccionesHeaderPrincipal.tsx
│   │   │   ├── UserSearch.tsx
│   │   │   │
│   │   │   ├── tienda/                       // Componentes de tienda
│   │   │   │   └── Productos.tsx
│   │   │   │
│   │   │   ├── noticias/
│   │   │   ├── productos/
│   │   │   ├── perfil/
│   │   │   ├── dashboard/
│   │   │   ├── comunidad/
│   │   │   ├── inicio/
│   │   │   └── sobre-nosotros/
│   │   │
│   │   └── (otros componentes compartidos)
│   │
│   ├── context/
│   │   ├── CartContext.tsx                   // Estado global del carrito
│   │   └── UserContext.tsx                   // Estado del usuario (si existe)
│   │
│   ├── lib/
│   │   ├── supabase.ts                       // Clientes de Supabase
│   │   └── subirArchivos.ts                  // Utilidad para upload
│   │
│   └── types/
│       └── next-auth.d.ts                    // Tipos de autenticación
│
├── public/
│   ├── imagenes/
│   │   └── noticias/
│   │
│   └── images/
│       ├── icons/
│       │   ├── comunidad/
│       │   ├── dashboard/
│       │   │   └── gestionLanding/
│       │   ├── perfil/
│       │   └── productos/
│       │
│       └── logosMulita/
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
│
└── .env.local                                // Variables de entorno (no commitear)
```

---

## 5. Componentes Principales

### Header.tsx

**Propósito**: Navegación principal del sitio

**Elementos**:
- Logo de Mulita
- Menú de navegación (Tienda, Noticias, Comunidad, Sobre Nosotros)
- CartIcon (muestra cantidad de items)
- Menú de usuario (Login, Logout, Perfil)
- UserSearch (búsqueda)

**Características**:
- Responsivo (mobile/desktop)
- Se actualiza cuando usuario se autentica
- CartIcon se actualiza automáticamente

### Footer.tsx

**Propósito**: Información y enlaces en pie de página

**Elementos**:
- Links útiles
- Información de contacto
- Redes sociales

### CartIcon.tsx

**Propósito**: Badge en header mostrando cantidad de items

**Características**:
- Se actualiza en tiempo real
- Usa CartContext para obtener cantidad
- Linkea a /tienda/carrito

### CarritoPage.tsx

**Propósito**: Página completa del carrito

**Funcionalidades**:
- Lista de items con imagen, nombre, precio
- Modificar cantidad (con debounce)
- Eliminar items
- Vaciar carrito
- Resumen con total
- Botón para proceder al pago

---

## 6. Páginas (Rutas)

### Rutas Públicas

- `/` - Inicio (landing page)
- `/tienda` - Listado de productos
- `/tienda/carrito` - Carrito de compras
- `/noticias` - Listado de noticias
- `/noticias/[id]` - Detalle de noticia
- `/colecciones/[id]` - Detalle de colección
- `/sobreNosotros` - Información de la empresa
- `/comunidad` - Comunidad de usuarios
- `/perfil/[id]` - Ver perfil de usuario

### Rutas de Autenticación

- `/auth/login` - Iniciar sesión
- `/auth/register` - Registrarse
- `/auth/confirm` - Confirmar email

### Rutas Protegidas (Requiere Autenticación)

- `/tienda/carrito` - Ver carrito
- `/perfil/editar/[id]` - Editar perfil
- `/noticias/crear` - Crear noticia (admin)
- `/noticias/editar/[id]` - Editar noticia
- `/productos/crear` - Crear producto (admin)
- `/productos/editar` - Editar producto
- `/comunidad/actividades/crear` - Crear actividad
- `/dashboard/*` - Panel de administración (admin)

### Protección de Rutas

Se implementa mediante:
1. **Middleware** (`src/middleware.ts`): Valida token antes de acceder
2. **Componentes**: Verifican si usuario está autenticado
3. **API Routes**: Rechazan peticiones sin token válido

---

## 7. Autenticación y Seguridad

### Flujo de Login

```
1. Usuario completa formulario en /auth/login
   ├─ Email
   └─ Contraseña
   
2. Formulario hace POST a /api/auth/login
   
3. API Route:
   - Valida que email y contraseña no estén vacíos
   - Llama: supabase.auth.signInWithPassword(email, password)
   - Supabase valida credenciales
   
4. Si es correcto:
   - Retorna tokens JWT
   - Se guardan en cookies (sb-access-token, etc)
   - Se redirige a /tienda
   
5. Si es incorrecto:
   - Retorna error 401
   - Se muestra mensaje de error al usuario
```

### Flujo de Registro

```
1. Usuario completa formulario en /auth/register
   ├─ Email
   ├─ Contraseña
   └─ Nombre completo
   
2. Formulario hace POST a /api/auth/register
   
3. API Route:
   - Valida que datos no estén vacíos
   - Llama: supabase.auth.signUp(email, password, data)
   - Supabase crea usuario
   - Envía email de confirmación
   
4. Si es correcto:
   - Se muestra: "Verifica tu email"
   - Usuario recibe email con link de confirmación
   
5. Usuario hace click en link
   - Va a /auth/confirm
   - Se confirma el email
   - Usuario puede iniciar sesión
```

### Tokens y Cookies

**JWT Token** (`sb-access-token`):
- Se genera cuando usuario inicia sesión
- Se guarda en cookie httpOnly (no accesible desde JavaScript)
- Se envía automáticamente en cada request
- Contiene ID del usuario y otros datos

**Validación en Servidor**:
```typescript
const access_token = (await cookies()).get("sb-access-token")?.value;
const { data: { user } } = await supabase.auth.getUser(access_token);

// Ahora tenemos el usuario validado
```

### Row Level Security (RLS)

Políticas SQL que protegen los datos:

```sql
-- Solo ver tu propio carrito
CREATE POLICY "Usuarios pueden ver su propio carrito"
  ON carritos FOR SELECT
  USING (auth.uid() = usuario_id);

-- Solo ver tus propios items
CREATE POLICY "Usuarios pueden ver items de su carrito"
  ON carrito_items FOR SELECT
  USING (
    carrito_id IN (
      SELECT id FROM carritos WHERE usuario_id = auth.uid()
    )
  );
```

**Cómo funciona**:
- Cada consulta a Supabase se filtra automáticamente
- Si intentas acceder a datos ajenos, Supabase rechaza
- Incluso si alguien manipula el cliente, la BD protege

---

## 8. Base de Datos (Supabase)

### Tablas Principales

#### auth.users
- Id del usuario
- Email
- Contraseña (hasheada)
- Metadatos (nombre, etc)

#### Tabla: producto
- id (UUID)
- nombre
- descripcion
- imagen
- precio
- categoria_id (relación)
- eliminado (soft delete)
- Timestamps

#### Tabla: categoria
- id
- nombre
- descripcion

#### Tabla: colecciones
- id
- nombre
- descripcion
- imagen

#### Tabla: noticias
- id
- titulo
- contenido
- imagen
- autor_id (relación a usuarios)
- Timestamps

#### Tabla: usuarios (perfil extendido)
- id (relación a auth.users)
- nombre_completo
- bio
- avatar
- ciudad
- pais
- Timestamps

#### Tabla: carritos
- id
- usuario_id
- total
- cantidad_items
- Timestamps

#### Tabla: carrito_items
- id
- carrito_id
- producto_id
- cantidad
- precio

#### Tabla: comunidad_actividades
- id
- usuario_id
- titulo
- descripcion
- Timestamps

#### Tabla: comunidad_comentarios
- id
- actividad_id
- usuario_id
- contenido
- Timestamps

### Relaciones

```
auth.users
  ├─ 1 a muchos → noticias (autor)
  ├─ 1 a muchos → carritos
  ├─ 1 a muchos → comunidad_actividades
  ├─ 1 a muchos → comunidad_comentarios
  └─ 1 a 1 → usuarios (perfil extendido)

carritos
  └─ 1 a muchos → carrito_items

carrito_items
  ├─ muchos a 1 → producto
  └─ muchos a 1 → carritos

producto
  ├─ muchos a 1 → categoria
  └─ 1 a muchos → carrito_items

noticias
  └─ muchos a 1 → usuarios (autor)
```

---

## 9. API Routes - Resumen

### Autenticación (`/api/auth/*`)

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Carrito (`/api/carrito/*`)

- `GET /api/carrito` - Obtener carrito
- `POST /api/carrito` - Agregar item
- `DELETE /api/carrito` - Vaciar carrito
- `PUT /api/carrito/[id]` - Actualizar cantidad
- `DELETE /api/carrito/[id]` - Eliminar item

### Productos (`/api/productos/*`)

- `GET /api/productos` - Listar productos (paginado)
- `GET /api/productos/[id]` - Detalle de producto
- `POST /api/productos` - Crear producto (admin)
- `PUT /api/productos/[id]` - Actualizar producto
- `DELETE /api/productos/[id]` - Eliminar producto

### Noticias (`/api/noticias/*`)

- `GET /api/noticias` - Listar noticias
- `GET /api/noticias/[id]` - Detalle de noticia
- `POST /api/noticias` - Crear noticia (admin)
- `PUT /api/noticias/[id]` - Actualizar noticia
- `DELETE /api/noticias/[id]` - Eliminar noticia

### Usuarios (`/api/usuarios/*`)

- `GET /api/usuarios` - Listar usuarios (admin)
- `GET /api/usuarios/[id]` - Detalle de usuario
- `PUT /api/usuarios/[id]` - Actualizar usuario
- `DELETE /api/usuarios/[id]` - Eliminar usuario

### Otros

- `/api/categorias` - Gestión de categorías
- `/api/colecciones` - Gestión de colecciones
- `/api/comunidad/actividades` - Actividades de comunidad
- `/api/comunidad/comentarios` - Comentarios

---

## 10. Sistema de Carrito (Completo)

Ver documento `CARRITO_DOCUMENTACION_TECNICA.md` para detalles completos.

**Resumen**:
- Context + API para estado global
- Debounce en input de cantidad
- Sincronización en tiempo real
- Validación en servidor
- Seguridad con RLS

---

## 11. Flujos Principales

### Flujo: Usuario Compra un Producto

```
1. Usuario navega a /tienda
2. Ve lista de productos
3. Hace click en "Agregar al carrito"
4. Se ejecuta AddToCartButton
   ├─ Llama: addItem(producto_id, cantidad, precio)
   ├─ POST a /api/carrito
   ├─ API valida token
   ├─ API crea/actualiza carrito
   └─ CartContext se actualiza
5. CartIcon muestra nueva cantidad
6. Notificación de éxito
7. Usuario puede ver carrito en /tienda/carrito
```

### Flujo: Usuario Lee Noticia

```
1. Usuario navega a /noticias
2. Ve lista de noticias
3. Hace click en una noticia
4. Va a /noticias/[id]
5. API GET /api/noticias/[id] trae los datos
6. Página muestra: título, contenido, autor, fecha
```

### Flujo: Admin Crea Producto

```
1. Admin navega a /dashboard/gestionProductos
2. Hace click en "Nuevo Producto"
3. Va a /productos/crear
4. Completa formulario:
   - Nombre
   - Descripción
   - Precio
   - Imagen
   - Categoría
5. Hace click en "Guardar"
6. POST a /api/productos
7. API crea el producto
8. Sube imagen a Storage si aplica
9. Redirecciona a /dashboard/gestionProductos
```

### Flujo: Usuario Crea Actividad en Comunidad

```
1. Usuario autenticado navega a /comunidad
2. Hace click en "Nueva Actividad"
3. Va a /comunidad/actividades/crear
4. Completa formulario:
   - Título
   - Descripción
5. Hace click en "Publicar"
6. POST a /api/comunidad/actividades
7. API crea la actividad
8. Se muestra en la página de comunidad
9. Otros usuarios pueden comentar
```

---

## 12. Decisiones Técnicas

### 1. Monolítico vs Microservicios

**Decisión**: Monolítico (Frontend + Backend en Next.js)

**Razones**:
- Proyecto mediano, no justifica complejidad de microservicios
- Fácil de desplegar (una sola app)
- Compartir código entre frontend y backend
- Menos overhead de comunicación

**Futuro**: Si crece mucho, se puede separar backend a Express/Node

### 2. React Context vs Redux

**Decisión**: React Context

**Razones**:
- Contexto es suficiente para este proyecto
- Redux añade complejidad innecesaria
- Menos boilerplate
- Integración perfecta con Next.js

### 3. CSS-in-JS vs TailwindCSS

**Decisión**: TailwindCSS

**Razones**:
- Utility-first es muy rápido
- Built-in responsive design
- Tema centralizado
- Archivo CSS único (eficiente)
- Comunidad grande

### 4. Supabase vs Firebase

**Decisión**: Supabase

**Razones**:
- PostgreSQL > Firestore (queries más flexibles)
- RLS es más poderoso que Firebase rules
- Código SQL vs propietario
- Mejor para relaciones complejas
- Supabase Storage comparable a Firebase

### 5. JWT en Cookies vs LocalStorage

**Decisión**: Cookies httpOnly

**Razones**:
- httpOnly = no accesible desde JavaScript (protege de XSS)
- Se envían automáticamente en requests
- Más seguro que localStorage
- Cookie-based sessions es estándar

### 6. Soft Delete vs Hard Delete

**Decisión**: Soft delete (campo "eliminado")

**Razones**:
- Recuperación: si se borra accidentalmente, se recupera
- Auditoría: siempre hay registro
- Relaciones: no se rompen foreign keys

**Implementación**:
```typescript
// No eliminar, marcar como eliminado
UPDATE producto SET eliminado = true WHERE id = ?

// Siempre filtrar en SELECT
SELECT * FROM producto WHERE eliminado = false
```

### 7. Desnormalización de Datos

**Decisión**: Guardar total y cantidad en carritos

**Razones**:
- Performance: no necesita calcular siempre
- UX: datos disponibles rápido
- Compensamos manteniéndolos sincronizados

**Trade-off**:
- Complejidad: más código para mantener sincronizado
- Riesgo: si se desincronizan, hay inconsistencia

---

## Próximas Mejoras

1. **Sistema de Pagos**: Integrar Stripe/MercadoPago
2. **Envíos**: Calcular y mostrar costo de envío
3. **Impuestos**: Sistema de cálculo de impuestos
4. **Cupones**: Códigos de descuento
5. **Búsqueda**: Integrar Elasticsearch
6. **Real-time**: Usar Supabase subscriptions para actualizaciones en vivo
7. **Testing**: Tests unitarios e integración
8. **Analytics**: Seguimiento de eventos
9. **Email**: Notificaciones por email
10. **Notificaciones**: Sistema de notificaciones en tiempo real

---

## Configuración Local

### Requisitos
- Node.js 18+
- npm o yarn
- Cuenta en Supabase

### Variables de Entorno (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_WHATSAPP_NUMBER=5491234567890
```

### Instalación
```bash
npm install
npm run dev
# Abre http://localhost:3000
```

---

## Deploy

Mulita está diseñado para desplegarse en Vercel:
- Conecta tu repo de GitHub
- Variables de entorno se configuran en Vercel
- Deploy automático en cada push a main
- Domain custom

---

## Conclusión

Mulita es una aplicación moderna de e-commerce construida con:
- Stack de JavaScript full-stack (React + Next.js)
- Seguridad en primer lugar (validación servidor, RLS)
- Performance optimizado (SSR, caching, debounce)
- Arquitectura escalable y mantenible

Cada decisión técnica fue tomada pensando en el futuro crecimiento del proyecto.
