"use client";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  CalendarDays,
  FileText,
  MapPin,
  Phone,
  Users,
  Download,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ConflitDetail } from "@/core/lib/types";
import { formatDate } from "@/core/lib/utils";
import { ScrollArea } from "@/core/components/ui/scroll-area";

// ConflictShow component with red theme
export const ConflictShow = ({ data }: { data: ConflitDetail }) => {
  return (
    <ScrollArea className="mt-4 h-[80vh] p-5">
      <div className="space-y-6">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Conflit</h2>
              <p className="text-red-100 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {data.id}
              </p>
            </div>
            <div className="text-right">
              <Badge
                variant={data.status ? "default" : "secondary"}
                className={`${
                  data.status
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-300 text-red-800 "
                } text-sm px-3 py-1`}
              >
                {data.status ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Terminé
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    En cours
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main content in cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nature et résolution */}
          <Card className="bg-gradient-to-br bg-red-50 border-red-200 text-red-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Nature du conflit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800 leading-relaxed">{data.nature}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-200 text-green-800">
            <CardHeader className="pb-3">
              <CardTitle className=" flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Résolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className=" leading-relaxed">{data.resolution}</p>
            </CardContent>
          </Card>
        </div>

        {/* Accompagnement et Accompagnateur côte à côte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accompagnement */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <User className="h-5 w-5" />
                Accompagnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-lg text-red-900">
                    {data.accompaniment.name}
                  </h4>
                  <p className="text-red-600 text-sm mt-1">
                    Créé le{" "}
                    {formatDate(data.accompaniment.createdAt.toDateString())}
                  </p>
                </div>
                <Badge
                  variant={data.accompaniment.status ? "default" : "secondary"}
                  className={
                    data.accompaniment.status
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-red-200 text-red-800"
                  }
                >
                  {data.accompaniment.status ? "Terminé" : "En cours"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Accompagnateur */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">Accompagnateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-4 border-red-200">
                    <AvatarImage
                      src={
                        data.users.profile ||
                        "/placeholder.svg?height=64&width=64"
                      }
                      alt={data.users.name}
                    />
                    <AvatarFallback className="bg-red-100 text-red-700 text-lg font-semibold">
                      {data.users.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {data.users.name}
                  </h4>
                  <p className="text-gray-600 mb-3">{data.users.email}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-red-500" />
                      {data.users.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-red-500" />
                      {data.users.address}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parties impliquées */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-red-500" />
              Parties impliquées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {data.partieImpliques.map((partie, index) => (
                <div
                  key={partie.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{partie.name}</p>
                      <p className="text-sm text-gray-600">{partie.role}</p>
                    </div>
                  </div>
                  <Badge
                    variant={partie.signature ? "default" : "secondary"}
                    className={
                      partie.signature
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-400 hover:bg-gray-500 text-white text-sm !rounded-md"
                    }
                  >
                    {partie.signature ? "✓ Signé" : "⏳ En attente"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fichiers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" />
              Documents joints ({data.files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {data.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-red-600 capitalize">
                        {file.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                    asChild
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer avec dates */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays className="h-4 w-4 text-red-500" />
              <span>
                <strong>Créé le:</strong>{" "}
                {formatDate(data.createdAt.toDateString())}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays className="h-4 w-4 text-red-500" />
              <span>
                <strong>Modifié le:</strong>{" "}
                {formatDate(data.updatedAt.toDateString())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
