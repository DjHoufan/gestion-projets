import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  MapPin,
  Target,
  Users,
  FileText,
  Phone,
  Mail,
  User,
  Building2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { VisiteTerrainDetail } from "@/core/lib/types";
import { formatDate } from "@/core/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@/core/components/ui/separator";

export const VisitShow = ({ data }: { data: VisiteTerrainDetail }) => {
  const { visit, users, personnes, files } = data;

  return (
    <ScrollArea className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Visite Terrain
        </h1>
        <div className="flex items-center gap-3 text-slate-600">
          <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded-full">
            ID: {data.id.slice(0, 8)}...
          </span>
          <Separator orientation="vertical" className="h-4" />
          <Badge
            variant={visit.status ? "default" : "secondary"}
            className={`flex items-center gap-1 ${
              visit.status
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-orange-100 text-orange-800 hover:bg-orange-200"
            }`}
          >
            {visit.status ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            {visit.status ? "Terminée" : "En attente"}
          </Badge>
        </div>
      </div>

      <div className="space-y-6 mt-4">
        {/* Visit Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
            <CalendarDays className="h-5 w-5 text-blue-600 mb-1" />
            <span className="text-xs font-medium text-slate-600">Date</span>
            <span className="text-xs font-bold text-slate-800">
              {formatDate(visit.date.toDateString())}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
            <Clock className="h-5 w-5 text-green-600 mb-1" />
            <span className="text-xs font-medium text-slate-600">Horaire</span>
            <span className="text-xs font-bold text-slate-800">
              {visit.startTime} - {visit.endTime}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
            <MapPin className="h-5 w-5 text-orange-600 mb-1" />
            <span className="text-xs font-medium text-slate-600">Lieu</span>
            <span className="text-xs font-bold text-slate-800">
              {visit.location}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
            <Target className="h-5 w-5 text-purple-600 mb-1" />
            <span className="text-xs font-medium text-slate-600">Objectif</span>
            <span className="text-xs font-bold text-slate-800">
              {visit.objetif}
            </span>
          </div>
        </div>

        {/* Observations */}
        <div className="bg-slate-50 p-3 rounded-lg">
          <h4 className="font-semibold text-slate-800 mb-2 text-sm">
            Observations
          </h4>
          <p className="text-slate-600 text-sm">{data.observations}</p>
        </div>

        {/* Accompagnateur & Accompagnement Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Accompagnateur Card */}
          <Card className="h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Accompagnateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={users.profile || "/placeholder.svg"}
                    alt={users.name}
                  />
                  <AvatarFallback className="text-sm">
                    {users.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {users.name}
                  </h4>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {users.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {users.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {users.address}
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {users.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accompagnement Card */}
          <Card className="h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-green-600" />
                Accompagnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-20">
                <div className="text-center">
                  <h4 className="font-bold text-lg text-slate-800 mb-1">
                    {visit.Planning.accompaniments[0]?.name}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {visit.Planning.accompaniments[0]?.members.length} membres
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Personnes Présentes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Personnes Présentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {personnes.map((personne) => (
                  <div
                    key={personne.id}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-slate-800 text-sm">
                        {personne.name}
                      </span>
                      <p className="text-xs text-slate-600">{personne.role}</p>
                    </div>
                    <Badge
                      variant={personne.signature ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {personne.signature ? "Signé" : "Non signé"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fichiers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-600" />
                Fichiers ({files.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                  >
                    <FileText className="h-3 w-3 text-slate-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate text-xs">
                        {file.name}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {file.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};
