"use client";

import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import {
  CalendarDays,
  MapPin,
  Phone,
  User,
  GraduationCap,
  Languages,
  AlertTriangle,
  Building,
} from "lucide-react";
import { MemberDetail } from "@/core/lib/types";
import { formatDate } from "@/core/lib/utils";

type Props = {
  user: MemberDetail;
};

export const MemberCard = ({ user }: Props) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getGenderBadgeColor = (gender: string) => {
    return gender.toLowerCase() === "femme"
      ? "bg-pink-100 text-pink-800"
      : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="space-y-6   max-h-[90vh] overflow-y-auto">
      {/* Profile Section */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={user.profile || "/placeholder.svg"}
            alt={user.name}
          />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className={getGenderBadgeColor(user.gender)}>
              <User className="w-3 h-3 mr-1" />
              {user.gender}
            </Badge>
            <Badge variant="outline">
              <Building className="w-3 h-3 mr-1" />
              {user.project.name}
            </Badge>
            {user.leave && (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Abandon
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Téléphone:</span>
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Date de naissance:</span>
              <span>{formatDate(user.dob)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Languages className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Langue:</span>
              <span>{user.language}</span>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Localisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Commune:</span>
              <p className="text-gray-700 mt-1">{user.commune}</p>
            </div>
            <div className="text-sm">
              <span className="font-medium">Adresse résidentielle:</span>
              <p className="text-gray-700 mt-1">{user.residential}</p>
            </div>
          </CardContent>
        </Card>

        {/* Education & Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              Formation & Compétences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Attestation:</span>
              <p className="text-gray-700 mt-1">{user.attestation}</p>
            </div>
            <div className="text-sm">
              <span className="font-medium">Handicap:</span>
              <Badge
                variant={
                  user.disability === "Pas de Handicap"
                    ? "secondary"
                    : "outline"
                }
                className="ml-2"
              >
                {user.disability}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-orange-600" />
              Statut du Projet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Projet:</span>
              <p className="text-gray-700 mt-1">{user.project.name}</p>
            </div>
            <div className="text-sm">
              <span className="font-medium">Statut:</span>
              <Badge
                variant={user.project.status ? "default" : "secondary"}
                className="ml-2"
              >
                {user.project.status ? "Actif" : "Inactif"}
              </Badge>
            </div>
            <div className="text-sm">
              <span className="font-medium">Inscrit le:</span>
              <p className="text-gray-700 mt-1">{formatDate(user.createdAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Information (if exists) */}
      {user.leave && (
        <>
          <Separator />
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Informations d'Abandon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium text-red-700">
                  Date d'abandon:
                </span>
                <p className="text-red-600 mt-1">
                  {formatDate(user.leave.date)}
                </p>
              </div>
              <div className="text-sm">
                <span className="font-medium text-red-700">Raison:</span>
                <p className="text-red-600 mt-1 p-3 bg-white rounded-md border border-red-200">
                  {user.leave.reason}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
