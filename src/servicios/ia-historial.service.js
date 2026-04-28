import { supabase } from "../config/supabaseClient";

const CHAT_TAG_REGEX = /^\[\[CHAT:([a-zA-Z0-9_-]+)\]\]\s*/;

function adjuntarTagChat(mensaje, chatId) {
  if (!chatId) return mensaje;
  return `[[CHAT:${chatId}]] ${mensaje}`;
}

function extraerChatId(mensaje = "") {
  const match = `${mensaje}`.match(CHAT_TAG_REGEX);
  return match?.[1] || null;
}

function limpiarTagChat(mensaje = "") {
  return `${mensaje}`.replace(CHAT_TAG_REGEX, "");
}

export async function guardarMensajeChat({ mensajeUsuario, respuestaIA, chatId = null }) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const userId = session?.user?.id;
  if (!userId) throw new Error("No hay sesión activa.");

  const { error } = await supabase.from("ia_chats").insert({
    user_id: userId,
    mensaje_usuario: adjuntarTagChat(mensajeUsuario, chatId),
    respuesta_ia: respuestaIA
  });
  if (error) throw error;
}

export async function listarHistorialChat() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const userId = session?.user?.id;
  if (!userId) return [];

  const { data, error } = await supabase
    .from("ia_chats")
    .select("id, mensaje_usuario, respuesta_ia, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;

  return (data || []).map(item => ({
    ...item,
    chat_id: extraerChatId(item.mensaje_usuario) || "legacy",
    mensaje_usuario: limpiarTagChat(item.mensaje_usuario)
  }));
}

export async function eliminarHistorialChatPorId(chatId) {
  if (!chatId) throw new Error("Chat inválido.");

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const userId = session?.user?.id;
  if (!userId) throw new Error("No hay sesión activa.");

  let query = supabase.from("ia_chats").delete().eq("user_id", userId);
  if (chatId === "legacy") {
    query = query.not("mensaje_usuario", "like", "[[CHAT:%");
  } else {
    query = query.like("mensaje_usuario", `[[CHAT:${chatId}]]%`);
  }

  const { error } = await query;
  if (error) throw error;
}
