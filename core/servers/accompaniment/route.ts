import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/core/lib/db";
import { v4 } from "uuid";
import { upsertAccompaniment } from "@/core/lib/queries";
import { AccompanimentSchema, MediaSchema } from "@/core/lib/schemas";
import { errorHandler, sessionMiddleware } from "@/core/lib/session-middleware";

import { Accompaniment } from "@prisma/client";
import { deleteFileDoc } from "@/core/lib/storage";

const getData = (id: string, body: Accompaniment) => ({
  ...body,
  id,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertAccompaniment(data);
};

const app = new Hono()
  .onError((err, c) => {
    return c.json({ error: err }, 400);
  }).get("/", async (c) => {
    const data = await db.accompaniment.findMany({
      include: {
        project: true,
        users: true,
        members: true,
        file: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/", async (c) => {
    const data = await db.accompaniment.findMany({
      include: {
        project: true,
        users: true,
        members: true,
        file: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("my/:id/:admin", async (c) => {
    const { id, admin } = c.req.param();

    const data = await db.accompaniment.findMany({
      where: admin === "oui" ? {} : { usersid: id },
      include: {
        project: true,
        users: true,
        members: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return c.json({ data });
  })
  .get("/:accId", async (c) => {
    const { accId } = c.req.param();
    const data = await db.accompaniment.findFirst({
      where: {
        id: accId,
      },
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
    });
    return c.json({ data });
  })

  .post(
    "/",
    zValidator("json", AccompanimentSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const response = await handleDatatUpsert(c, v4());
      return c.json({ data: response });
    }
  )
  .patch(
    "/media",
    zValidator("json", MediaSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const { id, files } = c.req.valid("json");

      const response = await db.accompaniment.update({
        where: { id: id },
        data: {
          media: {
            connect: files.map((file) => ({ id: file.id })),
          },
        },
        include: {
          media: true,
        },
      });

      return c.json({ data: response });
    }
  )
  .patch(
    "/:accId",
    zValidator("json", AccompanimentSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("accId"));
      return c.json({ data: response });
    }
  )
  .delete("/:accId", sessionMiddleware, async (c) => {
    const { accId } = c.req.param();

    const response = await db.accompaniment.findUnique({
      where: { id: accId },
      select: {
        id: true,
        name: true,
      },
    });
    if (!response)
      return c.json({ error: "Aucun accompagnement n'a été trouvé" }, 404);

    await db.accompaniment.delete({ where: { id: accId } });

    return c.json({ data: { id: response.id, name: response.name } });
  })
  .delete("/media/:MId", sessionMiddleware, errorHandler, async (c) => {
    const { MId } = c.req.param();

    await deleteFileDoc(MId);

    return c.json({ data: MId });
  });

export default app;
