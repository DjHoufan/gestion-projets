"use client";
import { useModal } from "@/core/providers/modal-provider";
import { Button } from "@/core/components/ui/button";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { MemberForm } from "./member-form";
import { useDeletMember, useGetMembers } from "@/core/hooks/use-member";
import {
  createExcelExporter,
  DataTable,
} from "../../components/global/data-table";
import { Member } from "@prisma/client";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import {
  AccessibilityIcon,
  ChartNetwork,
  ChevronsLeftRightEllipsis,
  Edit,
  LinkIcon,
  MoreHorizontal,
  NotebookText,
  ScanEye,
  Trash,
  UserCheck,
  UserX,
  Table as Stable,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import { MemberCard } from "@/core/view/member/member-card-view";
import { useRouter } from "next/navigation";
import { MemberDetail, PermissionProps } from "@/core/lib/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { DataAnalytics } from "@/core/view/member/member-show-stats";

import { definePermissions } from "@/core/lib/utils";




export const MemberBody = ({ permission }: PermissionProps) => {
  const { canAdd, canModify, canDelete, canDetails } = useMemo(() => {
    return definePermissions(permission, "beneficiaires");
  }, [permission]);

  const router = useRouter();
  const { open } = useModal();
  const { data, isPending } = useGetMembers();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [member, setMember] = useState<Member | null>(null);
  const { mutate: useDelete, isPending: loading } = useDeletMember();

  const AddMember = () => {
    open(
      <CustomModal>
        <MemberForm />
      </CustomModal>
    );
  };

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

  const exportMembers = createExcelExporter(
    {
      name: "Nom",
      phone: "Téléphone",
      gender: "Genre",
      dob: "Date de naissance",
      commune: "Commune",
      residential: "Résidence",
      disability: "Handicap",
      language: "Langue",
      attestation: "Attestation",
      projectName: "Nom du projet",
      status: "Statut (Abandon)",
    },
    (member: MemberDetail) => {
      return {
        name: member.name,
        phone: member.phone,
        gender: member.gender, // Déjà en français ("Femme"/"Homme") dans vos données
        dob: format(new Date(member.dob), "dd MMM yyyy", { locale: fr }),
        commune: member.commune,
        residential: member.residential,
        disability: member.disability,
        language: member.language,
        attestation: member.attestation,
        projectName: member.project?.name || "N/A", // Accès au nom du projet avec fallback
        status: member.leave !== null ? "Oui" : "Non", // Statut d'abandon
      };
    },
    "membres",
    `Export_Membres_${format(new Date(), "yyyyMMdd")}`
  );
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
 

  return (
    <>
      <DeleteConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
        title={`${member?.name!}`}
      />

      <Tabs defaultValue="table">
        <div className="w-full flex justify-end">
          <TabsList className=" w-[500px] rounded">
            <TabsTrigger
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded "
              value="stats"
            >
              <ChartNetwork /> Statistique
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded "
              value="table"
            >
              <Stable /> Données{" "}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="table">
          <DataTable<MemberDetail>
            data={data ? data : []}
            columns={columns}
            searchPlaceholder="Rechercher par nom ou date..."
            searchField="name"
            additionalSearchFields={[
              "name",
              "phone",
              "email",
              "status",
              "language",
              "disability",
            ]}
            title="des bénéficiaires"
            description="Gérez les informations et les comptes des bénéficiaires"
            canAdd={canAdd}
            onAddButtonClick={AddMember}
            pageSize={10}
            addButtonText="Enregistre un nouveau bénéficiaire"
            isPending={isPending}
            exportFunction={exportMembers}
            filters={[
              {
                label: "Filtrer par handicap",
                field: "disability",
                type: "select",
                icon: AccessibilityIcon,
              },
              {
                label: "Filtrer par projet",
                field: "project.name",
                type: "select",
                icon: LinkIcon,
              },
              {
                label: "Filtrer par statut",
                field: "statut",
                type: "select",
                icon: ChevronsLeftRightEllipsis,
              },
            ]}
          />
        </TabsContent>
        <TabsContent value="stats">
          {data ? (
            <DataAnalytics typedData={data} />
          ) : (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
                </div>
                <div className="mt-6 space-y-2">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Chargement des données...
                  </h2>
                  <p className="text-sm text-gray-500">
                    Analyse des statistiques en cours
                  </p>
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}{" "}
        </TabsContent>
      </Tabs>
    </>
  );
};
