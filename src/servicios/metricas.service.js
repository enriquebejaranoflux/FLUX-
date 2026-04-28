import { supabase } from "../config/supabaseClient";

function obtenerFechaDesdeFiltro(fechaFiltro = "all") {
  const ahora = new Date();
  const desde = new Date(ahora);
  if (fechaFiltro === "1w") { desde.setDate(desde.getDate() - 7); return desde.toISOString(); }
  if (fechaFiltro === "1m") { desde.setMonth(desde.getMonth() - 1); return desde.toISOString(); }
  if (fechaFiltro === "3m") { desde.setMonth(desde.getMonth() - 3); return desde.toISOString(); }
  if (fechaFiltro === "1y") { desde.setFullYear(desde.getFullYear() - 1); return desde.toISOString(); }
  return null;
}

export async function obtenerTotalesAdminHome({ fechaFiltro = "all" } = {}) {
  const fechaDesde = obtenerFechaDesdeFiltro(fechaFiltro);
  let gruposBuilder = supabase.from("grupos").select("id", { count: "exact", head: true });
  let reposBuilder = supabase.from("repositorios_publicos").select("id", { count: "exact", head: true });
  let usuariosBuilder = supabase.from("profiles").select("id", { count: "exact", head: true });

  if (fechaDesde) {
    gruposBuilder = gruposBuilder.gte("created_at", fechaDesde);
    reposBuilder = reposBuilder.gte("created_at", fechaDesde);
    usuariosBuilder = usuariosBuilder.gte("created_at", fechaDesde);
  }

  const [gruposQuery, reposQuery, usuariosQuery] = await Promise.all([
    gruposBuilder,
    reposBuilder,
    usuariosBuilder
  ]);

  if (gruposQuery.error) throw gruposQuery.error;
  if (reposQuery.error) throw reposQuery.error;
  if (usuariosQuery.error) throw usuariosQuery.error;

  return {
    totalGrupos: Number(gruposQuery.count || 0),
    totalRepositorios: Number(reposQuery.count || 0),
    totalUsuarios: Number(usuariosQuery.count || 0)
  };
}
