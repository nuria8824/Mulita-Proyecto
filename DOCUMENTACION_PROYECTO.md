# Documentación Completa del Proyecto Mulita

## Tabla de Contenidos
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Tecnologías Principales](#tecnologías-principales)
3. [Arquitectura General](#arquitectura-general)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Configuración y Setup](#configuración-y-setup)
6. [Patrones de Implementación](#patrones-de-implementación)

---

## Resumen del Proyecto

**Mulita** es una plataforma web de **e-commerce y comunidad** desarrollada con tecnologías modernas. Permite:
- Compra y venta de productos
- Interacción en comunidad
- Gestión de usuarios y perfiles
- Sistema de autenticación seguro
- Diseño responsivo

---

## Tecnologías Principales

### 1. **Next.js 15.4.6**
**¿Qué es?** Framework React full-stack con App Router  
**¿Por qué se usa?** Proporciona SSR, SSG, API routes y optimizaciones automáticas  
**¿Qué problema resuelve?** Unifica frontend y backend en una sola aplicación

**Ubicaciones clave:**
- `src/app/` - App Router (rutas de la aplicación)
- `src/app/api/` - API routes (endpoints del servidor)
- `src/middleware.ts` - Middleware de autenticación


**Ventajas:**
- Rutas automáticas basadas en estructura de carpetas
- API routes sin necesidad de servidor externo
- Middleware para autenticación en borde
- Optimizaciones automáticas de imágenes y código

---

### 2. **React 19.1.0**
**¿Qué es?** Librería de UI con hooks y componentes reactivos  
**¿Por qué se usa?** Permite crear interfaces dinámicas y eficientes  
**¿Qué problema resuelve?** Sincronización automática entre estado y UI

**Características utilizadas:**
- **Hooks** - Manejo de estado y efectos
- **Context API** - Estado global (Usuario y Carrito)
- **Componentes funcionales** - Toda la UI

**Ejemplo de uso:**
```typescript
// Hook personalizado para autenticación
const { user, loading } = useUser();

// useEffect para efectos secundarios
useEffect(() => {
  if (!loading && !user) {
    toast.error("Debes iniciar sesión");
    router.push("/auth/login");
  }
}, [user, loading, router]);
```

---

### 3. **TypeScript 5**
**¿Qué es?** Superset de JavaScript con tipado estático  
**¿Por qué se usa?** Previene errores en tiempo de compilación  
**¿Qué problema resuelve?** Detecta bugs antes de que lleguen a producción

**Configuración:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Uso en el código:**
```typescript
// src/context/UserContext.tsx
interface User {
  id: string;
  email: string;
  rol: string;
  nombre: string;
  apellido: string;
  acceso_comunidad: boolean;
}

interface UserContextType {
  user: User | null;
  logout: () => Promise<void>;
  loading: boolean;
}
```

---

### 4. **Supabase**
**¿Qué es?** Backend-as-a-Service con PostgreSQL + Auth  
**¿Por qué se usa?** Proporciona base de datos, autenticación y storage en la nube  
**¿Qué problema resuelve?** Elimina la necesidad de crear servidor backend

**Estructura de uso:**

#### Cliente del Frontend (`supabase.ts`)
```typescript
// src/lib/supabase.ts
export const createClientSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storage: typeof window !== 'undefined' ? localStorage : undefined,
      },
    }
  );
};
```

**Características:**
- `ANON_KEY` - Clave pública para clientes
- Respeta Row Level Security (RLS)
- Persistencia en localStorage

#### Cliente del Servidor (`supabase-server.ts`)
```typescript
// src/lib/supabase-server.ts
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
);
```

**Características:**
- `SERVICE_ROLE_KEY` - Clave privada con permisos totales
- Bypassa RLS para operaciones administrativas
- Nunca se expone al cliente

**Ejemplo de uso en API:**
```typescript
// src/app/api/carrito/route.ts
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("sb-access-token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Obtener usuario autenticado
  const { data: { user }, error: userError } = await supabaseServer.auth.getUser(access_token);
  
  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Obtener carrito del usuario
  const { data: carrito } = await supabaseServer
    .from("carritos")
    .select("*")
    .eq("usuario_id", user.id)
    .single();

  return NextResponse.json({ carrito });
}
```

**Tablas principales:**
- `usuario` - Perfil de usuarios
- `carritos` - Carritos de compra
- `carrito_items` - Items en los carritos
- `producto` - Productos disponibles
- `perfil` - Información extendida del perfil

**RLS (Row Level Security):**
```sql
-- Solo ver tu propio carrito
CREATE POLICY "carritos_select_own"
  ON carritos FOR SELECT
  USING (auth.uid() = usuario_id);

-- Solo agregar items a tu carrito
CREATE POLICY "carrito_items_insert_own"
  ON carrito_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carritos 
      WHERE id = carrito_id 
      AND usuario_id = auth.uid()
    )
  );
```

---

### 5. **Tailwind CSS 4.1.12** 🎨
**¿Qué es?** Framework CSS utility-first  
**¿Por qué se usa?** Permite crear diseños rápidamente sin escribir CSS custom  
**¿Qué problema resuelve?** Acelera el desarrollo del UI y asegura consistencia

**Configuración:**
- `globals.css` - Estilos globales
- `postcss.config.mjs` - PostCSS con Tailwind
- Clases utility: `flex`, `gap-4`, `bg-gray-50`, etc.

**Ejemplo de uso:**
```tsx
<div className="flex bg-gray-50 min-h-screen">
  <aside className="w-60 bg-white shadow">Sidebar</aside>
  <main className="flex-1 overflow-auto p-6">
    <h1 className="text-3xl font-bold text-gray-900">Contenido</h1>
  </main>
</div>
```

---

### 6. **React Hot Toast 2.6.0** 
**¿Qué es?** Librería para mostrar notificaciones toast  
**¿Por qué se usa?** Proporciona feedback visual sin alerts feos  
**¿Qué problema resuelve?** Mejora UX con notificaciones elegantes

**Configuración:**
```tsx
// En layout.tsx
<Toaster position="top-right" />
```

**Ejemplo de uso en componentes:**
```tsx
import { toast } from "react-hot-toast";

// Mostrar error
toast.error("Debes iniciar sesión para agregar productos al carrito");

// Mostrar éxito
toast.success(`"${nombre}" añadido al carrito`);
```

**Usado en:**
- `src/components/ui/tienda/AddToCartButton.tsx` - Notificaciones de carrito
- `src/components/ui/comunidad/Comunidad.tsx` - Autenticación de comunidad
- Todas las páginas de creación/edición

---

### 7. **Lucide React 0.544.0** 
**¿Qué es?** Librería de iconos SVG  
**¿Por qué se usa?** Iconos consistentes y accesibles  
**¿Qué problema resuelve?** No necesitar crear/descargar iconos manualmente

**Ejemplo de uso:**
```tsx
import { ShoppingCart, Menu, X, Heart } from "lucide-react";

<button>
  <ShoppingCart className="w-5 h-5" />
  Carrito
</button>
```

---

### 8. **Context API** 
**¿Qué es?** Sistema nativo de React para estado global  
**¿Por qué se usa?** Evita prop drilling (pasar props múltiples niveles)  
**¿Qué problema resuelve?** Acceso a estado global sin librerías externas

#### UserContext
```typescript
// src/context/UserContext.tsx
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
  isSuperAdmin: () => boolean;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  };

  useEffect(() => {
    fetchUser();
    // Sincronizar con Supabase Auth
    const supabase = createClientSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          await fetchUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}
```

**Uso en componentes:**
```tsx
const { user, loading } = useUser();

if (loading) return <div>Cargando...</div>;
if (!user) return <div>Inicia sesión</div>;

return <div>Hola {user.nombre}</div>;
```

#### CartContext
```typescript
// src/context/CartContext.tsx
interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  addItem: (productoId: string, cantidad: number, precio: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, cantidad: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
```

---

### 9. **Middleware de Next.js** 🛡️
**¿Qué es?** Código que se ejecuta antes de cada request  
**¿Por qué se usa?** Proteger rutas y validar autenticación  
**¿Qué problema resuelve?** Control centralizado de acceso a rutas

```typescript
// src/middleware.ts
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  let access_token = req.cookies.get("sb-access-token")?.value;
  const refresh_token = req.cookies.get("sb-refresh-token")?.value;

  // Si no hay token pero hay refresh token, renovarlo
  if (!access_token && refresh_token) {
    const { data, error } = await supabaseServer.auth.refreshSession({ refresh_token });
    if (!error && data.session) {
      access_token = data.session.access_token;
      // Actualizar cookies...
    }
  }

  // Si no hay token, redirigir al home
  if (!access_token) {
    url.pathname = "/";
    url.searchParams.set("mensaje", "Sesión cerrada o no iniciada");
    return NextResponse.redirect(url);
  }

  // Validar token
  const { data: { user }, error } = await supabaseServer.auth.getUser(access_token);
  if (error || !user) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return await checkPermissions(req, NextResponse.next(), user, access_token);
}

// Solo aplicar a dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

### 10. **httpOnly Cookies** 🍪
**¿Qué es?** Cookies que no pueden ser accedidas por JavaScript  
**¿Por qué se usa?** Proteger tokens contra ataques XSS  
**¿Qué problema resuelve?** Seguridad de autenticación

**Uso en autenticación:**
```typescript
// Después del login exitoso
res.cookies.set("sb-access-token", access_token, {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30, // 30 días
});
```

---

### 11. **Framer Motion 12.23.24** 🎬
**¿Qué es?** Librería para animaciones en React  
**¿Por qué se usa?** Crear transiciones y animaciones suaves  
**¿Qué problema resuelve?** Mejorar UX con animaciones fluidas

---

### 12. **Zod 4.1.8** 
**¿Qué es?** Librería de validación de esquemas TypeScript-first  
**¿Por qué se usa?** Validar datos en runtime  
**¿Qué problema resuelve?** Asegurar que los datos cumplan con el formato esperado

---

## Arquitectura General

### Flujo de Autenticación

```
┌─────────────────────────────────────────────────────┐
│ 1. Usuario intenta acceder a ruta protegida         │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ 2. Middleware.ts valida token                       │
│    - Lee cookie: sb-access-token                    │
│    - Si no existe, intenta refrescar con            │
│      sb-refresh-token                               │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ 3. supabaseServer.auth.getUser(access_token)        │
│    - Valida token en Supabase                       │
│    - Extrae ID del usuario                          │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ 4. Verificar permisos                               │
│    - Consultar tabla usuario                        │
│    - Validar rol y acceso_comunidad                 │
└─────────────┬───────────────────────────────────────┘
              │
      ┌───────┴───────┐
      │               │
      ▼               ▼
   Permitir        Rechazar
   Usuario       (Redirigir a /)
```

### Flujo de Carrito

```
┌─────────────────────────────────┐
│ Usuario hace click en "Carrito"  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ AddToCartButton verifica usuario │
│ (useUser hook)                   │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
    No             Sí
   Toast +        POST /api/carrito
   Redirect       └────────────┬────────
   a login               ▼
                  ┌─────────────────────┐
                  │ API valida token    │
                  │ (middleware)        │
                  └────────────┬────────
                               ▼
                  ┌─────────────────────┐
                  │ Crear/Actualizar    │
                  │ en Supabase         │
                  └────────────┬────────
                               ▼
                  ┌─────────────────────┐
                  │ Retornar carrito    │
                  │ actualizado         │
                  └─────────────────────┘
```

---

## Estructura de Carpetas

```
mulita-web/
├── public/                          # Archivos estáticos
│   └── imagenes/
│       ├── noticias/               # Imágenes de noticias
│       └── images/
│           ├── icons/              # Iconos por sección
│           │   ├── comunidad/
│           │   ├── dashboard/
│           │   ├── perfil/
│           │   └── productos/
│           └── logosMulita/        # Logos de la marca
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── globals.css              # Estilos globales
│   │   ├── layout.tsx               # Layout raíz con providers
│   │   ├── page.tsx                 # Página de inicio
│   │   │
│   │   ├── api/                     # API Routes (Backend)
│   │   │   ├── auth/                # Autenticación
│   │   │   │   ├── login/
│   │   │   │   ├── logout/
│   │   │   │   ├── me/              # Datos del usuario actual
│   │   │   │   ├── register/
│   │   │   │   └── validate-token/
│   │   │   │
│   │   │   ├── carrito/             # Gestión del carrito
│   │   │   │   ├── route.ts         # GET: traer, POST: agregar
│   │   │   │   ├── [id]/route.ts    # PUT: actualizar, DELETE: eliminar
│   │   │   │   └── checkout/        # Finalizar compra
│   │   │   │
│   │   │   ├── perfil/              # Gestión de perfil
│   │   │   │   ├── [id]/route.ts    # GET: obtener, PATCH: actualizar
│   │   │   │   └── actividades/     # Actividades del usuario
│   │   │   │
│   │   │   ├── productos/           # Gestión de productos
│   │   │   ├── categorias/          # Gestión de categorías
│   │   │   ├── colecciones/         # Gestión de colecciones
│   │   │   ├── noticias/            # Gestión de noticias
│   │   │   ├── usuarios/            # Gestión de usuarios (admin)
│   │   │   └── [otros]/
│   │   │
│   │   ├── auth/                    # Páginas de autenticación
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── confirm/page.tsx
│   │   │
│   │   ├── tienda/                  # Páginas de tienda
│   │   │   ├── page.tsx             # Listado de productos
│   │   │   └── carrito/page.tsx     # Vista del carrito
│   │   │
│   │   ├── productos/               # Gestión de productos
│   │   │   ├── crear/page.tsx
│   │   │   └── editar/page.tsx
│   │   │
│   │   ├── comunidad/               # Sección de comunidad
│   │   │   ├── page.tsx             # Listado de actividades
│   │   │   ├── actividades/
│   │   │   │   ├── crear/page.tsx
│   │   │   │   └── editar/page.tsx
│   │   │   └── comentarios/
│   │   │
│   │   ├── noticias/                # Gestión de noticias
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx        # Detalle de noticia
│   │   │   ├── crear/page.tsx
│   │   │   └── editar/page.tsx
│   │   │
│   │   ├── perfil/                  # Gestión de perfil
│   │   │   ├── [id]/page.tsx        # Ver perfil
│   │   │   └── editar/page.tsx      # Editar perfil
│   │   │
│   │   ├── dashboard/               # Panel de administración
│   │   │   ├── layout.tsx           # Layout específico del dashboard
│   │   │   ├── page.tsx             # Página principal del dashboard
│   │   │   ├── gestionLanding/      # Gestión de landing page
│   │   │   ├── gestionCategorias/
│   │   │   ├── gestionProductos/
│   │   │   ├── gestionNoticias/
│   │   │   ├── gestionUsuarios/
│   │   │   └── gestionSobreNosotros/
│   │   │
│   │   ├── sobreNosotros/           # Página de información
│   │   │   ├── page.tsx
│   │   │   ├── quienesSomos/
│   │   │   ├── misionVision/
│   │   │   ├── dondeEstamos/
│   │   │   └── secciones/
│   │   │
│   │   └── colecciones/             # Página de colecciones
│   │       └── [id]/page.tsx
│   │
│   ├── components/                  # Componentes reutilizables
│   │   └── ui/
│   │       ├── Header.tsx           # Barra superior
│   │       ├── Footer.tsx           # Pie de página
│   │       ├── MenuAccionesHeaderPrincipal.tsx
│   │       ├── UserSearch.tsx
│   │       │
│   │       ├── tienda/              # Componentes de tienda
│   │       │   ├── Productos.tsx
│   │       │   ├── ProductoModal.tsx
│   │       │   ├── CompraModal.tsx
│   │       │   ├── carrito/
│   │       │   │   └── AddToCartButton.tsx
│   │       │   └── [otros]/
│   │       │
│   │       ├── comunidad/           # Componentes de comunidad
│   │       │   ├── Comunidad.tsx    # Componente principal protegido
│   │       │   ├── Actividades.tsx
│   │       │   ├── SidebarComunidad.tsx
│   │       │   └── [otros]/
│   │       │
│   │       ├── dashboard/           # Componentes del dashboard
│   │       ├── perfil/              # Componentes de perfil
│   │       ├── noticias/            # Componentes de noticias
│   │       ├── sobre-nosotros/      # Componentes informativos
│   │       ├── inicio/              # Componentes del inicio
│   │       └── [otros]/
│   │
│   ├── context/                     # React Context (Estado Global)
│   │   ├── UserContext.tsx          # Contexto de usuario
│   │   └── CartContext.tsx          # Contexto de carrito
│   │
│   ├── lib/                         # Utilidades y configuraciones
│   │   ├── supabase.ts              # Cliente Supabase (Frontend)
│   │   ├── supabase-server.ts       # Cliente Supabase (Backend)
│   │   ├── subirArchivos.ts         # Utilidades de upload
│   │   └── [otros]/
│   │
│   ├── types/                       # Tipos TypeScript globales
│   │   └── next-auth.d.ts
│   │
│   ├── hooks/                       # Hooks personalizados (vacío en docs)
│   │
│   └── middleware.ts                # Middleware de Next.js
│
├── .env.local                       # Variables de entorno (NO subir a git)
├── next.config.ts                  # Configuración de Next.js
├── tsconfig.json                   # Configuración de TypeScript
├── package.json                    # Dependencias del proyecto
├── postcss.config.mjs              # Configuración de PostCSS
├── RLS_REPAIR.sql                  # Script de Row Level Security
└── README.md
```

---

## Configuración y Setup

### Variables de Entorno (.env.local)

```env
# Supabase - Frontend (Public)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxx

# Supabase - Backend (Private - NUNCA exponer)
NEXT_SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxx

# Otros servicios
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Archivos de Configuración

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Paths alias:** `@/` apunta a `src/`, permitiendo:
```tsx
import { useUser } from "@/context/UserContext";
import { AddToCartButton } from "@/components/ui/tienda/carrito/AddToCartButton";
```

#### `postcss.config.mjs`
```javascript
// Integra Tailwind CSS en el proceso de compilación
```

#### `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  /* config options here */
};
```

---

## Patrones de Implementación

### 1. **Patrón de Componente Protegido**

Para páginas/componentes que requieren autenticación:

```typescript
"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

export default function ProtectedComponent() {
  const { user, loading } = useUser();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!loading && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      toast.error("Debes iniciar sesión");
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Mientras carga o no hay usuario, no mostrar nada
  if (loading || !user) {
    return null;
  }

  return <div>Contenido protegido</div>;
}
```

**Ejemplo real:** `src/components/ui/comunidad/Comunidad.tsx`

---

### 2. **Patrón de API Protegida**

Para endpoints que requieren autenticación:

```typescript
// src/app/api/carrito/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // 1. Obtener token del cookie
    const cookieStore = await cookies();
    const access_token = cookieStore.get("sb-access-token")?.value;

    if (!access_token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Validar token y obtener usuario
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(access_token);
    
    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 3. Operación con base de datos
    const { data: carrito } = await supabaseServer
      .from("carritos")
      .select("*")
      .eq("usuario_id", user.id)
      .single();

    // 4. Retornar datos
    return NextResponse.json({ carrito });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
```

---

### 3. **Patrón de Hook Personalizado**

```typescript
// Ejemplo: useCart hook
const { cart, addItem, removeItem, loading } = useCart();

// Implementación en CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe estar dentro de CartProvider");
  }
  return context;
};
```

---

### 4. **Patrón de Toast Notifications**

```typescript
import { toast } from "react-hot-toast";

// Éxito
toast.success("Producto agregado al carrito");

// Error
toast.error("No autorizado");

// Información
toast.loading("Cargando...");

// Personalizado
toast((t) => (
  <div>
    <p>Mensaje personalizado</p>
    <button onClick={() => toast.dismiss(t.id)}>Cerrar</button>
  </div>
));
```

---

### 5. **Patrón de Autenticación Multi-paso**

**Flujo completo:**

```
1. Usuario accede a /auth/login
   ↓
2. Completa formulario con email/password
   ↓
3. Frontend → POST /api/auth/login
   ↓
4. API valida credenciales con Supabase
   ↓
5. Si válido: Crear sesión y cookies httpOnly
   ↓
6. Frontend obtiene usuario vía GET /api/auth/me
   ↓
7. UserContext.setUser() con datos
   ↓
8. Redirigir a página protegida
```

---

## Conclusiones

### Fortalezas de la Arquitectura

**Seguridad**: httpOnly cookies, RLS en BD, validación en servidor  
**Escalabilidad**: Separación cliente/servidor, context API  
**Mantenibilidad**: TypeScript, componentes reutilizables, estructura clara  
**Performance**: Next.js optimizaciones, SSR cuando es necesario  
**DX**: Alias de rutas, hot reload, herramientas modernas  

### Stack Recomendado para Nuevas Características

- **UI**: React + Tailwind + Lucide Icons
- **Estado**: Context API para global, useState para local
- **API**: Next.js API routes con supabaseServer
- **Validación**: Zod en backend, librerías de formulario en frontend
- **Feedback**: react-hot-toast para notificaciones
- **Autenticación**: Supabase + httpOnly cookies + Middleware

---

**Documento actualizado al 27 de Noviembre de 2025**
