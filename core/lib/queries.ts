"server-only";

import {
  Accompaniment,
  Classe,
  Conflit,
  Emargement,
  Events,
  Leave,
  Maps,
  Member,
  Message,
  Planning,
  Project,
  Purchase,
  PurchaseItems,
  Rencontre,
  Signalement,
  Upload,
  Users,
  VisiteTerrain,
  Visits,
} from "@prisma/client";
import { db } from "./db";
import {
  AccompanimentSchema,
  ClasseSchema,
  ConflitSchema,
  EmargementSchema,
  EventsSchema,
  LeaveSchema,
  MapsSchema,
  MemberSchema,
  messageSchema,
  PlanningSchema,
  PurchaseItemSchema,
  PurchaseSchema,
  RencontreSchema,
  SignalementSchema,
  UploadSchema,
  UserSchema,
  VisiteTerrainSchema,
  VisitsSchemaCreate,
} from "./schemas";
import z from "zod";
import { supabaseAdmin } from "../supabase/client";
import { toast } from "@/core/components/global/custom-toast";

export const upsertProjet = async (data: Partial<Project>) => {
  const res = await db.project.upsert({
    where: { id: data.id },
    update: { ...data },
    create: {
      id: data.id,
      name: data.name!,
      startDate: data.startDate!,
      endDate: data.endDate!,
      local: data.local!,
      createdAt: new Date(),
      chat: {
        create: {},
      },
    },
  });

  return res;
};

export const upsertTeam = async (d: Partial<Users>) => {
  // 1. Validation des données avec message d'erreur plus précis
  const validation = UserSchema.extend({ id: z.string() }).safeParse(d);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: userData } = validation;

  const generatePassword = (length = 12) =>
    Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((x) => (x % 36).toString(36))
      .join("");

  const existingUser = await db.users.findUnique({
    where: { id: userData.id },
    select: { authId: true, name: true, profile: true },
  });

  let authUserId = existingUser?.authId ?? null;
  let shouldCleanup = false;

  try {
    if (existingUser) {
      const updatePayload: { user_metadata: any } = { user_metadata: {} };

      if (userData.name != existingUser.name)
        updatePayload.user_metadata.name = userData.name;
      if (userData.profile != existingUser.profile)
        updatePayload.user_metadata.profile = userData.profile;

      if (Object.keys(updatePayload.user_metadata).length > 0) {
        await supabaseAdmin.auth.admin.updateUserById(
          existingUser.authId,
          updatePayload
        );
      }
    } else {
      // 5. Création avec gestion d'erreur améliorée
      const password = generatePassword();
      const { data: authData, error } =
        await supabaseAdmin.auth.admin.createUser({
          email: userData.email ?? "",
          password,
          user_metadata: {
            name: userData.name ?? "",
            profile: userData.profile,
            access: ["/"],
            type: userData.type,
          },
          email_confirm: true,
        });

      if (error) {
        throw error.message.includes("User already exists")
          ? new Error("Un utilisateur avec cet email existe déjà.")
          : new Error(`Échec de la création: ${error.message}`);
      }

      authUserId = authData.user?.id;
      shouldCleanup = true;

      // 6. Envoi asynchrone du reset password pour ne pas bloquer
      supabaseAdmin.auth
        .resetPasswordForEmail(userData.email!)
        .catch((e) =>
          toast.error({ message: "Échec envoi reset password:" + e })
        );
    }

    const { cv, ...newData } = validation.data;
    const upsertData = { ...newData, filesId: cv?.id! };

    // 7. Upsert optimisé
    return await db.users.upsert({
      where: { id: userData.id },
      update: upsertData,
      create: {
        authId: authUserId!,
        createdAt: new Date(),
        ...upsertData,
      },
    });
  } catch (error) {
    // 8. Nettoyage amélioré avec log
    if (shouldCleanup && authUserId) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(authUserId);
      } catch (cleanupError) {}
    }

    throw error instanceof Error
      ? error
      : new Error("Erreur inattendue lors de la mise à jour de l'équipe");
  }
};

export const upsertMember = async (data: Partial<Member>) => {
  // 1. Validation des données avec message d'erreur plus précis
  const validation = MemberSchema.extend({ id: z.string() }).safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: userData } = validation;

  const res = await db.member.upsert({
    where: { id: data.id },
    update: { ...userData },
    create: {
      ...userData,

      createdAt: new Date(),
    },
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
  });

  return res;
};

export const upsertAccompaniment = async (data: Partial<Accompaniment>) => {
  // 1. Validation des données avec message d'erreur plus précis
  const validation = AccompanimentSchema.extend({ id: z.string() }).safeParse(
    data
  );
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }

  const { file, ...newData } = validation.data;
  const upsertData = { ...newData, fileId: file?.id! };

  const res = await db.accompaniment.upsert({
    where: { id: data.id },
    update: {
      ...upsertData,
      phones: newData.phones.map((phone) => phone.value),
      members: {
        set: [],
        connect: newData.members.map((m) => ({ id: m.value })),
      },
    },
    create: {
      ...upsertData,
      phones: newData.phones.map((phone) => phone.value),
      members: {
        connect: newData.members.map((m) => ({ id: m.value })),
      },
      createdAt: new Date(),
    },
  });

  return res;
};

export const upsertMaps = async (data: Partial<Maps>) => {
  // 1. Validation des données avec message d'erreur plus précis
  const validation = MapsSchema.extend({ id: z.string() }).safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: newData } = validation;

  const res = await db.maps.upsert({
    where: { id: data.id },
    update: {
      ...newData,
      updatedAt: new Date(),
    },
    create: {
      ...newData,

      createdAt: new Date(),
    },
    include: {
      accompaniment: {
        include: {
          users: true,
          members: true,
        },
      },
    },
  });

  return res;
};

export const upsertPurchase = async (
  data: Partial<
    Purchase & {
      purchaseItems: PurchaseItems[];
    }
  >
) => {
  const validation = PurchaseSchema.extend({ id: z.string() }).safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: newData } = validation;

  const { accompanimentId, purchaseItems, ...restData } = newData;

  const res = await db.purchase.create({
    data: {
      ...restData,
      total:
        newData.purchaseItems?.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          return sum + price * item.quantity;
        }, 0) ?? 0,
      accompaniment: {
        connect: { id: accompanimentId },
      },
      purchaseItems: {
        create: purchaseItems,
      },
      createdAt: new Date(),
    },
    include: {
      purchaseItems: true,
    },
  });

  return res;
};

export const upsertPurchaseItem = async (data: Partial<PurchaseItems>) => {
  const validation = PurchaseItemSchema.extend({ id: z.string() }).safeParse(
    data
  );
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: newData } = validation;

  const res = await db.purchaseItems.create({
    data: {
      name: newData.name,
      id: newData.id,
      price: newData.price,
      image: newData.image,
      facture: newData.facture,
      quantity: newData.quantity,
      date: newData.date,
      purchase: {
        connect: { id: newData.purchaseId },
      },
    },
  });

  const response = await db.purchase.findUnique({
    where: { id: res.purchaseId },
    include: { purchaseItems: true },
  });

  return await db.purchase.update({
    where: { id: res.purchaseId },
    data: {
      total:
        response?.purchaseItems.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          return sum + price * item.quantity;
        }, 0) ?? 0,
    },
    include: { purchaseItems: true },
  });
};

export const DeletePurchaseItem = async (id: string) => {
  const purchaseItem = await db.purchaseItems.findUnique({ where: { id } });

  if (!purchaseItem) {
    throw new Error(`Aucune donnée trouvée pour l'élément avec l'ID ${id}`);
  }

  await db.purchaseItems.delete({ where: { id } });

  const purchase = await db.purchase.findUnique({
    where: { id: purchaseItem.purchaseId },
    include: { purchaseItems: true },
  });

  if (!purchase) {
    return null;
  }
  const total = purchase.purchaseItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return await db.purchase.update({
    where: { id: purchase.id },
    data: { total },
    include: { purchaseItems: true },
  });
};

export const upsertPlanning = async (data: Partial<Planning>) => {
  const validation = PlanningSchema.extend({ id: z.string() }).safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: newData } = validation;

  const { accompanimentId, visit, ...restData } = newData;

  const res = await db.planning.create({
    data: {
      ...restData,
      accompaniments: {
        connect: { id: accompanimentId },
      },
      visit: {
        create: visit,
      },
    },
    include: {
      visit: true,
      users: true,
    },
  });

  return res;
};

export const upserVisit = async (data: Partial<Visits>[]) => {
  const validation = VisitsSchemaCreate.safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: newData } = validation;

  await db.visits.createMany({
    data: newData.map((visit) => ({
      date: visit.date,
      location: visit.location,
      objetif: visit.objetif,
      startTime: visit.startTime,
      endTime: visit.endTime,
      planningId: visit.planningId!,
    })),
  });

  const res = await db.planning.findUnique({
    where: {
      id: newData[0].planningId!,
    },
    include: {
      visit: true,
      users: true,
    },
  });

  return res;
};

export const DeleteVisit = async (id: string) => {
  const purchaseItem = await db.purchaseItems.findUnique({ where: { id } });

  if (!purchaseItem) {
    throw new Error(`Aucune donnée trouvée pour l'élément avec l'ID ${id}`);
  }

  await db.purchaseItems.delete({ where: { id } });

  const purchase = await db.purchase.findUnique({
    where: { id: purchaseItem.purchaseId },
    include: { purchaseItems: true },
  });

  if (!purchase) {
    return null;
  }
  const total = purchase.purchaseItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return await db.purchase.update({
    where: { id: purchase.id },
    data: { total },
    include: { purchaseItems: true },
  });
};

export const upsertEmargement = async (data: Partial<Emargement>) => {
  // ✅ Validation
  const validation = EmargementSchema.safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }

  const { data: newData } = validation;

  // ✅ Récupérer l'ancien montant seulement si update
  const oldvalue = data.id
    ? (
        await db.emargement.findUnique({
          where: { id: data.id },
          select: { montant: true },
        })
      )?.montant ?? 0
    : 0;

  // ✅ Upsert direct
  const res = await db.emargement.upsert({
    where: { id: data.id },
    update: newData,
    create: newData,
    include: { member: true },
  });

  // ✅ Mise à jour budget uniquement si signature existe
  if (res.signature) {
    const diff = oldvalue > 0 ? res.montant - oldvalue : res.montant;

    await db.accompaniment.update({
      where: { id: res.member.accompanimentId! },
      data: { budget: { increment: diff } },
    });
  }

  console.log({ res });

  return res;
};

export const upsertVisiteTerrain = async (data: Partial<VisiteTerrain>) => {
  const validation = VisiteTerrainSchema.safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: newData } = validation;

  const res = await db.visiteTerrain.upsert({
    where: { id: data.id },
    update: {
      ...newData,
      personnes: {
        deleteMany: {},
        create: newData.personnes,
      },
      files: {
        deleteMany: {},
        connect: newData.files?.map((f) => ({
          id: f.id,
        })),
      },
    },
    create: {
      ...newData,
      personnes: {
        create: newData.personnes,
      },
      files: {
        connect: newData.files?.map((f) => ({
          id: f.id,
        })),
      },
      createdAt: new Date(),
    },
  });

  return res;
};

export const upsertConflit = async (data: Partial<Conflit>) => {
  const validation = ConflitSchema.safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: newData } = validation;

  const res = await db.conflit.upsert({
    where: { id: data.id },
    update: {
      ...newData,
      partieImpliques: {
        deleteMany: {},
        create: newData.partieImpliques,
      },
      files: {
        deleteMany: {},
        connect: newData.files?.map((f) => ({
          id: f.id,
        })),
      },
      updatedAt: new Date(),
    },
    create: {
      ...newData,
      partieImpliques: {
        create: newData.partieImpliques,
      },
      files: {
        connect: newData.files?.map((f) => ({
          id: f.id,
        })),
      },
      createdAt: new Date(),
    },
    include: {
      partieImpliques: true,
      files: true,
    },
  });

  return res;
};

export const upsertRencontre = async (data: Partial<Rencontre>) => {
  const validation = RencontreSchema.safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: newdata } = validation;

  const newData = {
    ...newdata,
    signatures: newdata.signatures.map(
      ({ rencontreId, ...signature }) => signature
    ),
  };

  // ⚡️ D'abord on supprime les signatures existantes si l'ID existe
  if (data.id) {
    await db.signature.deleteMany({
      where: { rencontreId: data.id },
    });
  }

  const res = await db.rencontre.upsert({
    where: { id: data.id },
    update: {
      ...newData,
      order: newData.order.map((item) => item.value),
      decisions: newData.decisions.map((item) => item.value),
      actions: newData.actions.map((item) => item.value),

      // 🔹 On recrée toutes les signatures après deleteMany
      signatures: {
        create: newData.signatures.map((sig) => ({
          date: sig.date,
          present: sig.present,
          member: { connect: { id: sig.memberId } },
        })),
      },

      // 🔹 On remplace les fichiers existants par les nouveaux
      files: {
        set: newData.files?.map((f) => ({ id: f.id })),
      },
    },
    create: {
      ...newData,
      order: newData.order.map((item) => item.value),
      decisions: newData.decisions.map((item) => item.value),
      actions: newData.actions.map((item) => item.value),
      signatures: {
        create: newData.signatures.map((sig) => ({
          date: sig.date,
          present: sig.present,
          member: { connect: { id: sig.memberId } },
        })),
      },
      files: {
        connect: newData.files?.map((f) => ({ id: f.id })),
      },
    },
    include: {
      visit: true,
      files: true,
      signatures: {
        include: {
          member: true,
        },
      },
    },
  });

  return res;
};

export const upsertUpload = async (data: Partial<Upload>) => {
  const validation = UploadSchema.extend({ id: z.string() }).safeParse(data);

  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }

  const { file, ...uploadData } = validation.data;
  const upsertData = { ...uploadData, fileId: file?.id! };

  return db.upload.upsert({
    where: { id: data.id },
    update: upsertData,
    create: upsertData,
  });
};

// export const sendMessage = async (data: Partial<Message>) => {
//   const validation = messageSchema.safeParse(data);

//   if (!validation.success) {
//     const errorDetails = validation.error.errors
//       .map((e) => `${e.path.join(".")}: ${e.message}`)
//       .join(", ");
//     throw new Error(`Données invalides: ${errorDetails}`);
//   }

//   const { chatId, senderId, content } = validation.data;

//   const res = await db.$transaction(async (tx) => {
//     // 1️⃣ Créer le message
//     const message = await tx.message.create({
//       data: {
//         chatId,
//         senderId,
//         content,
//       },
//       include: {
//         sender: true,
//       },
//     });

//     // 2️⃣ Récupérer tous les participants du chat
//     const participants = await tx.chatParticipant.findMany({
//       where: { chatId },
//       select: { userId: true },
//     });

//     const admins = await tx.users.findMany({ where: { type: "admin" } });

//     const allUsers = [
//       ...new Set([
//         ...participants.map((p) => p.userId),
//         ...admins.map((a) => a.id),
//       ]),
//     ];

//     // 3️⃣ Créer les MessageView en bulk
//     await tx.messageView.createMany({
//       data: allUsers.map((userId) => ({
//         messageId: message.id,
//         userId: userId,
//         createdAt: new Date(),
//       })),
//     });

//     return message;
//   });

//   return res;
// };

export const sendMessage = async (data: Partial<Message>) => {
  const validation = messageSchema.safeParse(data);

  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }

  const { chatId, senderId, content } = validation.data;

  // 1️⃣ Créer le message et le retourner directement
  const message = await db.message.create({
    data: {
      chatId,
      senderId,
      content,
    },
    include: {
      sender: true,
    },
  });

  // 2️⃣ Lancer la création des autres données en arrière-plan (pas de blocage)
  (async () => {
    try {
      const participants = await db.chatParticipant.findMany({
        where: { chatId },
        select: { userId: true },
      });

      const admins = await db.users.findMany({ where: { type: "admin" } });

      const allUsers = [
        ...new Set([
          ...participants.map((p) => p.userId),
          ...admins.map((a) => a.id),
        ]),
      ].filter((id) => id !== senderId); // 🚀 Exclure l'expéditeur

      if (allUsers.length > 0) {
        await db.messageView.createMany({
          data: allUsers.map((userId) => ({
            messageId: message.id,
            userId,
            createdAt: new Date(),
          })),
        });
      }
    } catch (err) {}
  })();

  return message;
};

export const upsertLeave = async (data: Partial<Leave>) => {
  const validation = LeaveSchema.extend({ id: z.string() }).safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: userData } = validation;

  const res = await db.leave.upsert({
    where: { id: data.id },
    update: { ...userData },
    create: {
      ...userData,
      createdAt: new Date(),
    },
  });

  return res;
};

export const upserClasse = async (data: Partial<Classe>) => {
  const validation = ClasseSchema.extend({ id: z.string() }).safeParse(data);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: userData } = validation;

  const res = await db.classe.upsert({
    where: { id: data.id },
    update: { ...userData },
    create: {
      ...userData,
      createdAt: new Date(),
    },
  });

  return res;
};

export const upadateAccessEmploye = async (data: Partial<Users>) => {
  const response = await db.users.update({
    where: {
      id: data.id,
    },
    data: {
      routes: data.routes,
      access: data.access,
    },
  });

  const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(
    response.authId!,
    {
      user_metadata: {
        routes: response.routes,
        access: response.access,
      },
    }
  );
  if (error) {
    throw new Error(error.message);
  }

  return response;
};

export const getMyChat = async (userId: string) => {
  const response = await db.chat.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      project: true,
      participants: {
        where: {
          userId: {
            not: userId,
          },
        },
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return response;
};

export const upsertSignalement = async (data: Partial<Signalement>) => {
  const validation = SignalementSchema.extend({ id: z.string() }).safeParse(
    data
  );

  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }

  const ValidData = validation.data;

  return await db.signalement.upsert({
    where: { id: data.id },
    update: ValidData,
    create: ValidData,
  });
};

export const upsertEvents = async (data: Partial<Events>) => {
  const validation = EventsSchema.safeParse(data);

  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Données invalides: ${errorDetails}`);
  }
  const { data: newdata } = validation;

  const res = await db.events.upsert({
    where: { id: data.id },
    update: {
      ...newdata,

      files: {
        set: newdata.files?.map((f) => ({ id: f.id })),
      },
    },
    create: {
      ...newdata,

      files: {
        connect: newdata.files?.map((f) => ({ id: f.id })),
      },
    },
  });

  return res;
};
