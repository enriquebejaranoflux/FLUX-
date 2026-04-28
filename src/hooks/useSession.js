import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

/**
 * Encapsula la carga inicial de sesión de Supabase.
 * Solo lee la sesión una vez al montar — no suscribe a cambios en tiempo real.
 * Para componentes que necesiten reactividad a cambios de sesión (login/logout),
 * usar directamente supabase.auth.onAuthStateChange en el componente.
 */
export function useSession() {
  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      setDisplayName(
        session?.user?.user_metadata?.display_name ||
        session?.user?.email ||
        ""
      );
      setAvatarUrl(session?.user?.user_metadata?.avatar_url?.trim() || "");
      setLoading(false);
    });
  }, []);

  return { userId, displayName, avatarUrl, loading };
}
