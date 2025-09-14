import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { v4 } from "uuid";
import { upsertProjet } from "@/core/lib/queries";
import { projetSchema } from "@/core/lib/schemas";
import { sessionMiddleware } from "@/core/lib/session-middleware";
import { db } from "@/core/lib/db";
import { Project } from "@prisma/client";

const getData = (id: string, body: Project) => ({
  ...body,
  id,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertProjet(data);
};

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.project.findMany({
      include: {
        accompaniments: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/:projetId", async (c) => {
    const { projetId } = c.req.param();

    const data = await db.project.findFirst({
      where: {
        id: projetId,
      },
      include: {
        members: {
          include: {
            leave: true,
          },
        },
        accompaniments: {
          include: {
            users: true,
            members: true,
          },
        },
      },
    });
    return c.json({ data });
  })
  .post("/", zValidator("json", projetSchema), sessionMiddleware, async (c) => {
    const response = await handleDatatUpsert(c, v4());

    return c.json({ data: response });
  })
  .patch(
    "/:projetId",
    zValidator("json", projetSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("projetId"));
      return c.json({ data: response });
    }
  )
  .delete("/:projetId", sessionMiddleware, async (c) => {
    const { projetId } = c.req.param();
    const response = await db.project.findUnique({
      where: { id: projetId },
      select: {
        id: true,
        name: true,
      },
    });
    if (!response)
      return c.json({ error: "Aucune project n'a été trouvée" }, 404);

    await db.project.delete({ where: { id: projetId } });

    return c.json({ data: { id: response.id, name: response.name } });
  });

export default app;
