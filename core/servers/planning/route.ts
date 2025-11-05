import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/core/lib/db";
import { v4 } from "uuid";
import { DeleteVisit, upsertPlanning, upserVisit } from "@/core/lib/queries";
import {
  PlanningSchema,
  StatusSchema,
  VisitsSchemaCreate,
} from "@/core/lib/schemas";
import { errorHandler, sessionMiddleware } from "@/core/lib/session-middleware";

import { Planning, Visits } from "@prisma/client";

const getData = (
  id: string,
  body: Planning & {
    visits: Visits[];
  }
) => ({
  ...body,
  id,
  visits: body.visits,
});

const handleDatatUpsert = async (c: any, id: string) => {
  const data = getData(id, c.req.valid("json"));
  return await upsertPlanning(data);
};

const getDataITems = (body: Partial<Visits>) => ({
  ...body,
});

const app = new Hono()
  .onError((err, c) => {
    return c.json({ error: err }, 400);
  })
  // ✅ Route sécurisée avec middleware et filtre utilisateur
  .get("/", sessionMiddleware, async (c) => {
    // Récupérer l'utilisateur authentifié du contexte
    const user = c.get("user");

    // Filtrer les plannings par utilisateur connecté
    const data = await db.planning.findMany({
      where: {
        usersId: user.id, // ✅ FILTRE DE SÉCURITÉ : Seulement les plannings de cet utilisateur
      },
      include: {
        visit: true,
        accompaniments: {
          include: {
            users: true,
            members: true,
            project: true,
          },
        },
      },
    });
    return c.json({ data });
  })
  .get("my/:plangId", async (c) => {
    const { plangId } = c.req.param();

    const data = await db.planning.findMany({
      where: {
        usersId: plangId,
      },
      include: {
        visit: {
          where: {
            Rencontre: {
              none: {},
            },
            status: false,
          },
        },
        accompaniments: {
          include: {
            users: true,
            members: true,
            project: true,
          },
        },
      },
    });

    return c.json({ data });
  })
  // ✅ Sécuriser la route GET par ID
  .get("/:plangId", sessionMiddleware, async (c) => {
    const { plangId } = c.req.param();
    const user = c.get("user");

    const data = await db.planning.findFirst({
      where: {
        id: plangId,
        usersId: user.id, // ✅ Vérifier que le planning appartient à l'utilisateur
      },
      include: {
        visit: true,
        accompaniments: {
          include: {
            users: true,
            members: true,
          },
        },
      },
    });

    if (!data) {
      return c.json({ error: "Planning non trouvé ou accès refusé" }, 404);
    }

    return c.json({ data });
  })

  .post(
    "/",
    zValidator("json", PlanningSchema),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const response = await handleDatatUpsert(c, v4());
      return c.json({ data: response });
    }
  )
  .post(
    "/visit",
    zValidator("json", VisitsSchemaCreate),
    sessionMiddleware,
    errorHandler,
    async (c) => {
      const visitsData = c.req.valid("json");
      const dataItems = visitsData.map((visit) => getDataITems(visit));
      const response = await upserVisit(dataItems);
      return c.json({ data: response });
    }
  )
  // ✅ Sécuriser la route PATCH
  .patch(
    "/:plangId",
    zValidator("json", PlanningSchema),
    sessionMiddleware,
    async (c) => {
      const { plangId } = c.req.param();
      const user = c.get("user");

      // Vérifier que le planning appartient à l'utilisateur avant modification
      const existingPlanning = await db.planning.findFirst({
        where: {
          id: plangId,
          usersId: user.id, // ✅ FILTRE DE SÉCURITÉ
        },
      });

      if (!existingPlanning) {
        return c.json({ error: "Planning non trouvé ou accès refusé" }, 404);
      }

      const response = await handleDatatUpsert(c, plangId);
      return c.json({ data: response });
    }
  )
  // ✅ Sécuriser la route PATCH status visit
  .patch(
    "/:plangId/status/visit",
    zValidator("json", StatusSchema),
    sessionMiddleware,
    async (c) => {
      const { status } = c.req.valid("json");
      const { plangId } = c.req.param();

      // Vérifier que la visite appartient à un planning de l'utilisateur
      const visit = await db.visits.findFirst({
        where: {
          id: plangId,
        },
        include: {
          Planning: {
            select: {
              usersId: true,
            },
          },
        },
      });

      if (!visit) {
        return c.json({ error: "Visite non trouvée ou accès refusé" }, 404);
      }

      const response = await db.visits.update({
        where: {
          id: plangId,
        },
        data: {
          status: status,
        },
      });
      return c.json({ data: response });
    }
  )
  // ✅ Sécuriser la route PATCH visit
  .patch(
    "visit/:visitId",
    zValidator("json", VisitsSchemaCreate),
    sessionMiddleware,
    async (c) => {
      const { visitId } = c.req.param();
      const user = c.get("user");

      // Vérifier que la visite appartient à un planning de l'utilisateur
      const visit = await db.visits.findFirst({
        where: {
          id: visitId,
        },
        include: {
          Planning: {
            select: {
              usersId: true,
            },
          },
        },
      });

      if (!visit || visit.Planning.usersId !== user.id) {
        return c.json({ error: "Visite non trouvée ou accès refusé" }, 404);
      }

      const visitsData = c.req.valid("json");
      const dataItems = visitsData.map((visit) => getDataITems(visit));

      const response = await db.visits.update({
        where: {
          id: visitId,
        },
        data: {
          ...dataItems[0],
        },
      });
      return c.json({ data: response });
    }
  )
  .delete("/:pItemId/visit", sessionMiddleware, async (c) => {
    const { pItemId } = c.req.param();

    const response = await DeleteVisit(pItemId);

    return c.json({ data: response });
  })
  // ✅ Sécuriser la route DELETE visit
  .delete("visit/:visitId", sessionMiddleware, async (c) => {
    const { visitId } = c.req.param();
    const user = c.get("user");

    try {
      // Vérifier que la visite appartient à un planning de l'utilisateur
      const visit = await db.visits.findFirst({
        where: {
          id: visitId,
        },
        include: {
          Planning: {
            select: {
              usersId: true,
            },
          },
        },
      });

      if (!visit || visit.Planning.usersId !== user.id) {
        return c.json({ error: "Visite non trouvée ou accès refusé" }, 404);
      }

      const response = await db.visits.delete({
        where: { id: visitId },
      });

      return c.json({ data: response });
    } catch (error: any) {
      if (error.code === "P2003") {
        if (error.message.includes("Rencontre_visitId_fkey")) {
          return c.json(
            {
              error:
                "Ce créneau est lié à une rencontre, suppression impossible.",
            },
            409 // <- Status HTTP Conflict
          );
        }
      }

      return c.json({ error: "Erreur interne du serveur" }, 500);
    }
  })
  // ✅ Sécuriser la route DELETE
  .delete("/:plangId", sessionMiddleware, async (c) => {
    const { plangId } = c.req.param();
    const user = c.get("user");

    // Vérifier que le planning existe ET appartient à l'utilisateur
    const response = await db.planning.findFirst({
      where: {
        id: plangId,
        usersId: user.id, // ✅ FILTRE DE SÉCURITÉ
      },
      select: {
        id: true,
      },
    });

    if (!response) {
      return c.json({ error: "Planning non trouvé ou accès refusé" }, 404);
    }

    await db.planning.delete({ where: { id: plangId } });

    return c.json({ data: { id: response.id, name: "planning" } });
  });

export default app;
