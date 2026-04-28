import { supabase } from "../config/supabaseClient";

async function asegurarMiembroGrupo({ grupoId, userId }) {
  if (!grupoId || !userId) throw new Error("Datos invalidos.");
  const { data, error } = await supabase
    .from("grupo_miembros")
    .select("id")
    .eq("grupo_id", grupoId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("No eres miembro de este grupo.");
}

export async function listarMensajesGrupo({ grupoId, limite = 20, before = null }) {
  if (!grupoId) return [];
  let query = supabase
    .from("grupo_mensajes")
    .select("id, grupo_id, user_id, display_name, mensaje, created_at")
    .eq("grupo_id", grupoId);
  if (before) {
    query = query.lt("created_at", before);
  }
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(limite);
  if (error) throw error;
  return (data || []).slice().reverse();
}

export async function enviarMensajeGrupo({ grupoId, mensaje, displayName = "" }) {
  if (!grupoId) throw new Error("ID de grupo invalido.");
  const texto = `${mensaje || ""}`.trim();
  if (!texto) throw new Error("El mensaje no puede estar vacio.");

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const user = session?.user;
  if (!user) throw new Error("No hay sesion activa.");

  await asegurarMiembroGrupo({ grupoId, userId: user.id });

  const { data, error } = await supabase
    .from("grupo_mensajes")
    .insert({
      grupo_id: grupoId,
      user_id: user.id,
      display_name: displayName || user.user_metadata?.display_name || "Usuario",
      mensaje: texto
    })
    .select("id, grupo_id, user_id, display_name, mensaje, created_at")
    .single();
  if (error) throw error;
  return data;
}

export async function listarLecturasMensajes({ mensajeIds }) {
  const ids = Array.isArray(mensajeIds) ? mensajeIds.filter(Boolean) : [];
  if (!ids.length) return [];
  const { data, error } = await supabase
    .from("grupo_mensaje_lecturas")
    .select("mensaje_id, user_id")
    .in("mensaje_id", ids);
  if (error) throw error;
  return data || [];
}

export async function marcarMensajesLeidos({ mensajeIds }) {
  const ids = Array.isArray(mensajeIds) ? mensajeIds.filter(Boolean) : [];
  if (!ids.length) return;

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const user = session?.user;
  if (!user) throw new Error("No hay sesion activa.");

  const rows = ids.map(id => ({ mensaje_id: id, user_id: user.id }));
  const { error } = await supabase
    .from("grupo_mensaje_lecturas")
    .upsert(rows, { onConflict: "mensaje_id,user_id" });
  if (error) throw error;
}
