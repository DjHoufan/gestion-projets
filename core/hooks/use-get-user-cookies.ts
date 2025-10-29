"use server";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { RolePermission } from "@/core/lib/types";
import CryptoJS from "crypto-js";

// Fonction interne pour décrypter le cookie (avec cache)
const decryptUserCookie = async (tokenValue: string): Promise<RolePermission> => {
  const bytes = CryptoJS.AES.decrypt(
    tokenValue,
    process.env.NEXT_SECRET_KEY!
  );
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedText);
};

// Fonction principale avec cache
export const GetUserCookies = async () => {
  const token_acces = (await cookies()).get(process.env.AUTH_COOKIE_ACCESS!);

  if (!token_acces?.value) {
    throw new Error("No authentication token found");
  }

  // Utiliser unstable_cache pour mettre en cache le décryptage
  const getCachedUser = unstable_cache(
    async () => decryptUserCookie(token_acces.value),
    [`user-cookie-${token_acces.value.substring(0, 20)}`], // Clé unique basée sur le token
    {
      revalidate: 300, // 5 minutes de cache
      tags: ["user-auth"],
    }
  );

  return await getCachedUser();
};

// Alias pour compatibilité avec le code existant
export const useGetUserCookies = GetUserCookies;
