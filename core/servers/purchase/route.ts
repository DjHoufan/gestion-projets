import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/core/lib/db";
import { v4 } from "uuid";
import {
  DeletePurchaseItem,
  upsertPurchase,
  upsertPurchaseItem,
} from "@/core/lib/queries";
import { PurchaseItemSchema, PurchaseSchema } from "@/core/lib/schemas";
import { errorHandler, sessionMiddleware } from "@/core/lib/session-middleware";

import { Purchase, PurchaseItems } from "@prisma/client";

const getData = (
  id: string,
  body: Purchase & {
    purchaseItems: PurchaseItems[];
  }
) => ({
  ...body,
  id,
  purchaseItems: body.purchaseItems,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertPurchase(data);
};

const getDataITems = (id: string, body: PurchaseItems) => ({
  ...body,
  id,
});

const handleDataItemtUpsert = async (c: any, id: string) => {
  const data = getDataITems(id, c.req.valid("json"));
  return await upsertPurchaseItem(data);
};

const app = new Hono()
  .onError((err, c) => {
    return c.json({ error: err }, 400);
  })
  .get("/", async (c) => {
    const data = await db.purchase.findMany({
      include: {
        purchaseItems: true,
        accompaniment: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/:pId", async (c) => {
    const { pId } = c.req.param();
    const data = await db.purchase.findFirst({
      where: {
        id: pId,
      },
      include: {
        purchaseItems: true,
      },
    });
    return c.json({ data });
  })

  .post(
    "/",
    zValidator("json", PurchaseSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const response = await handleDatatUpsert(c, v4());
      return c.json({ data: response });
    }
  )
  .post(
    "/purchaseItem",
    zValidator("json", PurchaseItemSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const response = await handleDataItemtUpsert(c, v4());
      return c.json({ data: response });
    }
  )
  .patch(
    "/:pId",
    zValidator("json", PurchaseSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("pId"));
      return c.json({ data: response });
    }
  )
  .delete("/:pItemId/purchaseItem", sessionMiddleware, async (c) => {
    const { pItemId } = c.req.param();

    const response = await DeletePurchaseItem(pItemId);

    return c.json({ data: response });
  })
  .delete("/:pId", sessionMiddleware, async (c) => {
    const { pId } = c.req.param();

    const response = await db.purchase.findUnique({
      where: { id: pId },
      select: {
        id: true,
      },
    });
    if (!response) return c.json({ error: "Aucun achat n'a été trouvé" }, 404);

    await db.purchase.delete({ where: { id: pId } });

    return c.json({ data: { id: response.id, name: "achats" } });
  });

export default app;
