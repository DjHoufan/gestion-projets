"use client";

import { useGetOneClasse } from "@/core/hooks/use-classe";
import { MemberDetail, RolePermission } from "@/core/lib/types";

import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  Users,
  GraduationCap,
  Languages,
  Clock,
  Building,
  UserX,
  UserCheck,
  AccessibilityIcon,
  ChevronsLeftRightEllipsis,
  MoveLeft,
  MoreHorizontal,
  ScanEye,
  NotebookText,
  Edit,
  Trash,
  Plus,
} from "lucide-react";
import { Skeleton } from "@/core/components/ui/skeleton";
import { definePermissions, formatDate } from "@/core/lib/utils";
import { format } from "date-fns";
import { DataTable } from "@/core/components/global/data-table";
import { Button } from "@/core/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { MemberCard } from "@/core/view/member/member-card-view";
import { useModal } from "@/core/providers/modal-provider";
import { MemberForm } from "@/core/view/member/member-form";
import { useMemo, useState } from "react";
import { Member } from "@prisma/client";
import { useDeletMember } from "@/core/hooks/use-member";
import { useClasseMembers } from "@/core/hooks/store";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";

type Props = {
  permission: RolePermission;
  Id: string;
};

export const ClasseDetail = ({ permission, Id }: Props) => {
  const { open } = useModal();
  const router = useRouter();

  const { canAdd, canModify, canDelete, canDetails } = useMemo(() => {
    return definePermissions(permission, "beneficiaires");
  }, [permission]);

  const { data: classData, isPending } = useGetOneClasse(Id);
  const { data: members } = useClasseMembers();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [member, setMember] = useState<Member | null>(null);
  const { mutate: useDelete, isPending: loading } = useDeletMember();

  const columns = [
    {
      id: "user",
      header: "Bénéficiaire",
      cell: ({ row }: any) => {
        const user = row.original;
        const gender = row.original.gender.toLowerCase();
        const genderMap = {
          homme: {
            label: "Homme",
            class: "bg-blue-100 text-blue-800 border-blue-200",
          },
          femme: {
            label: "Femme",
            class: "bg-pink-100 text-pink-800 border-pink-200",
          },
        };
        const genderConfig = genderMap[gender as keyof typeof genderMap] || {
          label: row.original.gender,
          class: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return (
          <div className="flex items-center gap-3 ">
            <Avatar className="h-8 w-8 border border-primary-200">
              <AvatarImage src={user.profile || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1  w-full">
              <span className="font-medium text-primary-900">{user.name}</span>
              <div className="flex justify-between items-center gap-5 w-full">
                <span className="text-xs text-primary-600">{user.phone}</span>
                <Badge
                  variant="outline"
                  className={`${genderConfig.class} font-medium capitalize`}
                >
                  {genderConfig.label}
                </Badge>
              </div>
            </div>
          </div>
        );
      },
      size: 250,
    },

    {
      id: "address",
      header: "Adresse",
      cell: ({ row }: any) => {
        const { commune, residential } = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{residential}</span>
            <span className="text-xs text-gray-600">{commune}</span>
          </div>
        );
      },
      size: 120,
    },

    {
      id: "dob",
      header: "Date de naissance",
      cell: ({ row }: any) => {
        const dob = new Date(row.original.dob);
        return <span>{format(dob, "dd/MM/yyyy")}</span>;
      },
      size: 150,
    },
    {
      id: "language",
      header: "Langue",
      cell: ({ row }: any) => {
        const languages = row.original.language;
        if (languages === "N/A" || !languages) {
          return <span className="text-gray-400">Non spécifié</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {languages.split(", ").map((lang: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {lang.trim()}
              </Badge>
            ))}
          </div>
        );
      },
      size: 150,
    },
    {
      id: "attestation",
      header: "Attestation",
      cell: ({ row }: any) => {
        const attestation = row.original.attestation;
        if (attestation === "N/A" || !attestation) {
          return <span className="text-gray-400">Aucune</span>;
        }
        return (
          <span className="text-sm" title={attestation}>
            {attestation.length > 30
              ? `${attestation.substring(0, 30)}...`
              : attestation}
          </span>
        );
      },
      size: 200,
    },
    {
      id: "project",
      header: "Projet",
      cell: ({ row }: any) => {
        const project = row.original.project;
        return (
          <div className="flex items-center gap-2 flex-col">
            <span className="font-medium">{project.name}</span>
          </div>
        );
      },
      size: 150,
    },
    {
      id: "disability",
      header: "Handicap",
      cell: ({ row }: any) => {
        const disability = row.original.disability;
        const isDisabled = disability !== "Pas de Handicap";
        return (
          <Badge
            variant={isDisabled ? "destructive" : "outline"}
            className="text-xs"
          >
            {disability}
          </Badge>
        );
      },
      size: 130,
    },
    {
      id: "statut",
      header: "Statut",
      cell: ({ row }: any) => {
        const statut = row.original.statut;
        const gender = row.original.gender;
        return (
          <span
            className={`flex items-center gap-2 px-3 py-1.5 justify-center  rounded-full text-sm font-medium ${
              statut === "oui"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {statut === "oui" ? (
              <UserX className="w-4 h-4" />
            ) : (
              <UserCheck className="w-4 h-4" />
            )}
            {statut === "oui"
              ? `Abandonné${gender === "Femme" ? "e" : ""}`
              : "Actif"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const member = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    open(
                      <CustomModal>
                        <MemberCard user={member} />
                      </CustomModal>
                    )
                  }
                  className="flex items-center gap-2 rounded-lg cursor-pointer"
                >
                  <ScanEye className="h-4 w-4" />
                  Voir
                </DropdownMenuItem>
                {canDetails && (
                  <DropdownMenuItem
                    onClick={() => router.push(`/beneficiaires/${member.id}`)}
                    className="flex items-center gap-2 rounded-lg cursor-pointer"
                  >
                    <NotebookText className="h-4 w-4" />
                    Details
                  </DropdownMenuItem>
                )}
                {canModify && (
                  <DropdownMenuItem
                    onClick={() =>
                      open(
                        <CustomModal>
                          <MemberForm details={member} />
                        </CustomModal>
                      )
                    }
                    className="flex items-center gap-2 rounded-lg cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                )}

                {canDelete && (
                  <DropdownMenuItem
                    onClick={() => {
                      setMember(member);
                      setIsOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-lg cursor-pointer"
                  >
                    <Trash className="textre h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const onConfirmDelete = async () => {
    useDelete(
      { param: { emId: member?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setMember(null);
        },
      }
    );
  };

  if (!classData) {
    return <LoadingState />;
  }

  return (
    <>
      <DeleteConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
        title={`${member?.name!}`}
      />

      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {/* Class Name - Prominent display */}
            <div className="w-full flex justify-between">
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-2 font-sans">
                  {classData.name}
                </h1>
                <p className="text-lg text-muted-foreground font-sans">
                  Suivi de la classe
                </p>
              </div>
              <div className="flex gap-5">
                <Button
                  variant="secondary"
                  className="!px-7"
                  onClick={() => router.back()}
                >
                  <MoveLeft />
                </Button>
                {canAdd && (
                  <Button
                    className="!px-7"
                    onClick={() =>
                      open(
                        <CustomModal>
                          <MemberForm
                            pId={classData?.project!.id!}
                            classeId={classData?.id!}
                          />
                        </CustomModal>
                      )
                    }
                  >
                    <Plus />
                    <span>Enregistre un nouveau bénéficiaire</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Project Information - Left side */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Building className="h-6 w-6 text-primary" />
                    Projet:{" "}
                    <span className="text-primary">
                      {classData.project.name}
                    </span>
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Lieu de formation
                        </p>
                        <p className="font-semibold text-foreground">
                          {classData.project.local}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-secondary/10 rounded-full">
                        <Users className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Bénéficiaire
                        </p>
                        <p className="font-semibold text-foreground">
                          {members.length} participantes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-accent/10 rounded-full">
                        <CalendarDays className="h-4 w-4 " />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Début</p>
                        <p className="font-semibold text-foreground">
                          {formatDate(classData.project.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-accent/10 rounded-full">
                        <Clock className="h-4 w-4 " />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Fin prévue
                        </p>
                        <p className="font-semibold text-foreground">
                          {formatDate(classData.project.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trainer Profile - Right side */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {classData.user.gender === "femme"
                      ? "Formatrice"
                      : "Formateur"}
                  </h3>

                  <div className="text-center mb-4">
                    <Avatar className="h-20 w-20 mx-auto mb-3 border-4 border-primary/20">
                      <AvatarImage
                        src={classData.user.profile || "/placeholder.svg"}
                        alt={classData.user.name}
                      />
                      <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                        {classData.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="text-xl font-bold text-primary mb-1">
                      {classData.user.name}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {classData.user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {classData.user.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {classData.user.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DataTable<MemberDetail>
          data={members ? members : []}
          columns={columns}
          searchPlaceholder="Rechercher par nom ou date..."
          searchField="name"
          additionalSearchFields={[
            "phone",
            "email",
            "status",
            "language",
            "disability",
          ]}
          canAdd={false}
          header={false}
          pageSize={10}
          isPending={isPending}
          filters={[
            {
              label: "Filtrer par handicap",
              field: "disability",
              type: "select",
              icon: AccessibilityIcon,
            },

            {
              label: "Filtrer par statut",
              field: "statut",
              type: "select",
              icon: ChevronsLeftRightEllipsis,
            },
          ]}
        />
      </div>
    </>
  );
};

function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {/* Loading Class Name */}
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>

          {/* Loading Main content grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Loading Project Information */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Skeleton className="h-8 w-48 mb-4" />

                <div className="grid md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
              </div>
            </div>

            {/* Loading Trainer Profile */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <Skeleton className="h-6 w-24 mb-4" />

                <div className="text-center mb-4">
                  <Skeleton className="h-20 w-20 rounded-full mx-auto mb-3" />
                  <Skeleton className="h-6 w-32 mx-auto mb-1" />
                  <Skeleton className="h-4 w-24 mx-auto rounded-full" />
                </div>

                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Students List */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <Card className="shadow-sm border-border">
          <CardHeader className="bg-muted">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              {[...Array(5)].map((_, index) => (
                <Card key={index} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-12 w-12 rounded-full" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-48" />

                        <div className="grid md:grid-cols-3 gap-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
