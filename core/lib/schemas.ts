import { timeToMinutes } from "@/core/lib/utils";
import { z } from "zod";

// Enums Zod avec valeurs possibles
export const StatusEnum = z.enum(["enabled", "disabled"], {
  required_error: "Le statut est requis.",
  invalid_type_error: "Le statut doit être 'enabled' ou 'disabled'.",
});

export const TypeEnum = z.enum(["admin", "employe", "accompanist", "trainer"], {
  required_error: "Le type est requis.",
  invalid_type_error: "Le type doit être 'admin', 'employe' ou 'accompanist'.",
});

const DocumentSchema = z.object({
  id: z.string().uuid(),

  type: z
    .string()
    .min(2, "Le type du document doit contenir au moins 2 caractères")
    .nonempty("Le type du document est requis"),
  name: z
    .string()
    .min(2, "Le nom du document doit contenir au moins 2 caractères")
    .nonempty("Le nom du document est requis"),
  url: z.string().url("L'URL du document doit être valide"),
});

export const AuthSchema = z.object({
  email: z
    .string({ required_error: "L'e-mail est requis" })
    .email("L'e-mail doit être valide")
    .min(5, { message: "L'e-mail doit contenir au moins 5 caractères" }),

  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(5, { message: "Le mot de passe doit contenir au moins 5 caractères" }),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(1, {
    message: "Le mot de passe est requis",
  }),
  accessToken: z.string().min(1, {
    message: "Le jeton d'accès est requis",
  }),
  refreshToken: z.string().min(1, {
    message: "Le jeton de rafraîchissement est requis",
  }),
});

export const SendResetPasswordSchema = z.object({
  email: z
    .string()
    .email({
      message: "L'e-mail doit être valide",
    })
    .min(1, {
      message: "L'e-mail est requis",
    }),
});

export const projetSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom du projet doit contenir au moins 3 caractères."),
  local: z
    .string()
    .min(3, "Le lieu du projet doit contenir au moins 3 caractères."),
  startDate: z.coerce.date({
    required_error: "La date de début est requise.",
    invalid_type_error: "La date de début doit être une date valide.",
  }),
  endDate: z.coerce.date({
    required_error: "La date de fin est requise.",
    invalid_type_error: "La date de fin doit être une date valide.",
  }),
});

export const UserSchema = z.object({
  profile: z
    .string({ required_error: "L'URL du profil est requise." })
    .url({ message: "Le profil doit être une URL valide." }),

  name: z
    .string({ required_error: "Le nom est requis." })
    .min(3, "Le nom doit contenir au moins 3 caractères."),

  email: z
    .string({ required_error: "L'email est requis." })
    .email({ message: "L'email n'est pas valide." }),

  phone: z
    .string({ required_error: "Le numéro de téléphone est requis." })
    .min(8, "Le numéro doit contenir au moins 8 caractères."),

  address: z
    .string({ required_error: "L'adresse est requise." })
    .min(3, "L'adresse doit contenir au moins 3 caractères."),

  gender: z
    .string({ required_error: "Le genre est requis." })
    .min(3, "Le genre doit contenir au moins 3 caractères."),

  dob: z.coerce.date({
    required_error: "La date de naissance est requise.",
    invalid_type_error: "La date de naissance doit être une date valide.",
  }),

  status: StatusEnum.default("disabled"),
  type: TypeEnum.default("employe"),
  cv: DocumentSchema.optional().nullable(),
});

export const MemberSchema = z.object({
  projectId: z.string({ required_error: "Le projet est requise." }),
  classeId: z.string({ required_error: "La classe est requise." }),
  profile: z
    .string({ required_error: "L'URL du profil est requise." })
    .url({ message: "Le profil doit être une URL valide." }),

  name: z
    .string({ required_error: "Le nom est requis." })
    .min(3, "Le nom doit contenir au moins 3 caractères."),

  phone: z
    .string({ required_error: "Le numéro de téléphone est requis." })
    .min(3, "Le numéro doit contenir au moins 3 caractères."),

  commune: z
    .string({ required_error: "La commune est requise." })
    .min(3, "La commune doit contenir au moins 3 caractères."),

  residential: z
    .string({ required_error: "Le quartie est requise." })
    .min(2, "Le quartie doit contenir au moins 3 caractères."),
  disability: z
    .string({
      required_error:
        "Le type handicap est requise si c'est non marque Pas de Handicap.",
    })
    .min(3, "Le type handicap doit contenir au moins 3 caractères."),

  language: z
    .string({ required_error: "La langue  est requis." })
    .min(3, "La langue  doit contenir au moins 3 caractères."),

  gender: z
    .string({ required_error: "Le genre est requis." })
    .min(3, "Le genre doit contenir au moins 3 caractères."),

  dob: z.coerce.date({
    required_error: "La date de naissance est requise.",
    invalid_type_error: "La date de naissance doit être une date valide.",
  }),

  attestation: z
    .string({ required_error: "L'attestation est requise." })
    .min(3, "L'attestation doit contenir au moins 3 caractères."),
});

export const AccompanimentSchema = z.object({
  name: z
    .string({
      required_error: "Le nom est obligatoire",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(2, "Le nom ne peut pas être vide"),
  adresse: z
    .string({
      required_error: "L'adresse est obligatoire",
      invalid_type_error: "L'adresse doit être une chaîne de caractères",
    })
    .min(5, "L'adresse doit contenir au moins 5 caractères"),
  phones: z
    .array(
      z.object({
        value: z
          .number({ required_error: "Le numéro est obligatoire" })
          .int("Le numéro doit être un entier")
          .min(7, "Le numéro doit contenir au moins 7 chiffres"),
      }),
      {
        required_error: "La liste des téléphones est obligatoire",
      }
    )
    .nonempty("Au moins un numéro est requis"),

  members: z
    .array(
      z.object({
        value: z.string({
          required_error: "Les  bénéficiaires est obligatoire",
        }),
      }),
      {
        required_error: "La liste des bénéficiaires est obligatoire",
      }
    )
    .nonempty("Au moins un bénéficiaire est requis"),
  budget: z
    .number({
      required_error: "Le budget est obligatoire",
      invalid_type_error: "Le budget doit être un nombre",
    })
    .int("Le budget doit être un entier"),
  usersid: z
    .string({
      required_error: "L'ID utilisateur est obligatoire",
      invalid_type_error: "L'ID utilisateur doit être une chaîne de caractères",
    })
    .uuid("L'ID utilisateur doit être un UUID valide"),
  projectId: z
    .string({
      required_error: "L'ID du project est obligatoire",
      invalid_type_error: "L'ID project doit être une chaîne de caractères",
    })
    .uuid("L'ID project doit être un UUID valide"),

  file: DocumentSchema,
});

export const MapsSchema = z.object({
  accompanimentId: z
    .string()
    .uuid("L'ID d'accompagnement doit être un UUID valide"),
  latitude: z.string().min(1, "La latitude est requise"),
  longitude: z.string().min(1, "La longitude est requise"),
});

export const PurchaseItemSchema = z.object({
  name: z
    .string({
      required_error: "Le nom de l'article est obligatoire.",
      invalid_type_error: "Le nom doit être une chaîne de caractères.",
    })
    .min(1, "Le nom de l'article ne peut pas être vide."),

  price: z
    .string({
      required_error: "Le prix est requis.",
      invalid_type_error:
        "Le prix doit être une chaîne de caractères (ex : '2500 DJF').",
    })
    .min(1, "Le prix ne peut pas être vide."),

  quantity: z.coerce.number({
    required_error: "La quantite est requis.",
    invalid_type_error: "Le quantite doit être un  nombre .",
  }),
  image: z
    .string({
      required_error: "L'URL de l'image est obligatoire.",
      invalid_type_error: "L'image doit être une URL valide.",
    })
    .url("Veuillez fournir une URL d’image valide."),
  facture: z
    .string({
      required_error: "La facture est obligatoire.",
      invalid_type_error: "La facture doit être une URL valide.",
    })
    .url("Veuillez fournir une URL d’image valide."),

  date: z.coerce.date({
    invalid_type_error: "La date doit être une date valide.",
  }),
  purchaseId: z
    .string()
    .uuid("L'identifiant de l'purchaseId doit être un UUID valide.")
    .optional(),
});

export const PurchaseSchema = z.object({
  purchaseItems: z
    .array(PurchaseItemSchema, {
      required_error: "La liste des articles est obligatoire.",
      invalid_type_error: "Les articles doivent être une liste valide.",
    })
    .min(1, "Au moins un article d'achat est requis."),

  accompanimentId: z
    .string()
    .uuid("L'identifiant de l'accompagnement doit être un UUID valide."),
});

export const VisitsSchema = z
  .object({
    date: z.coerce.date({
      required_error: "La date d est requise.",
      invalid_type_error: "La date d doit être une date valide.",
    }),
    location: z.string({
      required_error: "L'heure de début est obligatoire",
      invalid_type_error: "L'heure de début doit être une chaîne de caractères",
    }),
    objetif: z.string({
      required_error: "L'objectif est obligatoire",
      invalid_type_error: "L'objectif doit être une chaîne de caractères",
    }),

    startTime: z
      .string({
        required_error: "L'heure de début est obligatoire",
        invalid_type_error:
          "L'heure de début doit être une chaîne de caractères",
      })
      .min(1, {
        message: "L'heure de début ne peut pas être vide",
      })
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "L'heure de début doit être au format HH:MM (ex: 14:30)",
      }),

    endTime: z
      .string({
        required_error: "L'heure de fin est obligatoire",
        invalid_type_error: "L'heure de fin doit être une chaîne de caractères",
      })
      .min(1, {
        message: "L'heure de fin ne peut pas être vide",
      })
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "L'heure de fin doit être au format HH:MM (ex: 16:45)",
      }),

    planningId: z
      .string({
        required_error: "L'ID du planning est obligatoire",
        invalid_type_error:
          "L'ID du planning doit être une chaîne de caractères",
      })

      .optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return timeToMinutes(data.startTime) < timeToMinutes(data.endTime);
      }
      return true; // Allow empty or incomplete times to be validated by individual field rules
    },
    {
      message: "L'heure de début doit être antérieure à l'heure de fin.",
      path: ["endTime"], // Attach the error to the endTime field
    }
  );

export const PlanningSchema = z.object({
  usersId: z
    .string({
      required_error: "L'ID de l'utilisateur est obligatoire",
      invalid_type_error:
        "L'ID de l'utilisateur doit être une chaîne de caractères",
    })
    .uuid({
      message: "L'ID de l'utilisateur doit être un UUID valide",
    }),

  accompanimentId: z
    .string({
      invalid_type_error:
        "L'ID de l'accompagnement doit être une chaîne de caractères",
    })
    .uuid({
      message: "L'ID de l'accompagnement doit être un UUID valide",
    })
    .optional(),

  visit: z
    .array(VisitsSchema, {
      required_error: "La liste des visites est obligatoire.",
      invalid_type_error: "Les visites doivent être une liste valide.",
    })
    .min(1, "Au moins une visite est requis."),
});

export const StatusSchema = z.object({
  status: z.boolean({
    required_error: "Le statut est obligatoire.",
    invalid_type_error: "Le statut doit être un booléen.",
  }),
});

export const SignatureSchema = z.object({
  id: z
    .string()
    .uuid({
      message: "L'ID de rencontre doit être un UUID valide",
    })
    .optional()
    .nullable(),
  date: z.coerce.date({
    required_error: "La date est obligatoire",
    invalid_type_error: "La date doit être une date valide",
  }),
  present: z.boolean({
    required_error: "Veuillez indiquer si le bénéficiaire est present.",
    invalid_type_error: "Le present doit être un booléen.",
  }),

  memberId: z.string().uuid({
    message: "L'ID du membre doit être un UUID valide",
  }),

  rencontreId: z
    .string()
    .uuid({
      message: "L'ID de rencontre doit être un UUID valide",
    })
    .optional()
    .nullable(),
});

export const EmargementSchema = z.object({
  date: z.coerce.date({
    required_error: "La date est obligatoire",
    invalid_type_error: "La date doit être une date valide",
  }),
  signature: z.boolean({
    required_error: "Le statut de signature est obligatoire",
    invalid_type_error: "La signature doit être un booléen (true/false)",
  }),
  cni: z
    .string({
      required_error: "Le numéro de CNI est obligatoire",
    })
    .min(1, "Le numéro de CNI ne peut pas être vide")
    .max(50, "Le numéro de CNI est trop long"),

  PhotoCni: z
    .string({
      required_error: "La photo de la CNI est obligatoire",
    })
    .min(1, "Le chemin de la photo CNI ne peut pas être vide")
    .url("L'URL de la photo CNI doit être valide"),

  montant: z
    .number({
      required_error: "Le montant est obligatoire",
      invalid_type_error: "Le montant doit être un nombre",
    })
    .int("Le montant doit être un nombre entier")
    .positive("Le montant doit être positif"),

  observations: z
    .string()
    .max(500, "Les observations ne doivent pas dépasser 500 caractères"),
  usersId: z
    .string({
      required_error: "L'ID de l'utilisateur est obligatoire",
    })
    .uuid("L'ID utilisateur doit être un UUID valide"),

  memberId: z
    .string({
      required_error: "L'ID du membre est obligatoire",
    })
    .uuid("L'ID membre doit être un UUID valide"),
});

export const PersonnesSchema = z.object({
  name: z
    .string({
      required_error: "Le nom est obligatoire",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères"),

  role: z
    .string({
      required_error: "Le rôle est obligatoire",
    })
    .min(2, "Le rôle doit contenir au moins 2 caractères")
    .max(50, "Le rôle ne doit pas dépasser 50 caractères"),

  personnes: z.array(z.string().uuid()).optional(),
});

export const VisiteTerrainSchema = z.object({
  visitId: z.string().uuid({
    message: "L'ID de visite doit être un UUID valide",
  }),

  observations: z
    .string({
      required_error: "Les observations sont obligatoires",
    })
    .max(2000, "Les observations ne doivent pas dépasser 2000 caractères"),
  personnes: z
    .array(PersonnesSchema, {
      required_error: "La liste des personnes est obligatoire.",
      invalid_type_error: "Les personnes doivent être une liste valide.",
    })
    .min(1, "Au moins un article d'achat est requis."),

  files: z.array(DocumentSchema).optional(),
  usersId: z.string().uuid({
    message: "L'ID utilisateur doit être un UUID valide",
  }),
});

export const ConflitSchema = z.object({
  nature: z
    .string({
      required_error: "La nature du conflit est obligatoire",
      invalid_type_error: "La nature doit être une chaîne de caractères",
    })
    .min(2, "La nature du conflit doit contenir au moins 2 caractères")
    .max(255, "La nature du conflit ne doit pas dépasser 255 caractères"),

  accompanimentId: z.string().uuid({
    message: "L'ID d'accompagnement doit être un UUID valide",
  }),

  usersId: z.string().uuid({
    message: "L'ID d'accompagnateur doit être un UUID valide",
  }),
  partieImpliques: z
    .array(PersonnesSchema, {
      required_error: "La liste des personnes est obligatoire.",
      invalid_type_error: "Les personnes doivent être une liste valide.",
    })
    .min(1, "Au moins un article d'achat est requis."),
  files: z.array(DocumentSchema).optional(),

  resolution: z.string({
    required_error: "La résolution est obligatoire",
  }),
});

export const RencontreSchema = z.object({
  visitId: z.string({
    required_error: "Veuillez sélectionner un créneau de la rencontre",
    invalid_type_error: "le créneau doit être renseigné",
  }),

  order: z
    .array(
      z.object({
        value: z.string({
          required_error: "L'ordre du jour doit contenir au moins un élément",
        }),
      }),
      { required_error: "L'ordre du jour doit contenir au moins un élément" }
    )
    .nonempty("Au moins un élément dans l'ordre du jour est requis"),

  decisions: z
    .array(
      z.object({
        value: z.string({
          required_error: "Les décisions doivent contenir au moins un élément",
        }),
      }),
      { required_error: "Les décisions doivent contenir au moins un élément" }
    )
    .nonempty("Au moins une décision est requise"),

  actions: z
    .array(
      z.object({
        value: z.string({
          required_error: "Les actions doivent contenir au moins un élément",
        }),
      }),
      { required_error: "Les actions doivent contenir au moins un élément" }
    )
    .nonempty("Au moins une action est requise"),

  signatures: z.array(SignatureSchema, {
    required_error: "La liste des signatures est obligatoire",
  }),

  accompanimentId: z.string().uuid({
    message: "L'ID d'accompagnement doit être un UUID valide",
  }),

  usersId: z.string().uuid({
    message: "L'ID utilisateur doit être un UUID valide",
  }),

  files: z.array(DocumentSchema).optional(),
});

export const VisitsSchemaCreate = z.array(VisitsSchema);

export const FileSchema = z.object({
  id: z.string().uuid({
    message: "L'ID doit être un UUID valide",
  }),

  name: z
    .string({
      required_error: "Le nom du fichier est obligatoire",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(1, "Le nom du fichier ne peut pas être vide")
    .max(255, "Le nom du fichier ne doit pas dépasser 255 caractères")
    .regex(/^[^\\/?%*:|"<>]+$/, {
      message: "Le nom du fichier contient des caractères interdits",
    }),

  type: z
    .string({
      required_error: "Le type de fichier est obligatoire",
      invalid_type_error: "Le type doit être une chaîne de caractères",
    })
    .min(1, "Le type de fichier ne peut pas être vide")
    .max(100, "Le type de fichier ne doit pas dépasser 100 caractères"),

  url: z
    .string({
      required_error: "L'URL du fichier est obligatoire",
      invalid_type_error: "L'URL doit être une chaîne de caractères",
    })
    .min(1, "L'URL ne peut pas être vide")
    .url("L'URL doit être une URL valide")
    .max(500, "L'URL ne doit pas dépasser 500 caractères")
    .regex(/\.(pdf|docx?|xlsx?|pptx?|jpe?g|png|gif|txt)$/i, {
      message: "L'URL doit pointer vers un fichier avec une extension valide",
    }),
});

export const messageSchema = z.object({
  content: z
    .string({ required_error: "Le contenu du message est requis." })
    .min(1, "Le message ne peut pas être vide."),

  senderId: z
    .string({ required_error: "L'identifiant de l'expéditeur est requis." })
    .uuid("L'identifiant de l'expéditeur doit être un UUID valide."),

  chatId: z
    .string({ required_error: "L'identifiant du chat est requis." })
    .uuid("L'identifiant du chat doit être un UUID valide."),
});

export const UploadSchema = z.object({
  userId: z
    .string({
      required_error: "Le titre est requis.",
      invalid_type_error: "Le titre doit être une chaîne de caractères.",
    })
    .min(1, { message: "Le titre ne peut pas être vide." }),

  titre: z
    .string({
      required_error: "Le titre est requis.",
      invalid_type_error: "Le titre doit être une chaîne de caractères.",
    })
    .min(1, { message: "Le titre ne peut pas être vide." }),

  date: z.coerce.date({
    required_error: "La date  est requise.",
    invalid_type_error: "La date  doit être une date valide.",
  }),

  file: DocumentSchema.nullable(),
});

export const LeaveSchema = z.object({
  date: z.coerce.date({
    required_error: "La date est requise.",
    invalid_type_error: "La date doit être une date valide.",
  }),
  reason: z
    .string({
      required_error: "La raison est obligatoire",
      invalid_type_error: "La raison doit être un texte",
    })
    .min(5, {
      message: "La raison doit contenir au moins 5 caractères",
    })
    .max(1000, {
      message: "La raison ne peut pas dépasser 1000 caractères",
    }),
  projectId: z.string().uuid({
    message: "L'identifiant du projet doit être un UUID valide",
  }),
  memberId: z.string().uuid({
    message: "L'identifiant du membre doit être un UUID valide",
  }),
});

export const MediaSchema = z.object({
  id: z
    .string({
      required_error: "L'id  est obligatoire",
      invalid_type_error: "L'id  doit être un texte",
    })
    .min(5, {
      message: "L'id doit contenir au moins 5 caractères",
    }),
  files: z.array(DocumentSchema),
});

export const ClasseSchema = z.object({
  name: z
    .string({
      required_error: "Le nom  est obligatoire",
      invalid_type_error: "Le nom doit être un nom valide",
    })
    .min(5, {
      message: "Le nom doit contenir au moins 5 caractères",
    }),
  projectId: z
    .string({
      required_error: "Le projet  est obligatoire",
      invalid_type_error: "Le projet doit être un nom valide",
    })
    .min(5, {
      message: "Le projet doit contenir au moins 5 caractères",
    }),
  usersId: z
    .string({
      required_error: "le formateur ou formatrice  est obligatoire",
      invalid_type_error: "le formateur ou formatrice  doit être un nom valide",
    })
    .min(5, {
      message: "le formateur ou formatrice doit contenir au moins 5 caractères",
    }),
});
export const ClasseMembersSchema = z.object({
  members: z
    .array(
      z.object({
        id: z.string().uuid(),
        phone: z.string(),
      })
    )
    .min(1, { message: "Au moins un membre est requis" }),
});

export const EmployeAccesSchema = z.object({
  routes: z.array(z.string()).optional(),
  access: z.array(z.string()).optional(),
});

export const ValueSchema = z.object({
  value: z
    .string({ message: "valeur est obligatoire" })
    .min(1, { message: "valeur ne peut pas être vide" }),
});

export type ProjetSchemaType = z.input<typeof projetSchema>;
export type AuthSchemaInput = z.input<typeof AuthSchema>;
export type UserSchemaInput = z.input<typeof UserSchema>;
export type MemberSchemaInput = z.input<typeof MemberSchema>;
export type AccompanimentSchemaInput = z.input<typeof AccompanimentSchema>;
export type AccompanimentSchemaType = z.infer<typeof AccompanimentSchema>;
export type MapsSchemaInput = z.input<typeof MapsSchema>;
export type PurchaseSchemaInput = z.input<typeof PurchaseSchema>;
export type PurchaseItemSchemaInput = z.input<typeof PurchaseItemSchema>;
export type PlanningSchemaInput = z.input<typeof PlanningSchema>;
export type EmargementSchemaInput = z.input<typeof EmargementSchema>;
export type VisiteTerrainSchemaInput = z.input<typeof VisiteTerrainSchema>;
export type ConflitSchemaInput = z.input<typeof ConflitSchema>;
export type RencontreSchemaInput = z.input<typeof RencontreSchema>;
export type PersonnesSchemaInput = z.input<typeof PersonnesSchema>;
export type FileSchemaInput = z.input<typeof FileSchema>;
export type SignatureSchemaInput = z.input<typeof SignatureSchema>;
export type messageSchemaInput = z.input<typeof messageSchema>;
export type UploadSchemaInput = z.input<typeof UploadSchema>;
export type LeaveSchemaInput = z.input<typeof LeaveSchema>;
export type MediaSchemaInput = z.input<typeof MediaSchema>;
export type ClasseSchemaInput = z.input<typeof ClasseSchema>;
export type ClasseMembersSchemaInput = z.input<typeof ClasseMembersSchema>;

// Schema Zod pour la validation du changement de mot de passe
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),

    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
      .refine(
        (password) => !password.toLowerCase().includes("password"),
        "Le mot de passe ne doit pas contenir le mot 'password'"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Le nouveau mot de passe doit être différent de l'actuel",
    path: ["newPassword"],
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const ProfileUserSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z
    .string({ required_error: "Le numéro de téléphone est requis." })
    .min(8, "Le numéro doit contenir au moins 8 caractères."),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  dob: z.coerce.date({
    required_error: "La date de naissance est requise.",
    invalid_type_error: "La date de naissance doit être une date valide.",
  }),
});

export type UserDataInput = z.input<typeof ProfileUserSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
