"use client";

import type React from "react";
import {
  Calendar,
  Home,
  MessageSquare,
  Users,
  BookOpen,
  FileText,
  Activity,
  FolderKanban,
  Shapes,
  Waypoints,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/core/lib/utils";
import { User } from "@supabase/supabase-js";

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
 
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: "Vue d'ensemble",
    url: "/",
    icon: Home,
    description: "Tableau de bord principal",
  },
  {
    title: "Projets & Formations",
    url: "/projects",
    icon: BookOpen,
    description: "Gestion des formations",
  },
  {
    title: "Classes",
    url: "/classes",
    icon: Shapes,
  },
  {
    title: "Bénéficiaires",
    url: "/beneficiaires",
    icon: Users,
  },
  {
    title: "Accompagnements",
    url: "/accompagnements",
    icon: FolderKanban,
  },
  {
    title: "Équipes",
    url: "/equipes",
    icon: Activity,
    description: "Gestion de l'équipe",
  },
];

const TOOLS_ITEMS: NavigationItem[] = [
  {
    title: "Calendrier",
    url: "/planning",
    icon: Calendar,
    description: "Planning des sessions",
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
 
    description: "Communications",
  },
  {
    title: "Rapports",
    url: "/rapports",
    icon: FileText,
    description: "Analytics détaillées",
  },
  {
    title: "Acces",
    url: "/acces",
    icon: Waypoints,
    description: "les acces des utilisateurs",
  },
    {
    title: "Guide",
    url: "/guide",
    icon: Folders,
    description: "Guide d'utilisation",
  },
];

const SECTION_HEADER_CLASSES = "flex items-center gap-2 px-3 mb-4";
const DIVIDER_CLASSES =
  "h-1 w-6 bg-gradient-to-r from-teal-400 to-teal-400 rounded-full";
const SECTION_TITLE_CLASSES =
  "text-slate-300 text-xs font-semibold uppercase tracking-wider";

const NavigationItem = ({
  item,
  pathname,
  hoveredItem,
  onMouseEnter,
  onMouseLeave,
}: {
  item: NavigationItem;
  pathname: string;
  hoveredItem: string | null;
  onMouseEnter: (title: string) => void;
  onMouseLeave: () => void;
}) => {
  const isActive =
    item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
  const isHovered = hoveredItem === item.title;

  return (
    <Link
      href={item.url}
      onMouseEnter={() => onMouseEnter(item.title)}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md",
        isActive
          ? "bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-300 border border-teal-500/30 shadow-lg"
          : "text-slate-300 hover:bg-gradient-to-r hover:from-slate-800/80 hover:to-slate-700/80 hover:text-white hover:shadow-lg"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-md",
          isActive || isHovered
            ? "bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg"
            : "bg-slate-700/50 hover:bg-slate-600/70 hover:shadow"
        )}
      >
        <item.icon
          className={cn(
            "h-4 w-4",
            isActive || isHovered ? "text-white" : "text-slate-300"
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.title}</div>
        {item.description && (
          <div className="text-slate-400 text-xs truncate">
            {item.description}
          </div>
        )}
      </div>
     
    </Link>
  );
};

const NavigationSection = ({
  title,
  items,
  pathname,
  hoveredItem,
  onMouseEnter,
  onMouseLeave,
}: {
  title: string;
  items: NavigationItem[];
  pathname: string;
  hoveredItem: string | null;
  onMouseEnter: (title: string) => void;
  onMouseLeave: () => void;
}) => (
  <div className="space-y-2">
    <div className={SECTION_HEADER_CLASSES}>
      {title.length > 0 && (
        <>
          <div className={DIVIDER_CLASSES} />
          <h3 className={SECTION_TITLE_CLASSES}>{title}</h3>
        </>
      )}
    </div>
    <div className="space-y-1">
      {items.map((item) => (
        <NavigationItem
          key={item.url}
          item={item}
          pathname={pathname}
          hoveredItem={hoveredItem}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ))}
    </div>
  </div>
);

type Props = {
  isMobile: boolean;
  user: User;
  setIsMobileAction: (v: boolean) => void;
};

export const Sidebar = ({ user, isMobile, setIsMobileAction }: Props) => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { access = [], type } = useMemo(() => {
    return user?.user_metadata || {};
  }, [user]);

  // routes autorisées par access
  const myRoutes = useMemo(() => {
    return access.map((item: string) => item.split("|")[0].trim());
  }, [access]);

  // filtrer les menus en fonction des droits
  const filteredNavigation = useMemo(() => {
    if (type === "admin") return NAVIGATION_ITEMS;

    const baseRoute = NAVIGATION_ITEMS.find((r) => r.url === "/");
    const filtered = NAVIGATION_ITEMS.filter((route) => {
      const key = route.url.split("/")[1];
      return myRoutes.includes(key);
    });

    if (baseRoute && !filtered.includes(baseRoute)) {
      filtered.unshift(baseRoute);
    }
    return filtered;
  }, [type, myRoutes]);

  const filteredTools = useMemo(() => {
    if (type === "admin") return TOOLS_ITEMS;

    return TOOLS_ITEMS.filter((route) => {
      const key = route.url.split("/")[1];
      return myRoutes.includes(key);
    });
  }, [type, myRoutes]);

  const handleItemHover = useCallback((title: string) => {
    setHoveredItem(title);
  }, []);

  const handleItemLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  const sidebarClasses = useMemo(
    () =>
      cn(
        "fixed left-0 top-0 z-40 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      ),
    [isMobile]
  );

  return (
    <>
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileAction(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsMobileAction(false);
          }}
          aria-label="Fermer le menu"
        />
      )}

      <aside className={sidebarClasses} role="navigation">
        <header className="relative border-b border-slate-700/50 bg-gradient-to-r from-teal-600/20 to-teal-600/20 backdrop-blur-sm flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-teal-500/10" />
          <div className="relative p-6 flex items-center justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-teal-500/20 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative p-3 bg-white rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-lg">
                <Image
                  src="/images/houfan-new-logo.png"
                  alt="HOUFAN Research & Transform"
                  width={200}
                  height={42}
                  priority
                  className="h-auto w-auto"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scroll-smooth houfan-scrollbar scroll-indicator">
            {filteredNavigation.length > 0 && (
              <NavigationSection
                title="Navigation"
                items={filteredNavigation}
                pathname={pathname}
                hoveredItem={hoveredItem}
                onMouseEnter={handleItemHover}
                onMouseLeave={handleItemLeave}
              />
            )}

            {filteredTools.length > 0 && (
              <div className="mb-24">
                <NavigationSection
                  title="Outils"
                  items={filteredTools}
                  pathname={pathname}
                  hoveredItem={hoveredItem}
                  onMouseEnter={handleItemHover}
                  onMouseLeave={handleItemLeave}
                />
              </div>
            )}

            <div className="h-8" />
          </div>
        </div>
      </aside>
    </>
  );
};
