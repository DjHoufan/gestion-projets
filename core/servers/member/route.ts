import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/core/lib/db";
import { v4 } from "uuid";
import { upsertMember } from "@/core/lib/queries";
import { MemberSchema } from "@/core/lib/schemas";
import { errorHandler, sessionMiddleware } from "@/core/lib/session-middleware";

import { Member } from "@prisma/client";

const getData = (id: string, body: Member) => ({
  ...body,
  id,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertMember(data);
};

const app = new Hono()
  .onError((err, c) => {
    return c.json({ error: err }, 400);
  })
  .get("/", async (c) => {
    const data = await db.member.findMany({
      include: {
        leave: true,
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/withoutgroup", async (c) => {
    const excludeIds = c.req.queries("excludeIds") || [];

    const data = await db.member.findMany({
      where: {
        OR: [
          {
            accompaniment: {
              is: null,
            },
          },
          {
            id: {
              in: excludeIds,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return c.json({ data });
  })
  .get("/:emId", async (c) => {
    const { emId } = c.req.param();

    const data = await db.member.findFirst({
      where: {
        id: emId,
      },
      include: {
        accompaniment: {
          include: {
            map: {
              include: {
                accompaniment: {
                  include: {
                    members: true,
                    users: true,
                  },
                },
              },
            },
            planning: {
              include: {
                visit: true,
              },
            },
            project: true,
            purchases: {
              include: {
                purchaseItems: true,
              },
            },
            users: true,
          },
        },
      },
    });
    return c.json({ data });
  })
  .post(
    "/",
    zValidator("json", MemberSchema),
    sessionMiddleware,
    errorHandler,

    async (c) => {
      const response = await handleDatatUpsert(c, v4());
      return c.json({ data: response });
    }
  )
  .patch(
    "/:emId",
    zValidator("json", MemberSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("emId"));
      return c.json({ data: response });
    }
  )
  .delete("/:emId", sessionMiddleware, async (c) => {
    const { emId } = c.req.param();

    const response = await db.member.findUnique({
      where: { id: emId },
      select: {
        id: true,
        name: true,
      },
    });
    if (!response)
      return c.json({ error: "Aucun bénéficiaire n'a été trouvé" }, 404);

    await db.member.delete({ where: { id: emId } });

    return c.json({ data: { id: response.id, name: response.name } });
  });

export default app;
