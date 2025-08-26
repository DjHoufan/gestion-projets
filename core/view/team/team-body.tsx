"use client";
import React, { useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Users, IdCardLanyard, Edit, Contact, Mail } from "lucide-react";
import { useModal } from "@/core/providers/modal-provider";
import { Button } from "@/core/components/ui/button";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { EquipeForm } from "./team-form";
import { useDeletTeam, useGetTeam } from "@/core/hooks/use-teams";

import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { calculerAge, definePermissions } from "@/core/lib/utils";
import {
  createExcelExporter,
  DataTable,
} from "@/core/components/global/data-table";
import { PermissionProps, UserDetail } from "@/core/lib/types";

import { Status, StatusIndicator } from "@/core/components/ui/status";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { TeamCard } from "@/core/view/team/team-card";
import { useSendResetPassword } from "@/core/hooks/use-auth";
import { Spinner } from "@/core/components/ui/spinner";

export const EquipeBody = ({ permission }: PermissionProps) => {
  const { canAdd, canModify, canDelete, canReset } = useMemo(() => {
    return definePermissions(permission, "equipe");
  }, [permission]);

  const { open } = useModal();

  const { data, isPending } = useGetTeam();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserDetail | null>(null);
  const { mutate: useDelete, isPending: loading } = useDeletTeam();

  const { mutate: send, isPending: loadingReset } = useSendResetPassword();

  const [employes, accompanists, trainers] = useMemo(() => {
    if (!data) return [[], [], []];

    const e = [];
    const a = [];
    const t = [];

    for (const item of data) {
      if (item.type === "employe") e.push(item);
      else if (item.type === "accompanist") a.push(item);
      else if (item.type === "trainer") t.push(item);
    }

    return [e, a, t];
  }, [data]);

  const columns = [
    {
      id: "user",
      header: "Utilisateur",
      cell: ({ row }: any) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-primary-200">
              <AvatarImage src={user.profile || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-primary-900">{user.name}</span>
              <span className="text-xs text-primary-600">{user.email}</span>
            </div>
          </div>
        );
      },
      size: 250,
    },
    {
      id: "phone",
      header: "Téléphone",
      accessorKey: "phone",
      cell: ({ row }: any) => <span>{row.original.phone}</span>,
      size: 150,
    },
    {
      id: "address",
      header: "Adresse",
      accessorKey: "address",
      cell: ({ row }: any) => <span>{row.original.address}</span>,
      size: 200,
    },
    {
      id: "age",
      header: "Âge",
      cell: ({ row }: any) => <span>{calculerAge(row.original.dob)} ans</span>,
      size: 100,
    },
    {
      id: "gender",
      header: "Genre",
      cell: ({ row }: any) => {
        const gender = row.original.gender;
        const genderMap = {
          homme: {
            label: "Homme",
            class: "bg-primary-100 text-primary-800 border-primary-200",
          },
          femme: {
            label: "Femme",
            class: "bg-secondary-100 text-secondary-800 border-secondary-200",
          },
        };

        const genderConfig = genderMap[gender as keyof typeof genderMap] || {
          label: gender,
          class: "bg-gray-100 text-gray-800 border-gray-200",
        };

        return (
          <Badge
            variant="outline"
            className={`${genderConfig.class} font-medium capitalize`}
          >
            {genderConfig.label}
          </Badge>
        );
      },
      size: 120,
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const status = row.original.status;

        return status === "enabled" ? (
          <Status status="online">
            <StatusIndicator />
            Actif
          </Status>
        ) : (
          <Status status="offline">
            <StatusIndicator />
            Désactivé
          </Status>
        );
      },
      size: 120,
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const user = row.original;
        return loadingReset ? (
          <div className="w-full flex items-center justify-center ">
            <Spinner size={20} className="text-primary" />
          </div>
        ) : (
          <div>
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
                        <TeamCard userData={user} />
                      </CustomModal>
                    )
                  }
                  className="flex items-center gap-2 rounded-lg cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  Détail
                </DropdownMenuItem>
                {canReset && (
                  <DropdownMenuItem
                    onClick={() => send({ json: { email: user.email } })}
                    className="flex items-center gap-2 rounded-lg cursor-pointer"
                  >
                    <Mail className="mr-2 h-4 w-4" /> Réinitialisation du mot de
                    passe
                  </DropdownMenuItem>
                )}
                {canModify && (
                  <DropdownMenuItem
                    onClick={() =>
                      open(
                        <CustomModal>
                          <EquipeForm details={user} />
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
                      setUser(user);
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

  const exportEquipe = createExcelExporter(
    {
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      gender: "Genre",
      age: "Âge",
      status: "Statut",
      type: "Rôle",
      createdAt: "Date de création",
    },
    (user: UserDetail) => {
      const age = calculerAge(user.dob.toDateString());

      const formatStatus = () => {
        switch (user.status) {
          case "enabled":
            return "Actif";
          case "disabled":
            return "Désactivé";
          default:
            return user.status;
        }
      };

      const formatType = () => {
        switch (user.type) {
          case "admin":
            return "Administrateur";
          case "employe":
            return "Employé";
          case "accompanist":
            return "Accompagnateur";
          default:
            return user.type;
        }
      };

      return {
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender === "homme" ? "Homme" : "Femme",
        age: `${age} ans`,
        status: formatStatus(),
        type: formatType(),
        createdAt: format(new Date(user.createdAt), "dd MMM yyyy", {
          locale: fr,
        }),
      };
    },
    "membres_equipe",
    `Export_Equipe_${format(new Date(), "yyyyMMdd")}`
  );

  const onConfirmDelete = async () => {
    useDelete(
      { param: { teamId: user?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setUser(null);
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
        title={`${user?.name!}`}
      />
      <div className="min-h-screen    dark:from-emerald-950 dark:via-slate-900 dark:to-orange-950">
        {/* Header */}
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-emerald-200/50 dark:border-emerald-800/50">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-orange-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold p-4 bg-gradient-to-r from-emerald-700 via-orange-700 to-blue-700  bg-clip-text text-transparent sm:text-5xl">
                Employé(e)s , Accompagnateurs & Formateurs
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Générez les comptes des employé(e)s et accompagnateurs
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs defaultValue="employees" className="w-full ">
            <div className="w-full flex justify-end gap-5">
              <TabsList className="grid w-full max-w-lg   grid-cols-3  bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50">
                <TabsTrigger
                  value="employees"
                  className=" data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white flex items-center gap-2"
                >
                  <IdCardLanyard className="h-4 w-4" />
                  Employé(e)s
                </TabsTrigger>
                <TabsTrigger
                  value="accompagnements"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Accompagnateurs
                </TabsTrigger>
                <TabsTrigger
                  value="trainer"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white flex items-center gap-2"
                >
                  <Contact className="h-4 w-4" />
                  Formateurs
                </TabsTrigger>
              </TabsList>
              {canAdd && (
                <Button
                  onClick={() =>
                    open(
                      <CustomModal>
                        <EquipeForm />
                      </CustomModal>
                    )
                  }
                >
                  Enregistre un nouveau Utilisateurs
                </Button>
              )}
            </div>

            <TabsContent value="employees">
              <Card className=" p-0   dark:bg-slate-800/80 backdrop-blur-sm border-emerald-200/50 dark:border-emerald-800/50 shadow-lg">
                <CardHeader className=" rounded-t-lg p-5  bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-b border-emerald-200/30 dark:border-emerald-800/30">
                  <CardTitle className="text-2xl text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                      <IdCardLanyard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Liste des employé(e)s
                  </CardTitle>
                  <CardDescription className="text-emerald-700/80 dark:text-emerald-300/80">
                    Gere les donnees de vos employé(e)s
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable<UserDetail>
                    header={false}
                    data={employes}
                    columns={columns}
                    searchPlaceholder="Rechercher par nom ou date..."
                    searchField="name"
                    additionalSearchFields={["phone", "email", "status"]}
                    canAdd={false}
                    pageSize={10}
                    isPending={isPending}
                    exportFunction={exportEquipe}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accompagnements">
              <Card className=" p-0 dark:bg-slate-800/80 backdrop-blur-sm border-orange-200/50 dark:border-orange-800/50 shadow-lg">
                <CardHeader className=" rounded-t-lg p-5  bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-b border-orange-200/30 dark:border-orange-800/30">
                  <CardTitle className="  text-2xl text-orange-800 dark:text-orange-200 flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    List des accompagnateurs
                  </CardTitle>
                  <CardDescription className="text-orange-700/80 dark:text-orange-300/80">
                    Gérer les données de vos accompagnateurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable<UserDetail>
                    header={false}
                    data={accompanists}
                    columns={columns}
                    searchPlaceholder="Rechercher par nom ou date..."
                    searchField="name"
                    additionalSearchFields={["phone", "email", "status"]}
                    canAdd={false}
                    pageSize={10}
                    color="bg-orange-500"
                    isPending={isPending}
                    exportFunction={exportEquipe}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trainer">
              <Card className=" p-0 dark:bg-slate-800/80 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                <CardHeader className=" rounded-t-lg p-5  bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-blue-200/30 dark:border-blue-800/30">
                  <CardTitle className="  text-2xl text-blue-800 dark:text-blue-200 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Contact className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    List des Formateurs
                  </CardTitle>
                  <CardDescription className="text-blue-700/80 dark:text-blue-300/80">
                    Gérer les données de vos Formateurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable<UserDetail>
                    header={false}
                    data={trainers}
                    columns={columns}
                    searchPlaceholder="Rechercher par nom ou date..."
                    searchField="name"
                    additionalSearchFields={["phone", "email", "status"]}
                    canAdd={false}
                    pageSize={10}
                    color="bg-blue-500"
                    isPending={isPending}
                    exportFunction={exportEquipe}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};
