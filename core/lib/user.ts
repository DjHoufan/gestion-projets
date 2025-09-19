import { MapDetail } from "@/core/lib/types";
import {
  Users,
  Conflit,
  Personnes,
  Files,
  Emargement,
  Member,
  Planning,
  Visits,
  Accompaniment,
  Maps,
  Purchase,
  PurchaseItems,
  Rencontre,
  Signature,
  Project,
  VisiteTerrain,
} from "@prisma/client";

export type UpdatedData = Users & {
  cv: Files | null;
  conflit: (Conflit & {
    partieImpliques: Personnes[];
    files: Files[];
  })[];

  emargements: (Emargement & {
    member: Member;
  })[];

  plannings: (Planning & {
    accompaniments: (Accompaniment & {
      members: Member[];
    })[];
    visit: Visits[];
  })[];

  rencontres: (Rencontre & {
    signatures: (Signature & {
      member: Member;
    })[];
  })[];

  accompaniments: (Accompaniment & {
    map: MapDetail | null;
    members: Member[];
    purchases: (Purchase & {
      purchaseItems: PurchaseItems[];
    })[];
    conflits: Conflit[];
    rencontre: (Rencontre & {
      signatures: (Signature & {
        member: Member;
      })[];
    })[];
    project: Project | null;
    planning:
      | (Planning & {
          accompaniments: (Accompaniment & {
            members: Member[];
          })[];
          visit: Visits[];
        })
      | null;
  })[];

  visiteTerrains?: (VisiteTerrain & {
    personnes: Personnes[];
    files: Files[];
  })[];
};
