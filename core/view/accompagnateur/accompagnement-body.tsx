"use client";

import { JSX, useMemo, useState } from "react";
import { CustomSidebar } from "@/core/view/accompagnateur/custom-sidebar";
import { DashboardContent } from "@/core/view/accompagnateur/dashboard-content";
import { IdType, RolePermission } from "@/core/lib/types";
import { useGetOnTeam } from "@/core/hooks/use-teams";
import { Spinner } from "@/core/components/ui/spinner";
import { User } from "@supabase/supabase-js";

type Props = {
  Id: string;
  currentUser: User;
  permission: RolePermission;
};

export const Dashboard = ({ Id, currentUser, permission }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const { data: userData } = useGetOnTeam(Id);

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-40">
        <CustomSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={toggleSidebar}
          />
          <div className="absolute left-0 top-0 h-full">
            <CustomSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 ml-[300px]">
        {userData ? (
          <DashboardContent
            user={userData!}
            toggleSidebarAction={toggleSidebar}
            currentUser={currentUser}
            permission={permission}
            
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner variant="bars" size={80} className="text-primary" />
          </div>
        )}
      </main>
    </div>
  );
};
