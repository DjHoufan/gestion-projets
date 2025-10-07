"use client";

import {  useState } from "react";
import { ACSidebar } from "@/core/view/accompagnateur/layout/AC-sidebar";
import { MainContent } from "@/core/view/accompagnateur/layout/AC-container";
import { RolePermission } from "@/core/lib/types";
import { useGetOnTeam } from "@/core/hooks/use-teams";
import { Spinner } from "@/core/components/ui/spinner";

type Props = {
  Id: string;

  permission: RolePermission;
};

export const Dashboard = ({ Id, permission }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const { data: userData } = useGetOnTeam(Id);

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-40">
        <ACSidebar toggleSidebarAction={toggleSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={toggleSidebar}
          />
          <div className="absolute left-0 top-0 h-full">
            <ACSidebar toggleSidebarAction={toggleSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-[300px]">
        {userData ? (
          <MainContent
            user={userData!}
            toggleSidebarAction={toggleSidebar}
            currentUser={{
              name: userData.name,
              email: userData.email,
              profile: userData.profile,
            }}
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
