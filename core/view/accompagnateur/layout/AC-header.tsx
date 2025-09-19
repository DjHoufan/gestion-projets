import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { useCustomeTabs, useMyData } from "@/core/hooks/store";
import { formatTimeMessage } from "@/core/lib/utils";
import { User } from "@supabase/supabase-js";
import {
  Bell,
  Loader2,
  LogOut,
  Menu,
  MoreHorizontal,
  Settings,
  UserCircle,
  UserCog,
  UserSquare,
} from "lucide-react";
import { useMemo, useState } from "react";

export const DashboardHeader = ({
  toggleSidebarAction,
  notifications,
  currentUser,
  onMarkAsRead,
  onLogout,
  isPendingLogout,
}: {
  toggleSidebarAction: () => void;
  notifications: any[] | undefined;
  currentUser: {
    name: string;
    email: string;
    profile: string;
  };
  onMarkAsRead: (id: string) => void;
  onLogout: () => void;
  isPendingLogout: boolean;
}) => {
  const { set: SetUrl } = useCustomeTabs();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { data } = useMyData();

  console.log({ data });

  const userName = data?.name!;
  const userEmail = data?.email!;
  const profile = data?.profile!;

  const notificationCount = notifications?.length ?? 0;

  const userInitials = useMemo(
    () =>
      userName
        .split(" ")
        .map((n: string) => n[0])
        .join(""),
    [userName]
  );

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebarAction}
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex justify-end w-full gap-5">
          {/* Notifications Dropdown */}
          <DropdownMenu
            open={isNotificationOpen}
            onOpenChange={setIsNotificationOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 relative"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-7 w-7 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
                    {notificationCount}
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

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications?.map((notification, index) => (
                  <NotificationItem
                    key={index}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                  />
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

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0"
              >
                <Avatar className="h-9 w-9 border border-slate-200">
                  <AvatarImage src={profile} alt={userName} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-800">
                    {userName}
                  </p>
                  <p className="text-xs leading-none text-slate-500">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  SetUrl("profile");
                }}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 hover:text-red-600">
                <Button
                  className="w-full cursor-pointer"
                  variant="ghost"
                  onClick={onLogout}
                  disabled={isPendingLogout}
                >
                  {isPendingLogout ? (
                    <div className="w-full flex justify-center items-center">
                      <Loader2 className="animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
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

// Composant Notification Item
const NotificationItem = ({
  notification,
  onMarkAsRead,
}: {
  notification: any;
  onMarkAsRead: (id: string) => void;
}) => (
  <div
    className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors relative ${
      !notification.view ? "bg-blue-50" : ""
    }`}
    onClick={() => onMarkAsRead(notification.id)}
  >
    <div className="flex items-start gap-3">
      <UserTypeAvatar sender={notification.message.sender} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-blue-800">
          {notification.message.sender.name}
        </p>
        <div className="text-sm text-gray-900 leading-5">
          <span className="font-semibold">
            {notification.message.content.slice(0, 30)}
            {notification.message.content.length > 30 && "..."}
          </span>
        </div>
        <div className="text-xs text-blue-600 mt-1 font-medium">
          {formatTimeMessage(notification.message.sentAt)}
        </div>
      </div>
      {!notification.view && (
        <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
      )}
    </div>
  </div>
);

// Composant Avatar avec indicateur de type
const UserTypeAvatar = ({ sender }: { sender: any }) => (
  <div className="relative">
    <Avatar className="h-12 w-12">
      <AvatarImage src={sender.profile} alt={sender.name} />
      <AvatarFallback className="bg-gray-200 text-gray-700 font-medium">
        {sender.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
    <div
      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
        sender.type === "admin" ? "bg-blue-500" : "bg-green-500"
      }`}
    >
      <div className="w-4 h-4 rounded-full flex items-center justify-center text-white">
        {sender.type === "admin" ? <UserCog /> : <UserSquare />}
      </div>
    </div>
  </div>
);
