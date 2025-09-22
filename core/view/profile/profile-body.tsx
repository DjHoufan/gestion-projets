"use client";

import { useGetProfile, useUpdateCvOrProfile } from "@/core/hooks/use-teams";
import { IdType } from "@/core/lib/types";
import { LoadingProfile } from "@/core/view/profile/profile-loading";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import {
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Clock,
  Edit,
  MoreVertical,
  MoveLeft,
} from "lucide-react";
import { calculerAge, formatDate, formatDateTime } from "@/core/lib/utils";
import { useRouter } from "next/navigation";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import ImageUpload from "@/core/components/global/upload-image";
import { useModal } from "@/core/providers/modal-provider";

export const ProfileBody = ({ Id }: IdType) => {
  const router = useRouter();
  const { open } = useModal();

  const { data: user, isPending } = useGetProfile(Id);
  const { mutate: updateProfileOrCv } = useUpdateCvOrProfile();

  if (!user || isPending) {
    return <LoadingProfile />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 animate-fadeIn">
      {/* Header avec gradient */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 pb-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="flex justify-between  items-center p-5">
          <Button
            onClick={() => router.back()}
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 cursor-pointer"
          >
            <MoveLeft className="w-4 h-4 " />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 -mt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Card principale du profil */}
          <Card className="mb-8 border-0   bg-white/80 backdrop-blur-sm animate-slideUp">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar et infos principales */}
                <div className="flex flex-col items-center text-center lg:text-left">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                      <AvatarImage
                        src={user.profile || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-emerald-200 hover:bg-emerald-50 bg-transparent"
                    onClick={() =>
                      open(
                        <CustomModal size="md:max-w-[400px]">
                          <div className="flex items-center justify-center h-full">
                            <ImageUpload
                              value={""}
                              disabled={false}
                              onChange={(url) => {
                                if (url) {
                                  updateProfileOrCv({
                                    param: {
                                      op: "profile",
                                      userId: user.id,
                                    },
                                    json: { value: url },
                                  });
                                }
                              }}
                              folder="profile"
                              buttonPosition="top-right"
                            />
                          </div>
                        </CustomModal>
                      )
                    }
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Modifier photo
                  </Button>
                </div>

                {/* Informations principales */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      {user.name}
                    </h2>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-1">
                        <Shield className="w-3 h-3 mr-1" />
                        {user.type === "admin"
                          ? "Administrateur"
                          : "Utilisateur"}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Compte actif
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 px-3 py-1"
                      >
                        {calculerAge(user.dob)} ans
                      </Badge>
                    </div>
                  </div>

                  {/* Contact rapide */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-md">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-md">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Téléphone</p>
                        <p className="font-semibold text-gray-900">
                          {user.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grille des informations détaillées */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Informations personnelles */}
            <Card className="lg:col-span-2 border shadow-lg bg-white/80 backdrop-blur-sm hover:  transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Informations personnelles
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Nom complet
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {user.name}
                      </p>
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Genre
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                        {user.gender}
                      </p>
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Date de naissance
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatDate(user.dob)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Email
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {user.email}
                      </p>
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Téléphone
                      </label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {user.phone}
                      </p>
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Adresse
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <p className="text-lg font-semibold text-gray-900">
                          {user.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card className="border shadow-lg bg-white/80 backdrop-blur-sm hover:  transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Système</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      ID Utilisateur
                    </label>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded-lg mt-2 break-all">
                      {user.id}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      ID Auth
                    </label>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded-lg mt-2 break-all">
                      {user.authId}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Créé le
                    </label>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatDateTime(user.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Mis à jour le
                    </label>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatDateTime(user.updatedAt)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Statut du compte
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-emerald-600">
                          Actif
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques rapides */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-slideUp"
            style={{ animationDelay: "0.4s" }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:  transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">
                  {calculerAge(user.dob)}
                </div>
                <div className="text-emerald-100">Années</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-cyan-500 text-white hover:  transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">
                  {Math.floor(
                    (Date.now() - new Date(user.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </div>
                <div className="text-teal-100">Jours membre</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white hover:  transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-cyan-100">Profil complété</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
