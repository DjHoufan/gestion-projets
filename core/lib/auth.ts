"use server";

import { createActionServerCookies } from "@/core/supabase/server";
import { cookies } from "next/headers";
import CryptoJS from "crypto-js";

import { AuthSchema, AuthSchemaInput } from "@/core/lib/schemas";
import { db } from "./db";
import { RolePermission } from "@/core/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export const setAccessTokenCookie = async (token: RolePermission) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      process.env.NEXT_SECRET_KEY!
    ).toString();

    const oneMonthInSeconds = 30 * 24 * 60 * 60;

    (await cookies()).set(process.env.AUTH_COOKIE_ACCESS!, encrypted, {
      path: "/",
      domain: process.env.NEXT_PUBLIC_APP_DOMAINE!,
      maxAge: oneMonthInSeconds,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
  } catch (error) {}
};

export const login = async (values: AuthSchemaInput) => {
  const supabase = await createActionServerCookies();

  const validatedFields = AuthSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    const {
      error,
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !user) {
      return {
        success: null,
        error: error?.message || "Utilisateur non trouvé.",
      };
    }

    let type = user.user_metadata?.type;
    let userId = user.id;

    const data = await db.users.findFirst({
      where: {
        AND: [{ authId: userId }, { type: type }, { status: "enabled" }],
      },
    });

    if (!data) {
      return {
        success: null,
        error: "Utilisateur non trouvé.",
      };
    }

    const routes: string[] = data.routes;
    const access: string[] = data.access;

    setAccessTokenCookie({ routes, type, access, id: data.id });
    return { success: true, error: null };
  } catch (err) {
    return { success: null, error: "Erreur serveur lors de la connexion." };
  }
};

export const logout = async () => {
  const queryClient = useQueryClient();
  try {
    const supabase = await createActionServerCookies();
    (await cookies()).set(process.env.AUTH_COOKIE_ACCESS!, "", {
      path: "/",
      domain: process.env.NEXT_PUBLIC_APP_DOMAINE!,
      maxAge: 0,
      httpOnly: true,
      secure: true, // active en production
    });
    queryClient.clear();
    return await supabase.auth.signOut();
  } catch (error) {}
};

export const resetPassword = async (
  password: string,
  accessToken: string,
  refreshToken: string
) => {
  const supabase = await createActionServerCookies();

  try {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { message: error.message };
    }
  } catch (error) {
    return { message: "Erreur lors du reset du mot de passe." };
  }
};

export const sentResetPassword = async (email: string) => {
  const supabase = await createActionServerCookies();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { message: error.message };
    }
  } catch (error) {
    return { message: "Erreur lors de l'envoi du mail de réinitialisation." };
  }
};
