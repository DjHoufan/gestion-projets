"use client";
import { Header } from "@/core/components/layout/header";
import { Sidebar } from "@/core/components/layout/sidebar";
import { User } from "@supabase/supabase-js";
import { useState, memo } from "react";

type Props = {
  children: React.ReactNode;
  user: User | null;
  userId: string;
};

// ✅ MainLayout optimisé avec React.memo (nom original conservé)
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

// ✅ Export du composant mémorisé avec nom original
export default memo(MainLayout, (prevProps, nextProps) => {
  // ✅ Comparaison personnalisée pour éviter les re-renders
  return (
    prevProps.user === nextProps.user &&
    prevProps.userId === nextProps.userId &&
    prevProps.children === nextProps.children
  );
});
