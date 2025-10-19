import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { v4 } from "uuid";
import { upsertEvents } from "@/core/lib/queries";
import { EventsSchema } from "@/core/lib/schemas";
import { sessionMiddleware } from "@/core/lib/session-middleware";
import { db } from "@/core/lib/db";

import { Events } from "@prisma/client";

const getData = (id: string, body: Events) => ({
  ...body,
  id,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertEvents(data);
};

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.events.findMany({
      include: {
        files: true,
      },
      orderBy: {
        date: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/:eventId", async (c) => {
    const { eventId } = c.req.param();

    const data = await db.events.findFirst({
      where: {
        id: '38ade08d-3d42-4a36-8c2c-864007359c94',
      },
      include: {
        files: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    console.log({eventId});
    

    console.log({ data });

    return c.json({ data });
  })
  .post("/", zValidator("json", EventsSchema), sessionMiddleware, async (c) => {
    const response = await handleDatatUpsert(c, v4());

    return c.json({ data: response });
  })
  .patch(
    "/:eventId",
    zValidator("json", EventsSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("eventId"));
      return c.json({ data: response });
    }
  )
  .delete("/:eventId", sessionMiddleware, async (c) => {
    const { eventId } = c.req.param();

    const response = await db.events.delete({ where: { id: eventId } });

    return c.json({ data: { id: response.id, name: response.titre } });
  });

export default app;
