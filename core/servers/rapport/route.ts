import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/core/lib/db";
import { v4 } from "uuid";
import {
  upsertConflit,
  upsertEmargement,
  upsertRencontre,
  upsertVisiteTerrain,
} from "@/core/lib/queries";
import {
  ConflitSchema,
  EmargementSchema,
  RencontreSchema,
  VisiteTerrainSchema,
} from "@/core/lib/schemas";
import { errorHandler, sessionMiddleware } from "@/core/lib/session-middleware";
import { Conflit, Emargement, Rencontre, VisiteTerrain } from "@prisma/client";

const getData = <T>(id: string, body: T) => ({
  ...body,
  id,
});
const handleDatatUpsert = async <T>(c: any, id: string, type: string) => {
  const data = getData<T>(id, c.req.valid("json"));

  switch (type) {
    case "em":
      return await upsertEmargement(data);
    case "vt":
      return await upsertVisiteTerrain(data);
    case "cf":
      return await upsertConflit(data);
    case "rc":
      return await upsertRencontre(data);
    default:
      break;
  }
};

const app = new Hono()
  .onError((err, c) => {
    return c.json({ error: err }, 400);
  })
  .get("/emargement", async (c) => {
    const data = await db.emargement.findMany({
      include: {
        member: true,
        users: true,
      },
      orderBy: {
        date: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/emargement/:emId", async (c) => {
    const { emId } = c.req.param();
    const data = await db.emargement.findUnique({
      where: {
        id: emId,
      },
      include: {
        member: true,
        users: true,
      },
    });
    return c.json({ data });
  })
  .post(
    "/emargement",
    zValidator("json", EmargementSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const response = await handleDatatUpsert<Emargement>(c, v4(), "em");
      return c.json({ data: response });
    }
  )
  .patch(
    "/emargement/:emId",
    zValidator("json", EmargementSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert<Emargement>(
        c,
        c.req.param("emId"),
        "em"
      );
      return c.json({ data: response });
    }
  )
  .delete("/emargement/:emId", sessionMiddleware, async (c) => {
    const { emId } = c.req.param();

    const response = await db.emargement.findUnique({
      where: { id: emId },
      select: {
        id: true,
      },
    });
    if (!response) return c.json({ error: "Aucun donnée n'a été trouvé" }, 404);

    await db.emargement.delete({ where: { id: emId } });

    return c.json({ data: { id: response.id, name: "emargement" } });
  })
  .get("/visit", async (c) => {
    const data = await db.visiteTerrain.findMany({
      include: {
        visit: {
          include: {
            Planning: {
              include: {
                accompaniments: {
                  include: {
                    members: true,
                  },
                },
              },
            },
          },
        },
        users: true,
        personnes: true,
        files: true,
      },
    });
    return c.json({ data });
  })
  .get("/visit/:vId", async (c) => {
    const { vId } = c.req.param();
    const data = await db.visiteTerrain.findUnique({
      where: {
        id: vId,
      },
      include: {
        visit: {
          include: {
            Planning: {
              include: {
                accompaniments: {
                  include: {
                    members: true,
                  },
                },
              },
            },
          },
        },
        users: true,
        personnes: true,
        files: true,
      },
    });
    return c.json({ data });
  })
  .post(
    "/visit",
    zValidator("json", VisiteTerrainSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const response = await handleDatatUpsert<VisiteTerrain>(c, v4(), "vt");
      return c.json({ data: response });
    }
  )
  .patch(
    "/visit/:vId",
    zValidator("json", VisiteTerrainSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert<VisiteTerrain>(
        c,
        c.req.param("vId"),
        "vt"
      );
      return c.json({ data: response });
    }
  )
  .delete("/visit/:vId", sessionMiddleware, async (c) => {
    const { vId } = c.req.param();

    const response = await db.visiteTerrain.findUnique({
      where: { id: vId },
      select: {
        id: true,
      },
    });
    if (!response) return c.json({ error: "Aucun donnée n'a été trouvé" }, 404);

    await db.visiteTerrain.delete({ where: { id: vId } });

    return c.json({ data: { id: response.id, name: "visite Terrain" } });
  })
  .get("/conflit", async (c) => {
    const data = await db.conflit.findMany({
      include: {
        accompaniment: true,
        files: true,
        partieImpliques: true,
        users: true,
      },
    });
    return c.json({ data });
  })
  .get("/conflit/:cId", async (c) => {
    const { cId } = c.req.param();
    const data = await db.conflit.findUnique({
      where: {
        id: cId,
      },
      include: {
        accompaniment: true,
        files: true,
        partieImpliques: true,
        users: true,
      },
    });
    return c.json({ data });
  })
  .post(
    "/conflit",
    zValidator("json", ConflitSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const response = await handleDatatUpsert<Conflit>(c, v4(), "cf");
      return c.json({ data: response });
    }
  )
  .patch(
    "/conflit/:cId",
    zValidator("json", ConflitSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert<Conflit>(c, c.req.param("cId"), "cf");
      return c.json({ data: response });
    }
  )
  .delete("/conflit/:cId", sessionMiddleware, async (c) => {
    const { cId } = c.req.param();

    const response = await db.conflit.findUnique({
      where: { id: cId },
      select: {
        id: true,
      },
    });
    if (!response) return c.json({ error: "Aucun donnée n'a été trouvé" }, 404);

    await db.conflit.delete({ where: { id: cId } });

    return c.json({ data: { id: response.id, name: "conflit" } });
  })
  .get("/rencontre", async (c) => {
    const data = await db.rencontre.findMany({
      include: {
        visit: true,

        accompaniment: true,
        users: true,
        files: true,

        signatures: {
          include: {
            member: true,
          },
        },
      },
    });
    return c.json({ data });
  })
  .get("/rencontre/:rId", async (c) => {
    const { rId } = c.req.param();
    const data = await db.rencontre.findUnique({
      where: {
        id: rId,
      },
      include: {
        visit: true,
        accompaniment: true,
        users: true,
        files: true,

        signatures: {
          include: {
            member: true,
          },
        },
      },
    });
    return c.json({ data });
  })
  .post(
    "/rencontre",
    zValidator("json", RencontreSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const response = await handleDatatUpsert<Rencontre>(c, v4(), "rc");
      return c.json({ data: response });
    }
  )
  .patch(
    "/rencontre/:rId",
    zValidator("json", RencontreSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert<Rencontre>(
        c,
        c.req.param("rId"),
        "rc"
      );
      return c.json({ data: response });
    }
  )
  .delete("/rencontre/:rId", sessionMiddleware, async (c) => {
    const { rId } = c.req.param();

    const response = await db.rencontre.findUnique({
      where: { id: rId },
      select: {
        id: true,
      },
    });
    if (!response) return c.json({ error: "Aucun donnée n'a été trouvé" }, 404);

    await db.rencontre.delete({ where: { id: rId } });

    return c.json({ data: { id: response.id, name: "rencontre" } });
  });

export default app;
