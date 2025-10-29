"use client";

import type React from "react";

import {
  Calendar,
  Home,
  Users,
  ShoppingCart,
  AlertTriangle,
  User,
  FileText,
  MessageSquare,
  X,
} from "lucide-react";
import { MdOutlineGroups2 } from "react-icons/md";
import { useCustomeTabs, useSelectAC } from "@/core/hooks/store";
import Logo from "@/core/components/global/logo";

type MenuItem = {
  title: string;
  url: string;
  url2?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  color: string;
  lightColor: string;
  textColor: string;
};

const menuItems: MenuItem[] = [
  {
    title: "Vue d'ensemble",
    url: "overview",
    icon: Home,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    title: "Accompagnements",
    url: "accompaniments",
    url2: "detailAccompaniments",
    icon: Users,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    title: "Bénéficiaire",
    url: "members",
    icon: User,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    title: "Planification",
    url: "planning",
    icon: Calendar,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    title: "Achats",
    url: "purchases",
    icon: ShoppingCart,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    title: "Conflits",
    url: "conflicts",
    icon: AlertTriangle,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    title: "Émargements",
    url: "emargements",
    icon: FileText,
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
    textColor: "text-teal-600",
  },
  {
    title: "Rencontre",
    url: "rencontre",
    icon: MdOutlineGroups2,
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
    textColor: "text-teal-600",
  },
  {
    title: "Messages",
    url: "message",
    icon: MessageSquare,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
];

const hoverColors: Record<string, string> = {
  "bg-blue-500": "group-hover:bg-blue-500",
  "bg-emerald-500": "group-hover:bg-emerald-500",
  "bg-purple-500": "group-hover:bg-purple-500",
  "bg-orange-500": "group-hover:bg-orange-500",
  "bg-indigo-500": "group-hover:bg-indigo-500",
  "bg-red-500": "group-hover:bg-red-500",
  "bg-teal-500": "group-hover:bg-teal-500",
};

type Props = {
  toggleSidebarAction: () => void;
};

export function ACSidebar({ toggleSidebarAction }: Props) {
  const { set, value: url } = useCustomeTabs();
  const AC = useSelectAC();
  return (
    <div className="md:w-[300px] h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900  transition-transform duration-300 ease-in-out   flex flex-col border-r-2 border-r-teal-500/20">
      <div className="relative border-b border-slate-700/50 bg-gradient-to-r from-teal-600/20 to-teal-600/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-teal-500/10" />

        <div className="p-5">
          <Logo variant="light" size="md" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto ">
        {menuItems.map((item: MenuItem) => {
          const isActive: boolean = url === item.url || url === item.url2;
          return (
            <button
              key={item.title}
              onClick={() => {
                set(item.url);
                AC.set("");
              }}
              className={`
                group relative w-full p-3 rounded-lg transition-all duration-200 border text-left text-slate-300
                ${
                  isActive
                    ? ` bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-${
                        item.color.split("-")[1]
                      }-500`
                    : " border-transparent hover:bg-gradient-to-r hover:from-slate-800/80 hover:to-slate-700/80 hover:text-white hover:shadow-lg"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Minimalist Icon */}
                <div
                  className={` w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                    ${
                      isActive
                        ? item.color
                        : `bg-gradient-to-r from-teal-600/20 to-teal-600/20 ${
                            hoverColors[item.color]
                          }  `
                    }`}
                >
                  {item.icon && <item.icon className={`h-4 w-4 text-white `} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`
                        text-sm font-medium truncate
                        ${isActive ? item.textColor : "text-slate-300   "}
                      `}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
