import { UpdatedData } from "@/core/lib/user";
import {
  Accompaniment,
  ChatParticipant,
  Chat as ChatPrisma,
  Classe,
  Conflit,
  Emargement,
  Files,
  Leave,
  Maps,
  Member,
  Message,
  MessageView,
  Personnes,
  Planning,
  Project,
  Purchase,
  PurchaseItems,
  Rencontre,
  Signature,
  Upload,
  Users,
  VisiteTerrain,
  Visits,
} from "@prisma/client";

export type PermissionProps = {
  permission: RolePermission;
};

export type IdType = { Id: string };

export type IdProps = {
  params: Promise<{ Id: string }>;
};

export type FormProps<T> = {
  details?: T;
};

export type SupabaseUser = {
  email: string;
  password: string;
  userMetadata: {
    name: string;
    profile: string;
    type: "admin" | "employe" | "accompanist";
    access: string[];
  };
};

export type Permissions = {
  canAdd: boolean;
  canModify: boolean;
  canDelete: boolean;
  canReset: boolean;
  canDetails: boolean;
  canView: boolean;
};

export type CrudPermissions = {
  canAdd: boolean;
  canModify: boolean;
  canDelete: boolean;
};

export type RolePermission = {
  id: string;
  type: string;
  access: string[];
  routes: string[];
};

export type ProjectDetail = Project & {
  accompaniments: Accompaniment[];
};

export type Accompaniments = Accompaniment & {
  users: Omit<UserDetail, "cv">;
  members: Member[];
};

export type OneAccompaniment = Accompaniment & {
  users: Omit<UserDetail, "cv">;
};

export type AccompanimentDetail = Accompaniments & {
  maps: Maps[];
  purchases: PurchaseDetail | null;
  plannings: Plannings | null;
};

export type UserDetail = Users & {
  cv: Files | null;
};

export type MemberDetail = Member & {
  leave: Leave | null;
  project: {
    id: string;
    name: string;
    status: boolean;
  };
};

export type ClasseDetail = Classe & {
  project: Project;
  user: Users;
};

export type MemberDetailWP = Omit<MemberDetail, "project">;

export type oneUser = Users & {
  conflit: Conflit &
    {
      files: Files[];
      partieImpliques: Personnes[];
    }[];
  emargements: Emargement &
    {
      member: Member;
    }[];
  plannings: Planning &
    {
      accompaniments: Accompaniment & {
        members: Member[];
      };
      visit: Visits[];
    }[];
  rencontres: Rencontre &
    {
      signatures: Signature & {
        member: Member;
      };
    }[];
  accompaniments: Accompaniment &
    {
      name: string;
      project: Project;
      maps: true;
      members: Member[];
      purchases: Purchase &
        {
          purchaseItems: PurchaseItems[];
        }[];
      conflits: Conflit[];
      rencontres: Rencontre &
        {
          signatures: Signature & {
            member: Member;
          };
        }[];
      plannings: Planning & {
        accompaniments: Accompaniment & {
          members: Member[];
        };
        visit: Visits[];
      };
    }[];
};

export type ViewProps = {
  user: UpdatedData;
};

export type DashboardContentProps = {
 
  user: UpdatedData;
};

export type PurchaseDetail = Purchase & {
  purchaseItems: PurchaseItems[];
};

export type Plannings = Planning & {
  visit: Visits[];
  users: Users;
};

export type EmargementDetail = Emargement & {
  users: Omit<UserDetail, "cv">;
  member: Member;
};

export type VisiteTerrainDetail = VisiteTerrain & {
  personnes: Personnes[];
  files: Files[];
  users: Omit<UserDetail, "cv">;
  visit: Visits & {
    Planning: Planning & {
      accompaniments: (Accompaniment & {
        members: Member[];
      })[];
    };
  };
};

export type ConflitDetail = Conflit & {
  accompaniment: Accompaniment;
  partieImpliques: Personnes[];
  files: Files[];
  users: Omit<UserDetail, "cv">;
};

export type signatureDetail = Signature & {
  member: Member;
};

export type RencontreDetail = Rencontre & {
  accompaniment: Accompaniment;
  signatures: signatureDetail[];
  files: Files[];
  users: Omit<UserDetail, "cv">;
};

export type FileItem = {
  id?: string;
  name: string;
  type: string;
  url: string;
  file: File;
};

export type Statistics = {
  totalMembers: number;
  totalPurchases: number;
  totalSpent: number;
  totalVisits: number;
  completedVisits: number;
  budgetUsagePercentage: number;
};

export type RecentPurchase = Purchase & {
  purchaseItems: PurchaseItems[];
  accompanimentName: string;
};

export type accEm = Accompaniment & {
  users: Users;
  members: Member[];
};

export type MapDetail = Maps & {
  accompaniment: accEm;
};

export type MessageDetail = Message & {
  sender: UserDetail;
};

export type ParticipantDetail = ChatParticipant & {
  user: Omit<UserDetail, "cv">;
};
export type ChatDetail = ChatPrisma & {
  project: Project;
  participants: ParticipantDetail[];
};

export interface ChatHeaderProps {
  chats: ChatDetail[];
  selectedChat: ChatDetail | undefined;
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  messageSearchTerm: string;
  onSearchChange: (term: string) => void;
  onRemoveParticipant: (participant: ParticipantDetail) => void;
}

export type UploadDetail = Upload & {
  user: Omit<UserDetail, "cv">;
  file: Files;
};

export type MessageViewDetail = MessageView & {
  message: Message;
  sender: UserDetail;
};

export type Notifications = {
  message_view_id: string;
  message_viewed: string;
  message: Message;
  sender: UserDetail;
};

export type notifType = {
  id: string;
  view: boolean;
  messageId: string;
  senderId: string;
  message: Message;
  sender: UserDetail;
};

type userWithoutFile = Omit<UserDetail, "filesId" | "cv" | "routes" | "access">;

type MyMessage = {
  content: string;
  read: boolean;
  chatId: string;
  sentAt: Date;
  sender: userWithoutFile;
};

export type Notification = {
  id: string;
  view: boolean;
  messageId: string;
  senderId: string;
  message: MyMessage;
  sender: userWithoutFile;
};

export type leaveDetail = Leave & {
  member: Member;
  project: Project;
};

export interface DashboardStats {
  activeProjects: {
    count: number;
    monthlyIncrease: number;
    completionRate: number;
  };
  beneficiaries: {
    total: number;
    newThisMonth: number;
    growthRate: number;
  };
  accompaniments: {
    completionRate: number;
    weeklyIncrease: number;
    activeCount: number;
  };
  visits: {
    completionRate: number;
    improvement: number;
    totalPlanned: number;
  };
}
