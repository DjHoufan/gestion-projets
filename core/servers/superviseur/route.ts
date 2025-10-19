import { Hono } from "hono";
import { db } from "@/core/lib/db";
import { upsertSignalement } from "@/core/lib/queries";
import { Signalement } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { SignalementSchema } from "@/core/lib/schemas";
import { sessionMiddleware } from "@/core/lib/session-middleware";
import { v4 } from "uuid";

const getData = (id: string, body: Signalement) => ({
  ...body,
  id,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertSignalement(data);
};

const app = new Hono()
  .onError((err, c) => {
    return c.json({ error: err }, 400);
  })
  .get("/:supId", async (c) => {
    const { supId } = c.req.param();

    const data = await db.users.findFirst({
      where: {
        id: supId,
      },
      include: {
        supervision: {
          include: {
            accompaniments: {
              include: {
                file: true,
                media: true,
                map: {
                  include: {
                    accompaniment: {
                      include: {
                        users: true,
                        members: true,
                      },
                    },
                  },
                },
                planning: {
                  include: {
                    visit: true,
                    users: true,
                  },
                },
                project: true,
                members: {
                  include: {
                    leave: true,
                    emargements: true,
                  },
                },
                purchases: {
                  include: {
                    purchaseItems: true,
                  },
                },
                rencontre: {
                  include: {
                    files: true,
                    signatures: {
                      include: {
                        member: true,
                      },
                    },
                    visit: true,
                    users: true,
                  },
                },
                conflits: {
                  include: {
                    files: true,
                    partieImpliques: true,
                    users: true,
                  },
                },
                users: true,
              },
            },
          },
        },
      },
    });

    return c.json({ data });
  })
  .get("/", async (c) => {
    const data = await db.signalement.findMany({
      include: {
        groupe: true,
        user: true,
      },
    });

    return c.json({ data });
  })
  .get("mySignalement/:id", async (c) => {
    const { id } = c.req.param();

    const data = await db.signalement.findMany({
      where: {
        supId: id,
      },
      include: {
        groupe: true,
        user: true,
      },
    });

    return c.json({ data });
  })
  .post(
    "/",
    zValidator("json", SignalementSchema),
    sessionMiddleware,
    async (c) => {
      const response = await handleDatatUpsert(c, v4());

      return c.json({ data: response });
    }
  )
  .patch(
    "/:id",
    zValidator("json", SignalementSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("id"));
      return c.json({ data: response });
    }
  )
  .patch("/:id/:statut", sessionMiddleware, async (c) => {
    const { id, statut } = c.req.param();

    const response = await db.signalement.update({
      where: { id },
      data: { statut },
    });

    return c.json({ data: response });
  })
  .delete("/:id", sessionMiddleware, async (c) => {
    const { id } = c.req.param();

    const response = await db.signalement.delete({ where: { id: id } });

    return c.json({ data: { id: response.id, name: response.description } });
  });
export default app;
