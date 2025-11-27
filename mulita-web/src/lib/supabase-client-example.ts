/**
 * Ejemplo de cómo usar el SDK de Supabase directamente desde el frontend
 * después de implementar el nuevo flujo de autenticación
 */

import { createClientSupabase } from './supabase';

// Ejemplo 1: Operaciones de lectura (GET)
export async function obtenerActividadesComunidad() {
  const supabase = createClientSupabase();
  
  try {
    const { data, error } = await supabase
      .from('actividades')
      .select(`
        *,
        usuario:usuario_id(nombre, apellido),
        comentarios(
          id,
          contenido,
          creado_en,
          usuario:usuario_id(nombre, apellido)
        )
      `)
      .order('creado_en', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error obteniendo actividades:', error);
    return null;
  }
}

// Ejemplo 2: Operaciones de escritura (POST)
export async function crearActividad(actividad: {
  titulo: string;
  descripcion: string;
  tipo: string;
  imagen?: string;
}) {
  const supabase = createClientSupabase();
  
  try {
    // Obtener el usuario actual desde Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    
    const { data, error } = await supabase
      .from('actividades')
      .insert({
        ...actividad,
        usuario_id: user.id,
        creado_en: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creando actividad:', error);
    return null;
  }
}

// Ejemplo 3: Subida de archivos
export async function subirArchivo(
  file: File, 
  bucket: string = 'imagenes-actividades'
) {
  const supabase = createClientSupabase();
  
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    
    if (error) throw error;
    
    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return null;
  }
}

// Ejemplo 4: Operaciones en tiempo real (Realtime)
export function suscribirseActividades(callback: (payload: any) => void) {
  const supabase = createClientSupabase();
  
  const subscription = supabase
    .channel('actividades')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'actividades' 
      }, 
      callback
    )
    .subscribe();
  
  // Retornar función para cancelar suscripción
  return () => {
    supabase.removeChannel(subscription);
  };
}

// Ejemplo 5: Función para verificar si el usuario está autenticado
export async function verificarAutenticacion() {
  const supabase = createClientSupabase();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return {
      isAuthenticated: !!session,
      user: session?.user || null
    };
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    return {
      isAuthenticated: false,
      user: null
    };
  }
}

// Ejemplo 6: Función para cerrar sesión desde el frontend
export async function cerrarSesion() {
  const supabase = createClientSupabase();
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    // También llamar al endpoint del backend para limpiar cookies
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    return true;
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    return false;
  }
}