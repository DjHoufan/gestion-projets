"use client";
import { Header } from "@/core/components/layout/header";
import { Sidebar } from "@/core/components/layout/sidebar";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  user: User | null;
  userId: string;
};

const MainLayout = ({ children, user, userId }: Props) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar
        user={user!}
        isMobile={isMobile}
        setIsMobileAction={setIsMobile}
      />
      <div className="flex-1 lg:ml-72 ml-0 flex flex-col min-w-0">
        <Header
          user={user!}
          userId={userId}
          isMobile={isMobile}
          setIsMobileAction={setIsMobile}
        />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
