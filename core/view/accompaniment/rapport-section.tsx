"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import {
  Eye,
  Users,
  Calendar,
  AlertTriangle,
  FileText,
  Phone,
  MapPin,
  Download,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import { TruncatedTextWithDialog } from "@/core/view/accompagnateur/section/rencontre-view";
import { Emargement, Member } from "@prisma/client";
import {
  ConflitDetail,
  RapportDetail,
  RencontreDetail,
} from "@/core/lib/types";

export default function RapportSection({
  mockData,
}: {
  mockData: RapportDetail;
}) {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [selectedConflict, setSelectedConflict] = useState<any>(null);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + " KB";
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Émargements
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {mockData.members.reduce(
                (acc, member) => acc + member.emargements.length,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Signatures collectées
            </p>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Participants Actifs
            </CardTitle>
            <Activity className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-500">
              {mockData.rencontre.reduce(
                (acc, meeting) =>
                  acc + meeting.signatures.filter((s: any) => s.present).length,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Présences confirmées
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conflits Résolus
            </CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {mockData.conflits.filter((conflict) => conflict.status).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sur {mockData.conflits.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className=" space-y-6">
        <TabsList className="h-12 grid w-full grid-cols-3 bg-card border border-border/50">
          <TabsTrigger
            value="members"
            className="p-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Membres
          </TabsTrigger>
          <TabsTrigger
            value="meetings"
            className="p-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Rencontres
          </TabsTrigger>
          <TabsTrigger
            value="conflicts"
            className="p-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Conflits
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card className="p-0 border-purple-500/20">
            <CardHeader className="p-5 rounded-t-xl bg-gradient-to-r from-purple-500/10 to-transparent">
              <CardTitle className="flex items-center gap-2 text-purple-500">
                <Users className="h-5 w-5" />
                Émargements des Membres
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead>Profil</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Émargements</TableHead>
                    <TableHead>Dernière signature</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.members.map((member) => (
                    <TableRow key={member.id} className="hover:bg-purple-500/5">
                      <TableCell>
                        <Avatar className="h-8 w-8 ring-2 ring-purple-500/20">
                          <AvatarImage
                            src={member.profile || "/placeholder.svg"}
                            alt={member.name}
                          />
                          <AvatarFallback className="bg-purple-500/10 text-purple-500">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-purple-500/30 text-purple-500"
                        >
                          {member.emargements.length} émargement(s)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.emargements.length > 0 ? (
                          <span className="text-sm">
                            {formatDate(
                              member.emargements[member.emargements.length - 1]
                                .date
                            )}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Aucune
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMember(member)}
                              className="hover:bg-purple-500/10 hover:text-purple-500"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="!max-w-3xl border-purple-500/20">
                            <DialogHeader>
                              <DialogTitle>Détails des Émargements</DialogTitle>
                            </DialogHeader>
                            {selectedMember && (
                              <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage
                                      src={
                                        selectedMember.profile ||
                                        "/placeholder.svg"
                                      }
                                      alt={selectedMember.name}
                                    />
                                    <AvatarFallback>
                                      {selectedMember.name
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-semibold">
                                      {selectedMember.name}
                                    </h3>
                                    <p className="text-muted-foreground">
                                      {selectedMember.attestation}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      <span>{selectedMember.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      <span>{selectedMember.residential}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <p>
                                      <strong>Genre:</strong>{" "}
                                      {selectedMember.gender}
                                    </p>
                                    <p>
                                      <strong>Langue:</strong>{" "}
                                      {selectedMember.language}
                                    </p>
                                    <p>
                                      <strong>Handicap:</strong>{" "}
                                      {selectedMember.disability}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-3">
                                    Historique des Émargements
                                  </h4>
                                  {selectedMember.emargements.length > 0 ? (
                                    <div className="space-y-3">
                                      {selectedMember.emargements.map(
                                        (emargement: any) => (
                                          <div
                                            key={emargement.id}
                                            className="p-4 bg-muted rounded-lg"
                                          >
                                            <div className="flex justify-between items-start mb-2">
                                              <div>
                                                <p className="font-medium">
                                                  Date:{" "}
                                                  {formatDate(emargement.date)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                  Montant: {emargement.montant}{" "}
                                                  €
                                                </p>
                                              </div>
                                              <Badge
                                                variant={
                                                  emargement.signature
                                                    ? "default"
                                                    : "secondary"
                                                }
                                              >
                                                {emargement.signature
                                                  ? "Signé"
                                                  : "Non signé"}
                                              </Badge>
                                            </div>
                                            {emargement.cni && (
                                              <p className="text-sm">
                                                <strong>CNI:</strong>{" "}
                                                {emargement.cni}
                                              </p>
                                            )}
                                            {emargement.observations && (
                                              <p className="text-sm mt-2">
                                                <strong>Observations:</strong>{" "}
                                                {emargement.observations}
                                              </p>
                                            )}
                                            {emargement.PhotoCni && (
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 bg-transparent"
                                                onClick={() =>
                                                  downloadFile(
                                                    emargement.PhotoCni,
                                                    `CNI_${selectedMember.name}.png`
                                                  )
                                                }
                                              >
                                                <Download className="h-3 w-3 mr-1" />
                                                Télécharger CNI
                                              </Button>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground text-center py-4">
                                      Aucun émargement enregistré pour ce membre
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings">
          <Card className="p-0 border-cyan-500/20">
            <CardHeader className="p-5 !rounded-t-xl  bg-gradient-to-r from-cyan-500/10 to-transparent">
              <CardTitle className="flex items-center gap-2 text-cyan-500">
                <Calendar className="h-5 w-5" />
                Rencontres
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-cyan-500/20">
                    <TableHead>Date</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Fichiers</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.rencontre.map((meeting) => (
                    <TableRow key={meeting.id} className="hover:bg-cyan-500/5">
                      <TableCell>{formatDate(meeting.visit.date)}</TableCell>
                      <TableCell>{meeting.visit.location}</TableCell>
                      <TableCell>
                        {meeting.visit.startTime} - {meeting.visit.endTime}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-500"
                        >
                          {meeting.signatures.length} participants
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-500"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {meeting.files.length}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMeeting(meeting)}
                              className="hover:bg-cyan-500/10 hover:text-cyan-500"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="!max-w-3xl border-cyan-500/20">
                            <DialogHeader>
                              <DialogTitle>Détails de la Rencontre</DialogTitle>
                            </DialogHeader>
                            {selectedMeeting && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Informations
                                    </h4>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <strong>Date:</strong>{" "}
                                        {formatDate(selectedMeeting.visit.date)}
                                      </p>
                                      <p>
                                        <strong>Lieu:</strong>{" "}
                                        {selectedMeeting.visit.location}
                                      </p>
                                      <p>
                                        <strong>Horaire:</strong>{" "}
                                        {selectedMeeting.visit.startTime} -{" "}
                                        {selectedMeeting.visit.endTime}
                                      </p>
                                      <p>
                                        <strong>Objectif:</strong>{" "}
                                        {selectedMeeting.visit.objetif}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Participants
                                    </h4>
                                    <div className="space-y-2">
                                      {selectedMeeting.signatures.map(
                                        (signature: any) => (
                                          <div
                                            key={signature.id}
                                            className="flex items-center gap-2"
                                          >
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage
                                                src={
                                                  signature.member.profile ||
                                                  "/placeholder.svg"
                                                }
                                                alt={signature.member.name}
                                              />
                                              <AvatarFallback>
                                                {signature.member.name
                                                  .split(" ")
                                                  .map((n: string) => n[0])
                                                  .join("")}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">
                                              {signature.member.name}
                                            </span>
                                            <Badge
                                              variant={
                                                signature.present
                                                  ? "default"
                                                  : "secondary"
                                              }
                                              className="text-xs"
                                            >
                                              {signature.present
                                                ? "Présent"
                                                : "Absent"}
                                            </Badge>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Points à l'ordre du jour
                                    </h4>
                                    <ul className="text-sm space-y-1">
                                      {selectedMeeting.order.map(
                                        (point: string, index: number) => (
                                          <li
                                            key={index}
                                            className="flex items-center gap-2"
                                          >
                                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                                            {point}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Décisions
                                    </h4>
                                    <ul className="text-sm space-y-1">
                                      {selectedMeeting.decisions.map(
                                        (decision: string, index: number) => (
                                          <li
                                            key={index}
                                            className="flex items-center gap-2"
                                          >
                                            <span className="w-2 h-2 bg-chart-2 rounded-full"></span>
                                            {decision}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Actions
                                    </h4>
                                    <ul className="text-sm space-y-1">
                                      {selectedMeeting.actions.map(
                                        (action: string, index: number) => (
                                          <li
                                            key={index}
                                            className="flex items-center gap-2"
                                          >
                                            <span className="w-2 h-2 bg-chart-3 rounded-full"></span>
                                            {action}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>

                                {selectedMeeting.files.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Fichiers joints
                                    </h4>
                                    <div className="space-y-2">
                                      {selectedMeeting.files.map(
                                        (file: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-muted rounded"
                                          >
                                            <div className="flex items-center gap-2">
                                              <FileText className="h-4 w-4" />
                                              <div>
                                                <p className="text-sm font-medium">
                                                  {file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                  {file.type} •{" "}
                                                  {formatFileSize(file.size)}
                                                </p>
                                              </div>
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                downloadFile(
                                                  file.url,
                                                  file.name
                                                )
                                              }
                                            >
                                              <Download className="h-3 w-3 mr-1" />
                                              Télécharger
                                            </Button>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conflicts Tab */}
        <TabsContent value="conflicts">
          <Card className="p-0 border-orange-500/20">
            <CardHeader className="p-5 !rounded-t-xl bg-gradient-to-r from-orange-500/10 to-transparent">
              <CardTitle className="flex items-center gap-2 text-orange-500">
                <AlertTriangle className="h-5 w-5" />
                Gestion des Conflits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-orange-500/20">
                    <TableHead>Nature</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Parties impliquées</TableHead>
                    <TableHead>Fichiers</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.conflits.map((conflict) => (
                    <TableRow
                      key={conflict.id}
                      className="hover:bg-orange-500/5"
                    >
                      <TableCell className="font-medium">
                        <TruncatedTextWithDialog
                          items={[conflict.nature]}
                          type="nature"
                          maxLength={40}
                        />
                      </TableCell>
                      <TableCell>
                        {formatDate(conflict.createdAt.toISOString())}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={conflict.status ? "default" : "destructive"}
                          className={
                            conflict.status
                              ? "bg-accent-green text-white"
                              : "bg-destructive text-white"
                          }
                        >
                          {conflict.status ? "Résolu" : "En cours"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-orange-500/30 text-orange-500"
                        >
                          {conflict.partieImpliques.length} parties
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-orange-500/30 text-orange-500"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {conflict.files.length}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedConflict(conflict)}
                              className="hover:bg-orange-500/10 hover:text-orange-500"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="!max-w-3xl border-orange-500/20">
                            <DialogHeader>
                              <DialogTitle>Détails du Conflit</DialogTitle>
                            </DialogHeader>
                            {selectedConflict && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Informations générales
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <strong>Nature:</strong>{" "}
                                        {selectedConflict.nature}
                                      </p>
                                      <p>
                                        <strong>Date:</strong>{" "}
                                        {formatDate(selectedConflict.createdAt)}
                                      </p>
                                      <p>
                                        <strong>Statut:</strong>
                                        <Badge
                                          variant={
                                            selectedConflict.status
                                              ? "default"
                                              : "destructive"
                                          }
                                          className={
                                            selectedConflict.status
                                              ? "bg-accent-green text-white ml-2"
                                              : "bg-destructive text-white  ml-2"
                                          }
                                        >
                                          {selectedConflict.status
                                            ? "Résolu"
                                            : "En cours"}
                                        </Badge>
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Parties impliquées
                                    </h4>
                                    <div className="space-y-2">
                                      {selectedConflict.partieImpliques.map(
                                        (partie: any, index: number) => (
                                          <div
                                            key={index}
                                            className="p-2 bg-muted rounded text-sm"
                                          >
                                            <p>
                                              <strong>Nom:</strong>{" "}
                                              {partie.name}
                                            </p>
                                            <p>
                                              <strong>Rôle:</strong>{" "}
                                              {partie.role}
                                            </p>
                                            <Badge
                                              variant={
                                                partie.signature
                                                  ? "default"
                                                  : "secondary"
                                              }
                                              className="text-xs mt-1"
                                            >
                                              {partie.signature
                                                ? "Signé"
                                                : "Non signé"}
                                            </Badge>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {selectedConflict.resolution && (
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Résolution
                                    </h4>
                                    <p className="text-sm bg-muted p-3 rounded">
                                      {selectedConflict.resolution}
                                    </p>
                                  </div>
                                )}

                                {selectedConflict.files.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Documents joints
                                    </h4>
                                    <div className="space-y-2">
                                      {selectedConflict.files.map(
                                        (file: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-muted rounded"
                                          >
                                            <div className="flex items-center gap-2">
                                              <FileText className="h-4 w-4" />
                                              <div>
                                                <p className="text-sm font-medium">
                                                  {file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                  {file.type} •{" "}
                                                  {formatFileSize(file.size)}
                                                </p>
                                              </div>
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                downloadFile(
                                                  file.url,
                                                  file.name
                                                )
                                              }
                                            >
                                              <Download className="h-3 w-3 mr-1" />
                                              Télécharger
                                            </Button>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
