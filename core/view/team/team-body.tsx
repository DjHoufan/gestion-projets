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
import {
  Users,
  IdCardLanyard,
  Edit,
  Contact,
  Mail,
  UserCheck,
  Shield,
  Award,
  Briefcase,
  LucideIcon,
} from "lucide-react";
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
import { useRouter } from "next/navigation";

interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  colorBorder: string;
  colorBg: string;
  colorTitle: string;
  colorIconBg: string;
  colorIcon: string;
  colorValue: string;
  colorDesc: string;
}

const STATS_DATA: StatItem[] = [
  {
    title: "Formateurs/rices",
    value: "46",
    icon: Award,
    description: "Experts formateurs/rices",
    colorBorder: "border-indigo-200",
    colorBg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    colorTitle: "text-indigo-900",
    colorIconBg: "bg-indigo-100",
    colorIcon: "text-indigo-600",
    colorValue: "text-indigo-700",
    colorDesc: "text-indigo-600",
  },
  {
    title: "Accompagnateurs/trices",
    value: "105",
    icon: UserCheck,
    description: "Personnel d'accompagnement",
    colorBorder: "border-cyan-200",
    colorBg: "bg-gradient-to-br from-cyan-50 to-cyan-100",
    colorTitle: "text-cyan-900",
    colorIconBg: "bg-cyan-100",
    colorIcon: "text-cyan-600",
    colorValue: "text-cyan-700",
    colorDesc: "text-cyan-600",
  },
  {
    title: "Superviseurs",
    value: "11",
    icon: Shield,
    description: "Équipe de supervision",
    colorBorder: "border-amber-200",
    colorBg: "bg-gradient-to-br from-amber-50 to-amber-100",
    colorTitle: "text-amber-900",
    colorIconBg: "bg-amber-100",
    colorIcon: "text-amber-600",
    colorValue: "text-amber-700",
    colorDesc: "text-amber-600",
  },
  {
    title: "Mentors",
    value: "5",
    icon: Users,
    description: "Mentors dédiés",
    colorBorder: "border-rose-200",
    colorBg: "bg-gradient-to-br from-rose-50 to-rose-100",
    colorTitle: "text-rose-900",
    colorIconBg: "bg-rose-100",
    colorIcon: "text-rose-600",
    colorValue: "text-rose-700",
    colorDesc: "text-rose-600",
  },
  {
    title: "Employés",
    value: "6",
    icon: Briefcase,
    description: "Personnel administratif",
    colorBorder: "border-violet-200",
    colorBg: "bg-gradient-to-br from-violet-50 to-violet-100",
    colorTitle: "text-violet-900",
    colorIconBg: "bg-violet-100",
    colorIcon: "text-violet-600",
    colorValue: "text-violet-700",
    colorDesc: "text-violet-600",
  },
];

export const EquipeBody = ({ permission }: PermissionProps) => {
  const route = useRouter();
  const { canAdd, canModify, canDelete, canReset } = useMemo(() => {
    return definePermissions(permission, "equipe");
  }, [permission]);

  const { open } = useModal();

  const { data, isPending } = useGetTeam();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserDetail | null>(null);
  const { mutate: useDelete, isPending: loading } = useDeletTeam();

  const { mutate: send, isPending: loadingReset } = useSendResetPassword();

  const [employes, accompanists, trainers, superviseurs] = useMemo(() => {
    if (!data) return [[], [], [], []];

    const e = [];
    const a = [];
    const t = [];
    const p = [];

    for (const item of data) {
      if (item.type === "employe") e.push(item);
      else if (item.type === "accompanist") a.push(item);
      else if (item.type === "trainer") t.push(item);
      else if (item.type === "superviseur") p.push(item);
    }

    return [e, a, t, p];
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
                  Voir
                </DropdownMenuItem>
                {user.type === "accompanist" && (
                  <DropdownMenuItem
                    onClick={() => route.push(`/equipes/${user.id}`)}
                    className="flex items-center gap-2 rounded-lg cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    Détail
                  </DropdownMenuItem>
                )}

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
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-emerald-200/50 dark:border-emerald-800/50">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-orange-500/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Équipe HOUFAN
              </h1>
              <p className="text-xl text-slate-600">
                Ressources Humaines du Programme
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {STATS_DATA.map((stat: StatItem, index: number) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className={`${stat.colorBorder} ${stat.colorBg}  hover:shadow-xl transition-all duration-300 hover:scale-105`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle
                        className={`text-sm font-medium ${stat.colorTitle}`}
                      >
                        {stat.title}
                      </CardTitle>
                      <div className={`rounded-full ${stat.colorIconBg} p-2`}>
                        <Icon className={`h-5 w-5 ${stat.colorIcon}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className={`text-4xl font-bold ${stat.colorValue}`}>
                        {stat.value}
                      </div>
                      <p className={`text-sm font-semibold ${stat.colorDesc}`}>
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Total Summary Card */}
            <Card className="mt-5 border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 ">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Total Équipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                      173
                    </p>
                    <p className="text-lg text-slate-600 mt-2">
                      Membres de l'équipe au total
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow">
                      <p className="text-2xl font-bold text-cyan-600">105</p>
                      <p className="text-xs text-slate-600">Accompagnateurs</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow">
                      <p className="text-2xl font-bold text-indigo-600">46</p>
                      <p className="text-xs text-slate-600">Formateurs</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow">
                      <p className="text-2xl font-bold text-amber-600">11</p>
                      <p className="text-xs text-slate-600">Superviseurs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs defaultValue="employees" className="w-full ">
            <div className="w-full flex justify-end gap-5">
              <TabsList className="grid w-full max-w-2xl   grid-cols-4  bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50">
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
                <TabsTrigger
                  value="Superviseur"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white flex items-center gap-2"
                >
                  <Contact className="h-4 w-4" />
                  Superviseur
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

            <TabsContent value="Superviseur">
              <Card className=" p-0 dark:bg-slate-800/80 backdrop-blur-sm border-fuchsia-200/50 dark:border-fuchsia-800/50 shadow-lg">
                <CardHeader className=" rounded-t-lg p-5  bg-gradient-to-r from-fuchsia-500/10 to-fuchsia-600/10 border-b border-fuchsia-200/30 dark:border-fuchsia-800/30">
                  <CardTitle className="  text-2xl text-fuchsia-800 dark:text-fuchsia-200 flex items-center gap-3">
                    <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-900/50 rounded-lg">
                      <Contact className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400" />
                    </div>
                    List des Superviseurs
                  </CardTitle>
                  <CardDescription className="text-fuchsia-700/80 dark:text-fuchsia-300/80">
                    Gérer les données de vos superviseurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable<UserDetail>
                    header={false}
                    data={superviseurs}
                    columns={columns}
                    searchPlaceholder="Rechercher par nom ou date..."
                    searchField="name"
                    additionalSearchFields={["phone", "email", "status"]}
                    canAdd={false}
                    pageSize={10}
                    color="bg-fuchsia-500"
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
