"use client";

// Views imports
import { OverviewView } from "@/core/view/accompagnateur/section/overview-view";
import { AccompanimentsView } from "@/core/view/accompagnateur/section/accompaniments-view";
import { MembersView } from "@/core/view/accompagnateur/section/members-view";
import { PlanningView } from "@/core/view/accompagnateur/section/planning-view";
import { PurchasesView } from "@/core/view/accompagnateur/section/purchases-view";
import { ConflictsView } from "@/core/view/accompagnateur/section/conflicts-view";
import { EmargementsView } from "@/core/view/accompagnateur/section/emargements-view";
import { RencontreView } from "@/core/view/accompagnateur/section/rencontre-view";
import { Messages } from "@/core/view/accompagnateur/section/message";
import { AccompanimentDetails } from "@/core/view/accompaniment/Accompaniment-details";

// Types and hooks
import type {
  MainContentProps,
  MessageViewDetail,
  Notification,
  RolePermission,
} from "@/core/lib/types";
import { useEffect, useCallback, useMemo, type JSX, useRef } from "react";
import { RealtimeChannel, User } from "@supabase/supabase-js";
import { useLogout } from "@/core/hooks/use-auth";
import { useCustomeTabs, useSelectAC } from "@/core/hooks/store";
import {
  useGetMyMessageView,
  useUpdateMessageView,
} from "@/core/hooks/use-chat";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseClientBrowser } from "@/core/supabase/client";
import { Message } from "@prisma/client";
import { QueryKeyString } from "@/core/lib/constants";
import { toast } from "@/core/components/global/custom-toast";
import { DashboardHeader } from "@/core/view/accompagnateur/layout/AC-header";
import ProfileView from "@/core/view/accompagnateur/section/profile-view";

interface MainContentWithToggleProps extends MainContentProps {
  toggleSidebarAction: () => void;
  currentUser: {
    name: string;
    email: string;
    profile: string;
  };
  permission: RolePermission;
}

// Hook personnalisé pour la gestion des notifications en temps réel
const useRealtimeNotifications = (userId: string) => {
  const queryClient = useQueryClient();
  const lastMessageIdRef = useRef<string | null>(null);
  const handleNewNotification = useCallback(
    (newNotif: Notification, userId: string) => {
      queryClient.setQueryData(
        [QueryKeyString.notification + userId],
        (oldData: MessageViewDetail[]) => {
          if (!oldData) return oldData;
          return [newNotif, ...oldData];
        }
      );
    },
    [queryClient]
  );

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      try {
        channel = supabaseClientBrowser
          .channel("vueChannel")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "Message",
            },
            async (payload) => {
              const newMessage = payload.new as Message;

              if (userId !== newMessage.senderId) {
                const { data } = await supabaseClientBrowser.rpc(
                  "get_message_with_sender",
                  {
                    msg_id: newMessage.id,
                  }
                );

                if (data?.[0]) {
                  const {
                    id,
                    content,
                    sentAt,
                    read,
                    senderId,
                    chatId,
                    authId,
                    profile,
                    name,
                    email,
                    phone,
                    address,
                    gender,
                    dob,
                    status,
                    type,
                    createdAt,
                    updatedAt,
                  } = data[0];

                  const sender = {
                    id: senderId,
                    authId,
                    profile,
                    name,
                    email,
                    phone,
                    address,
                    gender,
                    dob,
                    status,
                    type,
                    createdAt,
                    updatedAt,
                    supervisorId: null
                  };

                  const newNotif: Notification = {
                    id,
                    view: false,
                    messageId: id,
                    senderId,
                    message: {
                      content,
                      read,
                      chatId,
                      sentAt: sentAt ? new Date(sentAt) : new Date(),
                      sender,
                    },
                    sender,
                  };

                  handleNewNotification(newNotif, userId);
                }
              }
            }
          )
          .subscribe();
      } catch (error) {
        toast.error({ message: "Setup error:" + error });
      }
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabaseClientBrowser.removeChannel(channel);
      }
    };
  }, []);
};

export function MainContent({
  user,
  toggleSidebarAction,
  currentUser,
  permission,
}: MainContentWithToggleProps): JSX.Element {
  const { mutate: Logout, isPending } = useLogout();
  const { value } = useSelectAC();
  const { value: url } = useCustomeTabs();

  const { data: notifications } = useGetMyMessageView(user.id);
  const { mutate: updateView } = useUpdateMessageView(user.id);



  // Hook pour les notifications en temps réel
  useRealtimeNotifications(user.id);

  const markAsRead = useCallback(
    (notificationId: string) => {
      updateView({
        param: {
          mvId: notificationId,
        },
      });
    },
    [updateView]
  );

  const handleLogout = useCallback(() => {
    Logout({});
  }, [Logout]);

  // Mémoisation du rendu des vues
  const renderView = useMemo((): JSX.Element => {
    const viewMap: Record<string, JSX.Element> = {
      overview: <OverviewView />,
      accompaniments: <AccompanimentsView />,
      members: <MembersView />,
      planning: <PlanningView />,
      purchases: <PurchasesView />,
      conflicts: <ConflictsView />,
      emargements: <EmargementsView />,
      rencontre: <RencontreView />,
      detailAccompaniments: (
        <AccompanimentDetails permission={permission} Id={value} />
      ),
      message: <Messages user={user} />,
      profile: <ProfileView />,
    };

    return viewMap[url] || <OverviewView />;
  }, [url, user, value]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <DashboardHeader
        toggleSidebarAction={toggleSidebarAction}
        notifications={notifications}
        currentUser={currentUser}
        onMarkAsRead={markAsRead}
        onLogout={handleLogout}
        isPendingLogout={isPending}
      />
      <div className="flex-1">{renderView}</div>
    </div>
  );
}
