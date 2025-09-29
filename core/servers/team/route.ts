import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { v4 } from "uuid";
import { upadateAccessEmploye, upsertTeam } from "@/core/lib/queries";
import {
  EmployeAccesSchema,
  ProfileUserSchema,
  UserSchema,
  ValueSchema,
} from "@/core/lib/schemas";
import { sessionMiddleware } from "@/core/lib/session-middleware";
import { db } from "@/core/lib/db";
import { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/core/supabase/client";
 
import { unstable_cache } from "next/cache";
 

const getData = (id: string, body: User) => ({
  ...body,
  id,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertTeam(data);
};

const getDashboardStats = unstable_cache(
  async (teamId: string) => {
    const data = await db.users.findFirst({
      where: {
        id: teamId,
      },

      include: {
        cv: true,
        conflit: {
          include: {
            files: true,
            partieImpliques: true,
          },
        },
        emargements: {
          include: {
            member: true,
          },
        },
        plannings: {
          include: {
            accompaniments: {
              include: {
                members: true,
              },
            },
            visit: true,
          },
        },
        rencontres: {
          include: {
            visit: true,
            files: true,
            signatures: {
              include: {
                member: true,
              },
            },
          },
        },

        accompaniments: {
          include: {
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
            members: true,
            purchases: {
              include: {
                purchaseItems: true,
              },
            },
            conflits: true,

            project: true,
            rencontre: {
              include: {
                signatures: {
                  include: {
                    member: true,
                  },
                },
              },
            },
            planning: {
              include: {
                accompaniments: {
                  include: {
                    members: true,
                  },
                },
                visit: true,
              },
            },
          },
        },
      },
    });

    return data;
  },
  ["stats-dashboard"],
  { revalidate: 300 } // 10 min
);

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.users.findMany({
      include: {
        cv: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/employe", async (c) => {
    const data = await db.users.findMany({
      where: {
        type: "employe",
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/accompanist", async (c) => {
    const data = await db.users.findMany({
      where: {
        type: "accompanist",
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ data });
  })
  .get("/profile/:teamId", async (c) => {
    const { teamId } = c.req.param();

    const data = await db.users.findFirst({
      where: {
        id: teamId,
      },
    });

    return c.json({ data });
  })
  .get("/users/:chatId", async (c) => {
    const { chatId } = c.req.param();

    const data = await db.users.findMany({
      where: {
        chatParticipant: {
          none: {
            chatId: chatId,
          },
        },
      },
    });

    return c.json({ data });
  })
  .get("/trainer", async (c) => {
    const data = await db.users.findMany({
      where: {
        type: "trainer",
      },
    });

    return c.json({ data });
  })
  .get("/:teamId", async (c) => {
    const { teamId } = c.req.param();

    const data = await getDashboardStats(teamId);

    return c.json({ data });
  })
  .post("/", zValidator("json", UserSchema), sessionMiddleware, async (c) => {
    const response = await handleDatatUpsert(c, v4());

    return c.json({ data: response });
  })
  .patch(
    "/:teamId",
    zValidator("json", UserSchema),
    sessionMiddleware,
    async (c) => {
      const response = handleDatatUpsert(c, c.req.param("teamId"));
      return c.json({ data: response });
    }
  )
  .patch(
    "/:employeId/rolepermission",
    zValidator("json", EmployeAccesSchema),
    sessionMiddleware,
    async (c) => {
      const userConnect = c.get("user");
      const { employeId } = c.req.param();

      const { routes, access } = c.req.valid("json");

      const data = {
        id: employeId,
        routes,
        access,
      };
      const response = await upadateAccessEmploye(data);
      return c.json({ data: response });
    }
  )
  .patch(
    "updateProfilev1/:id/:newpassword/:password/:email",
    sessionMiddleware,
    async (c) => {
      const { id, newpassword, password, email } = c.req.param();

      const { error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return c.json({ error: "Mot de passe incorret" }, 404);
      }

      const user = await db.users.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return c.json({ error: "Not Found" }, 404);
      }

      const { error: updateError, data } =
        await supabaseAdmin.auth.admin.updateUserById(user.authId, {
          password: newpassword,
        });

      if (updateError) {
        return c.json({ error: "Not Found" }, 404);
      }

      return c.json({ data: true });
    }
  )
  .patch(
    "updateProfilev2/:id",
    zValidator("json", ProfileUserSchema),

    sessionMiddleware,
    async (c) => {
      const { id } = c.req.param();

      const { name, address, dob, phone } = c.req.valid("json");

      const user = await db.users.update({
        where: { id },
        data: {
          name,
          address,
          dob,
          phone,
        },
      });

      await supabaseAdmin.auth.updateUser({
        data: {
          name,
        },
      });

      return c.json({ data: user });
    }
  )
  .patch(
    "updateProfilev3/:userId/:op",
    zValidator("json", ValueSchema),
    sessionMiddleware,
    async (c) => {
      const { op, userId } = c.req.param();

      const { value } = await c.req.json();

      const user = await db.users.update({
        where: { id: userId },
        data: op === "cv" ? { filesId: value } : { profile: value },
        include: {
          cv: true,
        },
      });

      if (op === "profile") {
        await supabaseAdmin.auth.updateUser({
          data: {
            profile: value,
          },
        });
      }

      return c.json({ data: user });
    }
  )
  .delete("/:teamId", sessionMiddleware, async (c) => {
    const { teamId } = c.req.param();

    const response = await db.users.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        authId: true,
      },
    });
    if (!response)
      return c.json({ error: "Aucun utilisateur n'a été trouvé" }, 404);

    await supabaseAdmin.auth.admin.deleteUser(response.authId);

    await db.users.delete({ where: { id: teamId } });

    return c.json({ data: { id: response.id, name: response.name } });
  });

export default app;
