import { supabase } from "../config/supabaseClient";

export async function listarTareasGrupo(grupoId) {
  if (!grupoId) throw new Error("ID de grupo inválido.");
  const { data, error } = await supabase
    .from("grupo_tareas")
    .select("*")
    .eq("grupo_id", grupoId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function crearTareaGrupo({ grupoId, titulo }) {
  if (!grupoId || !titulo?.trim()) throw new Error("Datos inválidos para la tarea.");
  const { data, error } = await supabase
    .from("grupo_tareas")
    .insert({ grupo_id: grupoId, titulo: titulo.trim(), completada: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleTareaGrupo({ tareaId, completada }) {
  if (!tareaId) throw new Error("ID de tarea inválido.");
  const { data, error } = await supabase
    .from("grupo_tareas")
    .update({ completada: Boolean(completada) })
    .eq("id", tareaId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function editarTareaGrupo({ tareaId, titulo }) {
  if (!tareaId || !titulo?.trim()) throw new Error("Datos inválidos.");
  const { data, error } = await supabase
    .from("grupo_tareas")
    .update({ titulo: titulo.trim() })
    .eq("id", tareaId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarTareaGrupo({ tareaId }) {
  if (!tareaId) throw new Error("ID de tarea inválido.");
  const { error } = await supabase
    .from("grupo_tareas")
    .delete()
    .eq("id", tareaId);
  if (error) throw error;
}
