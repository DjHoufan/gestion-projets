"use client";

import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Building2,
  Sparkles,
  Star,
} from "lucide-react";

import type { UserDetail } from "@/core/lib/types";
import { formatDate } from "@/core/lib/utils";

type Props = {
  userData: UserDetail;
};

export const TeamCard = ({ userData }: Props) => {
  function formatFileSize(bytes: number) {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }

  return (
    <div className="bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50 border-2 border-primary/20 rounded-2xl shadow-lg transition-all duration-30  overflow-hidden">
      {/* Profile Header */}
      <div className="relative p-6 bg-gradient-to-r from-primary to-green-500">
        <div className="absolute top-4 left-4">
          <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
        </div>

        <div className="flex items-center gap-4 mt-8">
          <Avatar className="h-20 w-20 ring-4 ring-white/50 shadow-xl flex-shrink-0">
            <AvatarImage
              src={userData.profile || "/placeholder.svg"}
              alt={userData.name}
            />
            <AvatarFallback className="text-lg bg-white/20 backdrop-blur-sm text-white font-bold">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
              {userData.name}
            </h2>

            <div className="flex flex-col gap-2">
              {userData.status === "enabled" ? (
                <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-green-300/30 w-fit">
                  <CheckCircle className="h-3 w-3 text-green-200" />
                  <span className="text-xs font-semibold text-green-100">
                    Actif
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-red-300/30 w-fit">
                  <XCircle className="h-3 w-3 text-red-200" />
                  <span className="text-xs font-semibold text-red-100">
                    Inactif
                  </span>
                </div>
              )}

              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1 text-xs font-semibold w-fit">
                {userData.type === "employe"
                  ? userData.gender === "homme"
                    ? "Employé"
                    : "Employée"
                  : userData.type === "trainer"
                  ? userData.gender === "homme"
                    ? "Formateur"
                    : "Formatrice"
                  : userData.type === "accompanist"
                  ? userData.gender === "homme"
                    ? "Accompagnateur"
                    : "Accompagnatrice"
                  : "Admin"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-md">
                <Mail className="h-3 w-3 text-white" />
              </div>
              <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Contact
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/50">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded shadow-sm">
                  <Mail className="h-3 w-3 text-white" />
                </div>
                <span className="text-foreground font-medium text-xs truncate">
                  {userData.email}
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded shadow-sm">
                  <Phone className="h-3 w-3 text-white" />
                </div>
                <span className="text-foreground font-medium text-xs">
                  {userData.phone}
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
                <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded shadow-sm">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
                <span className="text-foreground font-medium text-xs truncate">
                  {userData.address}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md">
                <User className="h-3 w-3 text-white" />
              </div>
              <h3 className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Personnel
              </h3>
            </div>

            <div className="space-y-2">
              <div className="p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200/50">
                <span className="text-orange-600 text-xs font-semibold block mb-1">
                  Naissance
                </span>
                <span className="text-foreground font-medium text-xs">
                  {formatDate(userData.dob)}
                </span>
              </div>
              <div className="p-2 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200/50">
                <span className="text-pink-600 text-xs font-semibold block mb-1">
                  Genre
                </span>
                <span className="text-foreground font-medium text-xs capitalize">
                  {userData.gender}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CV Section - Full Width */}
        {userData.cv && userData.cv.name && (
          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-md">
                <FileText className="h-3 w-3 text-white" />
              </div>
              <h3 className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                CV
              </h3>
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 py-0.5 text-xs font-bold">
                Disponible
              </Badge>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-lg p-3 border border-emerald-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded shadow-md">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      {userData.cv.name}
                    </p>
                    <p className="text-emerald-600 font-semibold text-xs">
                      {userData.cv.type.toUpperCase()} •{" "}
                      {formatFileSize(userData.cv.size)}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md text-xs"
                  asChild
                >
                  <a
                    href={userData.cv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Télécharger
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* System Information - Full Width */}
        <div className="mt-6 pt-4 border-t border-gray-200/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg shadow-md">
              <Building2 className="h-3 w-3 text-white" />
            </div>
            <h3 className="text-sm font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
              Système
            </h3>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-200/50">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <span className="text-muted-foreground font-semibold block mb-1">
                  Créé
                </span>
                <span className="text-foreground font-medium">
                  {formatDate(userData.createdAt)}
                </span>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground font-semibold block mb-1">
                  Modifié
                </span>
                <span className="text-foreground font-medium">
                  {formatDate(userData.updatedAt)}
                </span>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground font-semibold block mb-1">
                  ID
                </span>
                <span className="text-foreground font-mono text-xs bg-gray-200/50 px-1 py-0.5 rounded">
                  {userData.id.slice(0, 6)}...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
