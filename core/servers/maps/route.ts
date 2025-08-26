import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/core/lib/db";
import { v4 } from "uuid";
import { upsertMaps } from "@/core/lib/queries";
import { MapsSchema } from "@/core/lib/schemas";
import { errorHandler, sessionMiddleware } from "@/core/lib/session-middleware";

import { Maps } from "@prisma/client";

const getData = (id: string, body: Maps) => ({
  ...body,
  id,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertMaps(data);
};

const app = new Hono()
  .onError((err, c) => {
    return c.json({ error: err }, 400);
  })
  .get("/", async (c) => {
    const data = await db.maps.findMany({
      include: {
        accompaniment: {
          include: {
            users: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/:mapId", async (c) => {
    const { mapId } = c.req.param();
    const data = await db.maps.findFirst({
      include: {
        accompaniment: {
          include: {
            users: true,
            members: true,
          },
        },
      },
      where: {
        id: mapId,
      },
    });
    return c.json({ data });
  })

  .post(
    "/",
    zValidator("json", MapsSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const response = await handleDatatUpsert(c, v4());
      return c.json({ data: response });
    }
  )
  .patch(
    "/:mapId",
    zValidator("json", MapsSchema),
    sessionMiddleware,
    async (c) => {
      const response = await handleDatatUpsert(c, c.req.param("mapId"));
      return c.json({ data: response });
    }
  )
  .delete("/:mapId", sessionMiddleware, async (c) => {
    const { mapId } = c.req.param();

    const response = await db.maps.findUnique({
      where: { id: mapId },
      select: {
        id: true,
      },
    });
    if (!response) return c.json({ error: "Aucun donnée n'a été trouvé" }, 404);

    await db.maps.delete({ where: { id: mapId } });

    return c.json({ data: { id: response.id, name: "maps" } });
  });

export default app;
