"use client";

import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  Bell,
  Calendar,
  Loader2,
  LogOut,
  MapPlus,
  Menu,
  MoreHorizontal,
  Settings,
  UserCircle,
  UserCog,
  UserSquare,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { RealtimeChannel, User } from "@supabase/supabase-js";
import { useLogout } from "@/core/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  useGetMyMessageViewAll,
  useUpdateAllMyMessageView,
  useUpdateMessageView,
} from "@/core/hooks/use-chat";
import { supabaseClientBrowser } from "@/core/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageViewDetail, notifType } from "@/core/lib/types";
import { MessageView } from "@prisma/client";
import { formatTimeMessage } from "@/core/lib/utils";
import { useChat } from "@/core/hooks/store";

type Props = {
  isMobile: boolean;
  setIsMobileAction: (v: boolean) => void;
  user: User;
  userId: string;
};

export const Header = ({
  isMobile,
  setIsMobileAction,
  user,
  userId,
}: Props) => {
  const { id } = useChat();
  const { access = [], type } = useMemo(() => {
    return user?.user_metadata || {};
  }, [user]);

  const myRoutes = useMemo(() => {
    return access.map((item: string) => item.split("|")[0].trim());
  }, [access]);

  const queryClient = useQueryClient();

  const router = useRouter();
  const { mutate: Logout, isPending } = useLogout();

  const userName: string = user.user_metadata.name;
  const userEmail = user.email;
  const profile = user.user_metadata.profile;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: notifications } = useGetMyMessageViewAll(userId);

  const { mutate: updatView } = useUpdateMessageView(userId);
  const { mutate: updateAllMyView } = useUpdateAllMyMessageView(userId);

  const markAsRead = (notificationId: string) => {
    updatView({
      param: {
        mvId: notificationId,
      },
    });
  };

  const markAllAsRead = useCallback(() => {
    updateAllMyView();
  }, [updateAllMyView]);

  const handleNewNotification = (newNotif: notifType, userId: string) => {
    queryClient.setQueryData([userId], (oldData: MessageViewDetail[]) => {
      if (!oldData) return oldData;

      return [newNotif, ...oldData];
    });
  };

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setupSubscription = async () => {
      try {
        channel = supabaseClientBrowser
          .channel("vueChannel")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "MessageView",
            },
            async (payload) => {

              const type = payload.eventType as string;
              const newMessage = payload.new as MessageView;

              if (type === "INSERT") {
                if (user.id !== newMessage.userId) {
                  const { data } = await supabaseClientBrowser.rpc(
                    "get_unread_messages",
                    {
                      message_view_id_input: newMessage.id,
                      user_id_input: userId,
                    }
                  );

                  if (data?.[0]) {
                    const { message_view_id, message, sender, chat } = data[0];

                    if (chat.id !== id) {
                      const newNotif = {
                        id: message_view_id,
                        view: false,
                        messageId: message.id,
                        senderId: sender.id,
                        message: {
                          ...message,
                          sentAt: new Date(),
                          sender,
                        },
                        sender,
                      };

                      handleNewNotification(newNotif, userId);
                    }
                  }
                }
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error("Erreur setupSubscription:", error);
      }
    };

    setupSubscription();

    // cleanup pour éviter les doublons
    return () => {
      if (channel) {
        supabaseClientBrowser.removeChannel(channel);
        channel = null;
      }
    };
  }, [id, user.id, userId, handleNewNotification]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        {/* Bouton menu mobile */}
        <Button
          onClick={() => setIsMobileAction(!isMobile)}
          className="z-50 mr-5 lg:hidden bg-slate-800 text-white p-2 rounded-lg shadow-lg hover:bg-slate-700 flex-shrink-0"
          aria-label={isMobile ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMobile ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </Button>

        {/* Section titre - responsive */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 lg:flex-initial">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">
              <span className="hidden sm:inline">Bonjour, </span>
              {userName}
              <span className="sm:hidden">👋 </span>
              <span className="hidden sm:inline"> 👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate">
              Voici un aperçu de votre plateforme aujourd'hui
            </p>
          </div>
        </div>

        {/* Actions - responsive */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
          {/* Bouton Planning - masqué sur très petits écrans */}

          {(myRoutes.includes("planning") || type === "admin") && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1 sm:gap-2 bg-transparent    p-2 sm:px-3"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Planning</span>
            </Button>
          )}

          {(myRoutes.includes("maps") || type === "admin") && (
            <Button
              onClick={() => router.push("/maps")}
              size="sm"
              className="gap-1 sm:gap-2 bg-teal-500 hover:bg-teal-600 p-2 sm:px-3"
            >
              <MapPlus className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Maps</span>
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 relative"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {(notifications?.length ?? 0) > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-6 w-6  rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
                    {notifications?.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-96 p-0 shadow-2xl border-0 rounded-lg overflow-hidden"
              sideOffset={8}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Notifications
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 rounded-full p-0 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Marquer tout comme lu
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 rounded-full p-0 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Notifications List with Custom Scrollbar */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {(notifications || []).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors relative ${
                      !notification.view ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={notification.message.sender.profile}
                            alt={notification.message.sender.name}
                          />
                          <AvatarFallback className="bg-gray-200 text-gray-700 font-medium">
                            {notification.message.sender.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        {/* Type indicator */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2  flex items-center justify-center text-xs ${
                            notification.message.sender.type === "admin"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        >
                          {notification.message.sender.type === "admin" ? (
                            <div className="w-4 h-4  rounded-full flex items-center justify-center text-white">
                              <UserCog />
                            </div>
                          ) : (
                            <div className="w-4 h-4 text-white rounded-full flex items-center justify-center ">
                              <UserSquare />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-blue-800">
                          {notification.message.sender.name}
                        </p>
                        <div className="text-sm text-gray-900 leading-5">
                          <span className="font-semibold">
                            {notification.message.content.slice(0, 30)}{" "}
                            {notification.message.content.length > 30 && "..."}
                          </span>{" "}
                        </div>
                        <div className="text-xs text-blue-600 mt-1 font-medium">
                          {formatTimeMessage(notification.message.sentAt)}
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.view && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:bg-blue-50 font-medium"
                >
                  Voir toutes les notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0"
              >
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-slate-200">
                  <AvatarImage src={profile} alt={userName} />
                  <AvatarFallback className="bg-blue-500 text-white text-xs sm:text-sm">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 sm:w-64 mr-2 sm:mr-0"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-800 truncate">
                    {userName}
                  </p>
                  <p className="text-xs leading-none text-slate-500 truncate">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer"
              >
                <UserCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/admin")}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Admin</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 hover:text-red-600 p-0">
                <Button
                  className="w-full cursor-pointer justify-start h-auto p-2"
                  variant="ghost"
                  onClick={Logout}
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="w-full flex justify-center items-center">
                      <Loader2 className="animate-spin text-primary h-4 w-4" />
                    </div>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-red-500">Déconnexion</span>
                    </>
                  )}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
