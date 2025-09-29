import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

import { zValidator } from "@hono/zod-validator";

import {
  AuthSchema,
  ResetPasswordSchema,
  SendResetPasswordSchema,
} from "@/core/lib/schemas";
import { sessionMiddleware } from "@/core/lib/session-middleware";
import { createActionServerCookies } from "@/core/supabase/server";

import { login } from "@/core/lib/auth";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");

    return c.json({ data: user });
  })
  .post("/login", zValidator("json", AuthSchema), async (c) => {

    const { email, password } = c.req.valid("json");

    const result = await login({ email, password });

    if (result?.error) {
      return c.json({ error: result.error }, 401);
    }
    return c.json({ data: { url: "/", success: true } });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const supabase = await createActionServerCookies();

    deleteCookie(c, process.env.AUTH_COOKIE_ACCESS!);
    await supabase.auth.signOut();

    return c.json({ success: true });
  })
  .post(
    "/sentResetPassword",
    zValidator("json", SendResetPasswordSchema),
    async (c) => {
      const { email } = c.req.valid("json");
      const supabase = await createActionServerCookies();

      const { error } = await supabase.auth.resetPasswordForEmail(email!);

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ data: { success: true } });
    }
  )
  .post(
    "/resetPassword",
    zValidator("json", ResetPasswordSchema),
    async (c) => {
      const { password, accessToken, refreshToken } = c.req.valid("json");
      const supabase = await createActionServerCookies();

      const { data: setSessionData, error: setSessionError } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ data: { success: true } });
    }
  );
export default app;
