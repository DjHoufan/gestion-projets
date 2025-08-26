 
import { GetFileIcon } from "@/core/components/global/multi-uploads";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { RencontreDetail } from "@/core/lib/types";
import { formatDate } from "@/core/lib/utils";
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileIcon,
  ListChecks,
  Mail,
  MapPin,
  Phone,
  Target,
  User,
  XCircle,
} from "lucide-react";
import React from "react";

export const RencontreShow = ({ data }: { data: RencontreDetail }) => {
  return (
    <Card className="max-w-5xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Rencontre du {formatDate(data.date.toDateString())}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {data.lieu}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="agenda">Ordre du jour</TabsTrigger>
            <TabsTrigger value="files">Fichiers</TabsTrigger>
            <TabsTrigger value="signatures">Signatures</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Accompagnement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building className="h-5 w-5" />
                    Accompagnement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {data.accompaniment.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {data.accompaniment.adresse}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphones
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {data.accompaniment.phones.map((phone, index) => (
                        <Badge key={index} variant="outline">
                          {phone}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accompagnateur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Accompagnateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={data.users.profile || "/placeholder.svg"}
                        alt={data.users.name}
                      />
                      <AvatarFallback className="text-lg">
                        {data.users.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {data.users.name}
                      </h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {data.users.type}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      {data.users.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      {data.users.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {data.users.address}
                    </div>
                  </div>

                  <Badge
                    variant={
                      data.users.status === "enabled" ? "default" : "secondary"
                    }
                  >
                    {data.users.status === "enabled" ? "Actif" : "Inactif"}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agenda" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ordre du jour */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    Ordre du jour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.order.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Décisions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Décisions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.decisions.map((decision, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{decision}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Actions à prendre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            {data.files.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.files.map((file) => (
                  <Card
                    key={file.id}
                    className="hover:shadow-md transition-shadow"
                  >
                  <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {GetFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {file.name}
                          </h4>
                          <p className="text-xs text-muted-foreground capitalize mt-1">
                            {file.type}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 w-full bg-transparent"
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun fichier attaché à cette rencontre</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="signatures" className="space-y-4">
            <div className="space-y-4">
              {data.signatures.map((signature) => (
                <Card key={signature.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={signature.member.profile || "/placeholder.svg"}
                          alt={signature.member.name}
                        />
                        <AvatarFallback>
                          {signature.member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {signature.member.name}
                        </h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Signé le {formatDate(signature.date.toString())}
                          </div>

                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {signature.member.phone}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">
                            <strong>Attestarion:</strong>{" "}
                            {signature.member.attestation}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {signature.present ? (
                          <Badge variant="default" className="mb-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Présent
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="mb-2">
                            <XCircle className="h-3 w-3 mr-1" />
                            Absent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
