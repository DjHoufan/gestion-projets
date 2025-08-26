import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { v4 } from "uuid";
import { upsertUpload } from "@/core/lib/queries";
import { UploadSchema } from "@/core/lib/schemas";
import { sessionMiddleware } from "@/core/lib/session-middleware";
import { db } from "@/core/lib/db";
import { UploadDetail } from "@/core/lib/types";

const getData = (id: string, body: Partial<UploadDetail>) => ({
  ...body,
  id,
  file: body.file,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertUpload(data);
};

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.upload.findMany({
      include: {
        file: true,
        user: true,
      },
    });
    return c.json({ data });
  })
  .get("/:tId", async (c) => {
    const { tId } = c.req.param();

    const data = await db.upload.findFirst({
      where: {
        id: tId,
      },
      include: {
        file: true,
        user: true,
      },
    });

    return c.json({ data });
  })
  .get("/my/:userId", async (c) => {
    const { userId } = c.req.param();

    const data = await db.upload.findMany({
      where: {
        userId: userId,
      },
      include: {
        file: true,
        user: true,
      },
    });

    return c.json({ data });
  })
  .post("/", zValidator("json", UploadSchema), sessionMiddleware, async (c) => {
    const response = await handleDatatUpsert(c, v4());

    return c.json({ data: response });
  })
  .patch(
    "/:tId",
    zValidator("json", UploadSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("tId"));
      return c.json({ data: response });
    }
  )
  .delete("/:tId", sessionMiddleware, async (c) => {
    const { tId } = c.req.param();

    const response = await db.upload.delete({ where: { id: tId } });

    return c.json({ data: { id: response.id, name: response.titre } });
  });

export default app;
