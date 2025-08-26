import { Hono } from "hono";
import { db } from "@/core/lib/db";
import { zValidator } from "@hono/zod-validator";
import { errorHandler, sessionMiddleware } from "@/core/lib/session-middleware";
import { messageSchema } from "@/core/lib/schemas";
import { getMyChat, sendMessage } from "@/core/lib/queries";

const app = new Hono()
  .onError((err, c) => {
    return c.json({ error: err }, 400);
  })
  .get("/", errorHandler, async (c) => {
    const data = await db.chat.findMany({
      include: {
        project: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/messageView/:userId", errorHandler, async (c) => {
    const { userId } = c.req.param();

    const data = await db.messageView.findMany({
      where: {
        view: false,
        userId: userId,
        message: {
          senderId: {
            not: userId,
          },
        },
      },
      include: {
        message: {
          include: {
            sender: true,
            chat: true,
          },
        },
        user: true,
      },
    });
    return c.json({ data });
  })
  .get("/messageViewAll/:userId", errorHandler, async (c) => {
    const { userId } = c.req.param();

    const data = await db.messageView.findMany({
      where: {
        view: false,
        userId: userId,
      },
      include: {
        message: {
          include: {
            sender: true,
            chat: true,
          },
        },
        user: true,
      },
    });

    return c.json({ data });
  })
  .get("/message/:chatId", errorHandler, async (c) => {
    const { chatId } = c.req.param();

    const data = await db.message.findMany({
      include: {
        sender: true,
      },
      where: {
        chatId: chatId,
      },
    });
    return c.json({ data });
  })
  .get("/myChat/:userId", errorHandler, async (c) => {
    const { userId } = c.req.param();

    const data = await getMyChat(userId);
    return c.json({ data });
  })
  .post("/participants/:userId/:chatId", errorHandler, async (c) => {
    const { userId, chatId } = c.req.param();

    const data = await db.chatParticipant.create({
      data: {
        chatId: chatId,
        userId: userId,
        joinedAt: new Date(),
      },
    });
    return c.json({ data });
  })
  .post(
    "/messages",
    zValidator("json", messageSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const { senderId, chatId, content } = c.req.valid("json");

      const res = {
        senderId,
        chatId,
        content,
      };
      const data = await sendMessage(res);
      return c.json({ data });
    }
  )
  .patch("/messageView/:mvId", sessionMiddleware, errorHandler, async (c) => {
    const { mvId } = c.req.param();

    const data = await db.messageView.update({
      where: {
        id: mvId,
      },
      data: {
        view: true,
      },
    });
    return c.json({ data });
  })
  .patch(
    "/AllMymessageView/:userId",
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const { userId } = c.req.param();

      const data = await db.messageView.updateMany({
        where: {
          userId: userId,
        },
        data: {
          view: true,
        },
      });
      return c.json({ data });
    }
  )
  .delete("/participants/:pId", errorHandler, async (c) => {
    const { pId } = c.req.param();

    const data = await db.chatParticipant.delete({
      where: {
        id: pId,
      },
    });
    return c.json({ data });
  });
export default app;
