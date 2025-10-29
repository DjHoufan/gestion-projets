"use server";
import { unstable_cache } from "next/cache";
import { createActionServer } from "@/core/supabase/actions";

// Fonction principale avec cache
export const getCurrentUser = async () => {
  const supabase = await createActionServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Utiliser unstable_cache pour cacher la session utilisateur
  const getCachedUser = unstable_cache(
    async () => user,
    [`current-user-${user.id}`],
    {
      revalidate: 300, // 5 minutes de cache
      tags: ["current-user", `user-${user.id}`],
    }
  );

  return await getCachedUser();
};

// Alias pour compatibilité avec le code existant
export const useCurrentUser = getCurrentUser;
