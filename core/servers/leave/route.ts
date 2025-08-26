import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { v4 } from "uuid";
import { upsertLeave } from "@/core/lib/queries";
import { LeaveSchema } from "@/core/lib/schemas";
import {
  sessionMiddleware,
  sessionMiddlewareAdmin,
} from "@/core/lib/session-middleware";
import { db } from "@/core/lib/db";

import { Leave, Type } from "@prisma/client";

const getData = (id: string, body: Leave) => ({
  ...body,
  id,
  type: Type.admin,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertLeave(data);
};

const app = new Hono()
  .get("/", sessionMiddlewareAdmin, async (c) => {
    const data = await db.leave.findMany({
      include: {
        member: true,
        project: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/:lId", sessionMiddlewareAdmin, async (c) => {
    const { lId } = c.req.param();

    const data = await db.leave.findFirst({
      where: {
        id: lId,
      },
      include: {
        member: true,
        project: true,
      },
    });

    return c.json({ data });
  })

  .post("/", zValidator("json", LeaveSchema), sessionMiddleware, async (c) => {
    const response = await handleDatatUpsert(c, v4());

    return c.json({ data: response });
  })
  .patch(
    "/:lId",
    zValidator("json", LeaveSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("lId"));
      return c.json({ data: response });
    }
  )
  .delete("/:lId", sessionMiddleware, async (c) => {
    const { lId } = c.req.param();

    const response = await db.leave.delete({ where: { id: lId } });

    return c.json({ data: { id: response.id, name: response.reason } });
  });

export default app;
