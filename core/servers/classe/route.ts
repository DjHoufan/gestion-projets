import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { v4 } from "uuid";
import { upserClasse } from "@/core/lib/queries";
import { ClasseMembersSchema, ClasseSchema } from "@/core/lib/schemas";
import { errorHandler, sessionMiddleware } from "@/core/lib/session-middleware";
import { db } from "@/core/lib/db";
import { Project } from "@prisma/client";

const getData = (id: string, body: Project) => ({
  ...body,
  id,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upserClasse(data);
};

const app = new Hono()
  .get("/", errorHandler, async (c) => {
    const data = await db.classe.findMany({
      include: {
        project: true,
        user: true,
      },
      orderBy: {
        projectId: "desc",
      },
    });
    return c.json({ data });
  })
  .get("/:cId", errorHandler, async (c) => {
    const { cId } = c.req.param();

    const data = await db.classe.findFirst({
      where: {
        id: cId,
      },
      include: {
        project: true,
        user: true,
        members: {
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
        },
      },
    });
    return c.json({ data });
  })
  .post(
    "/",
    errorHandler,
    zValidator("json", ClasseSchema),
    sessionMiddleware,
    async (c) => {
      const response = await handleDatatUpsert(c, v4());

      return c.json({ data: response });
    }
  )
  .patch(
    "/:cId",
    errorHandler,
    zValidator("json", ClasseSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("cId"));
      return c.json({ data: response });
    }
  )
  .patch(
    "/addMember/:cId",
    errorHandler,
    zValidator("json", ClasseMembersSchema),
    sessionMiddleware,
    async (c) => {
      const { cId } = c.req.param();
      const { members } = c.req.valid("json");

      const response = await db.classe.update({
        where: {
          id: cId,
        },
        data: {
          members: {
            connect: members.map((m) => ({ id: m.id, phone: m.phone })),
          },
        },
      });

      return c.json({ data: response });
    }
  )
  .delete("/:cId", errorHandler, sessionMiddleware, async (c) => {
    const { cId } = c.req.param();

    const response = await db.classe.delete({ where: { id: cId } });

    return c.json({ data: { id: response.id, name: response.name } });
  });

export default app;
