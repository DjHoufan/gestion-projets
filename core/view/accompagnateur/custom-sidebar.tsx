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
} from "lucide-react";
import { MdOutlineGroups2 } from "react-icons/md";
import Image from "next/image";
import { useCustomeTabs } from "@/core/hooks/store";

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
    title: "Membres",
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

export function CustomSidebar() {
  const { set, value: url } = useCustomeTabs();
  return (
    <div className="w-[300px] h-screen bg-slate-50/50 backdrop-blur-sm  flex flex-col border-r-2 border-r-teal-500/20">
      <div className="relative border-b border-slate-700/50 bg-gradient-to-r from-teal-600/20 to-teal-600/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-teal-500/10" />
        <div className="relative p-6 flex items-center justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-teal-500/20 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="relative p-3  bg-white  rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-lg">
              <Image
                src="/images/houfan-new-logo.png"
                alt="HOUFAN Research & Transform"
                width={200}
                height={42}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
       
        {menuItems.map((item: MenuItem) => {
          const isActive: boolean = url === item.url || url === item.url2;
          return (
            <button
              key={item.title}
              onClick={() => set(item.url)}
              className={`
                group relative w-full p-3 rounded-lg transition-all duration-200 border text-left
                ${
                  isActive
                    ? `${item.lightColor} border-${
                        item.color.split("-")[1]
                      }-200`
                    : "hover:bg-white/80 border-transparent hover:border-gray-200"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Minimalist Icon */}
                <div
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                    ${
                      isActive
                        ? item.color
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }
                  `}
                >
                  {item.icon && (
                    <item.icon
                      className={`h-4 w-4 ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`
                        text-sm font-medium truncate
                        ${
                          isActive
                            ? item.textColor
                            : "text-slate-700 group-hover:text-slate-900"
                        }
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
