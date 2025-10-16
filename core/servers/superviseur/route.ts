import { Hono } from "hono";
 
const app = new Hono()
  .onError((err, c) => {
    return c.json({ error: err }, 400);
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
export default app;
