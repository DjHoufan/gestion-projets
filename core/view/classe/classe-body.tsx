"use client";
import { DataTable } from "@/core/components/global/data-table";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { useDeletClasse, useGetClasses } from "@/core/hooks/use-classe";
import { ClasseDetail, PermissionProps } from "@/core/lib/types";
import { definePermissions } from "@/core/lib/utils";
import { useModal } from "@/core/providers/modal-provider";
import { ClasseForm } from "@/core/view/classe/classe-form";
import { format } from "date-fns";
import {
  Edit,
  LinkIcon,
  MoreHorizontal,
  NotebookText,
  SquareUser,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@//core/components/ui/card";
import {
  GraduationCap,
  UserCheck,
  Users,
  UsersRound,
  BarChart3,
} from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const chartData = [
  { name: "C1", value: 194, fill: "#3b82f6" },
  { name: "C2", value: 223, fill: "#8b5cf6" },
  { name: "C3", value: 205, fill: "#14b8a6" },
  { name: "C4", value: 258, fill: "#f43f5e" },
  { name: "C5", value: 120, fill: "#a855f7" },
];

const stats = [
  {
    title: "Total des Bénéficiaires",
    value: "10001",
    icon: Users,
    description: "Personnes formées",
    colorBorder: "border-blue-200",
    colorBg: "bg-gradient-to-br from-blue-50 to-blue-100",
    colorTitle: "text-blue-900",
    colorIconBg: "bg-blue-100",
    colorIcon: "text-blue-600",
    colorValue: "text-blue-700",
    colorDesc: "text-blue-600",
  },
  {
    title: "Nombre de Classes",
    value: "36",
    icon: GraduationCap,
    description: "Classes actives",
    colorBorder: "border-violet-200",
    colorBg: "bg-gradient-to-br from-violet-50 to-violet-100",
    colorTitle: "text-violet-900",
    colorIconBg: "bg-violet-100",
    colorIcon: "text-violet-600",
    colorValue: "text-violet-700",
    colorDesc: "text-violet-600",
  },
  {
    title: "Nombre de Formateurs",
    value: "46",
    icon: UserCheck,
    description: "Formateurs qualifiés",
    colorBorder: "border-teal-200",
    colorBg: "bg-gradient-to-br from-teal-50 to-teal-100",
    colorTitle: "text-teal-900",
    colorIconBg: "bg-teal-100",
    colorIcon: "text-teal-600",
    colorValue: "text-teal-700",
    colorDesc: "text-teal-600",
  },
  {
    title: "Nombre de Mentors",
    value: "5",
    icon: UsersRound,
    description: "Mentors dédiés",
    colorBorder: "border-rose-200",
    colorBg: "bg-gradient-to-br from-rose-50 to-rose-100",
    colorTitle: "text-rose-900",
    colorIconBg: "bg-rose-100",
    colorIcon: "text-rose-600",
    colorValue: "text-rose-700",
    colorDesc: "text-rose-600",
  },
];

const ClasseBody = ({ permission }: PermissionProps) => {
  const { canAdd, canModify, canDelete, canDetails } = useMemo(() => {
    return definePermissions(permission, "classes");
  }, [permission]);

  const { data: classes, isPending } = useGetClasses();
  const [classe, setclasse] = useState<ClasseDetail | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: useDelete, isPending: loading } = useDeletClasse();

  const router = useRouter();
  const { open } = useModal();

  const columns = [
    {
      header: "Classe",
      accessorKey: "name",
      cell: ({ row }: any) => (
        <div className="flex justify-center items-center  *:">
          <span className="block uppercase w-5/6  ">{row.original.name}</span>
        </div>
      ),
    },

    {
      id: "user",
      header: "Formateur/Formatrice",
      cell: ({ row }: any) => {
        const user = row.original.user;
        const gender = user.gender.toLowerCase();
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
          label: user.gender,
          class: "bg-gray-100 text-gray-800 border-gray-200",
        };
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
            <div className="">
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
    },

    {
      id: "project",
      header: "Projet",
      cell: ({ row }: any) => {
        const project = row.original.project;
        return (
          <div className="flex flex-col justify-center gap-1">
            <p className="block font-medium">{project.name}</p>
            <p className="block text-xs text-gray-500">
              <span className="pr-2"> {project.local} •</span>
              {format(new Date(project.startDate), "dd/MM/yyyy")} -{" "}
              {format(new Date(project.endDate), "dd/MM/yyyy")}
            </p>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const item = row.original;
        return (
          <>
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

                {canDetails && (
                  <DropdownMenuItem
                    onClick={() => router.push(`/classes/${item.id}`)}
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
                          <ClasseForm details={item} />
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
                      setclasse(item);
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
          </>
        );
      },
    },
  ];

  const onConfirmDelete = async () => {
    useDelete(
      { param: { cId: classe?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setclasse(null);
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
        title={`${classe?.name!}`}
      />

      <div className="space-y-4 container mx-auto p-5">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`${stat.colorBorder} ${stat.colorBg} shadow-lg hover:shadow-xl transition-shadow duration-300`}
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

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-purple-900">
              Informations Complémentaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-white/60 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-500 p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    Apprenants par Classe
                  </p>
                  <p className="text-xs text-purple-600">Moyenne par classe</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-purple-700">28</div>
            </div>
          </CardContent>
        </Card>

        {/* Graphique des Cohortes */}
        <Card className="border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-fuchsia-900">
              <BarChart3 className="h-5 w-5 text-fuchsia-600" />
              Répartition par Cohorte
            </CardTitle>
            <CardDescription className="text-fuchsia-700">
              Nombre de bénéficiaires par cohorte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                <XAxis
                  dataKey="name"
                  stroke="#701a75"
                  tick={{ fill: "#701a75", fontSize: 14, fontWeight: 600 }}
                />
                <YAxis
                  stroke="#701a75"
                  tick={{ fill: "#701a75", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fdf4ff",
                    border: "2px solid #d946ef",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                  labelStyle={{ color: "#701a75" }}
                  itemStyle={{ color: "#a21caf" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Stats rapides */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="bg-white/60 rounded-lg p-3 border border-fuchsia-200 text-center"
                >
                  <p className="text-xs font-medium text-fuchsia-600">
                    {item.name}
                  </p>
                  <p className="text-2xl font-bold text-fuchsia-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 p-4 bg-fuchsia-600 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  Total Bénéficiaires
                </span>
                <span className="text-3xl font-black text-white">
                  {chartData.reduce((sum, item) => sum + item.value, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <DataTable<ClasseDetail>
          data={classes ? classes : []}
          columns={columns}
          searchPlaceholder="Rechercher par nom ou date..."
          searchField="name"
          additionalSearchFields={["name", "user.name", "project.name"]}
          title="des classes"
          description="Gérez les informations et les comptes des classes"
          canAdd={canAdd}
          onAddButtonClick={() =>
            open(
              <CustomModal>
                <ClasseForm />
              </CustomModal>
            )
          }
          pageSize={10}
          addButtonText="Enregistre une nouvelle classe"
          isPending={isPending}
          filters={[
            {
              label: "Filtrer par projet",
              field: "project.name",
              type: "select",
              icon: LinkIcon,
            },
            {
              label: "Filtrer par Formateur/trice",
              field: "user.name",
              type: "select",
              icon: SquareUser,
            },
          ]}
        />
      </div>
    </>
  );
};

export default ClasseBody;
