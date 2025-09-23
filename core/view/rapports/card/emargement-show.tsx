import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { EmargementDetail } from "@/core/lib/types";
import {
  Calendar,
  CheckCircle,
  CreditCard,
  Download,
  ImageIcon,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";

export const EmargementShow = ({ data: emargement }: { data: any }) => {
  return (
    <div className="space-y-6 h-[80vh]">
      {/* Status and Amount */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
        <Badge
          variant={emargement.signature ? "default" : "secondary"}
          className={`${
            emargement.signature
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          } px-4 py-2`}
        >
          {emargement.signature ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" /> Émargement Signé
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 mr-2" /> En Attente de Signature
            </>
          )}
        </Badge>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">
            {emargement.montant.toLocaleString()} DJF
          </div>
          <div className="text-sm text-gray-500">
            {new Date(emargement.date).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </div>

      {/* Member Information */}
      {emargement.member && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Informations du Membre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 border-2 border-emerald-200">
                <AvatarImage
                  src={emargement.member.profile || "/placeholder.svg"}
                  alt={emargement.member.name}
                />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl">
                  {emargement.member.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">
                      {emargement.member.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {emargement.member.email}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{emargement.member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{emargement.member.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        Né(e) le{" "}
                        {new Date(emargement.member.dob).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Formation
                    </p>
                    <p className="text-sm text-gray-600">
                      {emargement.member.formation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Centre</p>
                    <p className="text-sm text-gray-600">
                      {emargement.member.center}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Genre</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {emargement.member.gender}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Informations du Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">CNI</p>
                <p className="font-mono font-medium bg-gray-100 px-3 py-2 rounded text-sm">
                  {emargement.cni}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Montant</p>
                <p className="font-bold text-emerald-600 text-lg">
                  {emargement.montant.toLocaleString()} DJF
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Date</p>
                <p className="text-sm">
                  {new Date(emargement.date).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Heure</p>
                <p className="text-sm">
                  {new Date(emargement.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-orange-600" />
              Reçu de paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emargement.PhotoCni ? (
              <div className="space-y-3">
                <img
                  src={emargement.PhotoCni || "/placeholder.svg"}
                  alt="Reçu de paiement"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  <Download className="h-3 w-3 mr-2" />
                  Télécharger l'image
                </Button>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-gray-500 text-sm">
                  Aucune photo disponible
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Observations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm leading-relaxed">
              {emargement.observations || (
                <span className="italic text-gray-500">
                  Aucune observation particulière
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
