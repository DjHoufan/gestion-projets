import "server-only";
import { User } from "@supabase/supabase-js";
import { createMiddleware } from "hono/factory";
import { useCurrentUser } from "@/core/hooks/use-current-user";
import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "@/core/lib/db";

type AdditionalContext = {
  Variables: {
    user: User;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    await db.$connect(); 
    const user = await useCurrentUser();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // c.set("user", user!);

    await next();
  }
);

export const sessionMiddlewareAdmin = createMiddleware<AdditionalContext>(
  async (c, next) => {
    // const user = await useCurrentUser();

    // if (!user) {
    //   return c.json({ error: "Unauthorized" }, 401);
    // }

    // c.set("user", user!);

    await next();
  }
);

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err) {
    return c.json({ error: err }, 400);
  }
};
