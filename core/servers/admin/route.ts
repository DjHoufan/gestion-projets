import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { v4 } from "uuid";
import { upsertTeam } from "@/core/lib/queries";
import { UserSchema } from "@/core/lib/schemas";
import {
  sessionMiddleware,
  sessionMiddlewareAdmin,
} from "@/core/lib/session-middleware";
import { db } from "@/core/lib/db";
import { User } from "@supabase/supabase-js";
 
import { Type } from "@prisma/client";
import { supabaseAdmin } from "@/core/supabase/client";

const getData = (id: string, body: User) => ({
  ...body,
  id,
  type: Type.admin,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertTeam(data);
};

const app = new Hono()
  .get("/", sessionMiddlewareAdmin, async (c) => {
    const data = await db.users.findMany({
      where: {
        type: "admin",
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/:aId", sessionMiddlewareAdmin, async (c) => {
    const { aId } = c.req.param();

    const data = await db.users.findFirst({
      where: {
        id: aId,
        type: "admin",
      },
    });

    return c.json({ data });
  })

  .post("/", zValidator("json", UserSchema), sessionMiddleware, async (c) => {
    const response = await handleDatatUpsert(c, v4());

    return c.json({ data: response });
  })
  .patch(
    "/:aId",
    zValidator("json", UserSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("aId"));
      return c.json({ data: response });
    }
  )
  .delete("/:aId", sessionMiddleware, async (c) => {
    const { aId } = c.req.param();

    const response = await db.users.findUnique({
      where: { id: aId, type: "admin" },
      select: {
        id: true,
        name: true,
        authId: true,
      },
    });
    if (!response)
      return c.json({ error: "Aucun utilisateur n'a été trouvé" }, 404);

    await supabaseAdmin.auth.admin.deleteUser(response.authId);

    await db.users.delete({ where: { id: aId } });

    return c.json({ data: { id: response.id, name: response.name } });
  });

export default app;
