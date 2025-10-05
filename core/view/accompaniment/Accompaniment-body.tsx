"use client";

import { useMemo, useState, useCallback } from "react";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";

import {
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  TrendingUpIcon,
  CalendarIcon,
  SparklesIcon,
  TrashIcon,
  EditIcon,
  NotepadTextIcon,
  Banknote,
  LucideIcon,
  LinkIcon,
  ChevronsLeftRightEllipsis,
  UserSquare,
} from "lucide-react";

import {
  useDeletAccompaniment,
  useGetAccompaniments,
} from "@/core/hooks/use-accompaniment";
import { useModal } from "@/core/providers/modal-provider";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { AccompanimentForm } from "@/core/view/accompaniment/accompaniment-form";
import { Accompaniments, PermissionProps } from "@/core/lib/types";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import { Spinner } from "@/core/components/ui/spinner";

import { useRouter } from "next/navigation";
import { definePermissions } from "@/core/lib/utils";
import { Project } from "@prisma/client";
import { DataTable } from "@/core/components/global/data-table";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/core/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Users, TrendingUp, CheckCircle2, UserCheck } from "lucide-react";

const chartData = [
  {
    name: "C1",
    value: 17.44,
    label: "94/541",
    percentage: "17.44%",
    fill: "#10b981",
  },
  { name: "C2", value: 0, label: "0/541", percentage: "0%", fill: "#34d399" },
  { name: "C3", value: 0, label: "0/541", percentage: "0%", fill: "#6ee7b7" },
  { name: "C4", value: 0, label: "0/541", percentage: "0%", fill: "#a7f3d0" },
  { name: "C5", value: 0, label: "0/541", percentage: "0%", fill: "#d1fae5" },
];

type AccompagnementProps = Accompaniments & {
  project: Project;
};

// Types
interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  isPending: boolean;
  className?: string;
}

interface FilteredData {
  activeCount: number;
  completedCount: number;
}

// Composant pour les statistiques
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  isPending,
  className = "",
}) => (
  <Card className={`hover:shadow-lg transition-all duration-200 ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {isPending ? (
          <Spinner variant="bars" size={15} className="text-primary" />
        ) : (
          value
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export const AccompanimentBody: React.FC<PermissionProps> = ({
  permission,
}) => {
  const { canAdd, canModify, canDelete } = useMemo(() => {
    return definePermissions(permission, "accompagnements");
  }, [permission]);

  const router = useRouter();
  const { open } = useModal();

  const { data, isPending } = useGetAccompaniments();
  const { mutate: useDelete, isPending: loading } = useDeletAccompaniment();

  const [acc, setAcc] = useState<AccompagnementProps | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Calculs optimisés avec useMemo
  const { activeCount, completedCount }: FilteredData = useMemo(() => {
    if (!data) {
      return {
        activeCount: 0,
        completedCount: 0,
      };
    }
    const active = data.filter((acc) => acc.status === false).length;
    const completed = data.filter((acc) => acc.status === true).length;

    return {
      activeCount: active,
      completedCount: completed,
    };
  }, [data]);

  const handleEdit = useCallback(
    (accompaniment: AccompagnementProps): void => {
      open(
        <CustomModal>
          <AccompanimentForm details={accompaniment} />
        </CustomModal>
      );
    },
    [open]
  );

  const handleDelete = useCallback(
    (accompaniment: AccompagnementProps): void => {
      setAcc(accompaniment);
      setIsOpen(true);
    },
    []
  );

  const handleView = useCallback(
    (accompaniment: AccompagnementProps): void => {
      router.push(`/accompagnements/${accompaniment.id}`);
    },
    [router]
  );

  const onConfirmDelete = useCallback(async (): Promise<void> => {
    if (!acc?.id) return;

    useDelete(
      { param: { accId: acc.id } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setAcc(null);
        },
      }
    );
  }, [acc, useDelete]);

  const getStatusColor = (status: boolean): string => {
    return status
      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
      : "bg-green-100 text-green-800 hover:bg-green-200";
  };

  const getStatusText = (status: boolean): string => {
    return status ? "Terminé" : "En cours";
  };

  const columns = [
    {
      id: "accompaniment",
      header: "Accompagnement",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-semibold text-lg">{accompaniment.name}</h3>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <MapPinIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{accompaniment.adresse}</span>
            </div>
          </div>
        );
      },
      size: 300,
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const accompaniment = row.original;

        return (
          <Badge className={getStatusColor(accompaniment.status)}>
            {getStatusText(accompaniment.status)}
          </Badge>
        );
      },
    },
    {
      id: "Accompagnateur",
      header: "Accompagnateur",
      cell: ({ row }: any) => {
        const accompaniment = row.original;

        return (
          <div className="flex items-center gap-2 min-w-0">
            <UserSquare className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate">{accompaniment.users.name}</span>
          </div>
        );
      },
    },
    {
      id: "project",
      header: "Projet",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <Badge variant="outline" className="px-3 rounded">
            {accompaniment.project.name}
          </Badge>
        );
      },
      size: 150,
    },
    {
      id: "contact",
      header: "Contact",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <div className="flex items-center gap-2 min-w-0">
            <PhoneIcon className="h-4 w-4 flex-shrink-0  text-primary" />
            <span className="truncate">{accompaniment.phones.join(", ")}</span>
          </div>
        );
      },
      size: 180,
    },
    {
      id: "budget",
      header: "Budget",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 flex-shrink-0  text-primary" />
            <span className="font-medium">
              {accompaniment.budget.toLocaleString()} Fdj
            </span>
          </div>
        );
      },
      size: 130,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const accompaniment = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => handleView(accompaniment)}
              variant="outline"
              size="sm"
            >
              <NotepadTextIcon className="h-4 w-4 text-indigo-500" />
            </Button>
            {canModify && (
              <Button
                onClick={() => handleEdit(accompaniment)}
                variant="outline"
                size="sm"
              >
                <EditIcon className="h-4 w-4 text-green-500" />
              </Button>
            )}
            {canDelete && (
              <Button
                onClick={() => handleDelete(accompaniment)}
                variant="outline"
                size="sm"
              >
                <TrashIcon className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        );
      },
      size: 180,
    },
  ];

  return (
    <>
      <DeleteConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
        title={acc?.name || ""}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header responsive */}

        <div className=" px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className=" space-y-6 mb-5">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(180deg,#064e3b_0%,#065f46_45%,#047857_100%)]">
                  Tableau de Bord AGR
                </h1>
                <p className="text-emerald-700">
                  Statistiques et suivi des activités
                </p>
              </div>

              <div className="flex justify-between items-center gap-5">
                {canAdd && (
                  <Button
                   onClick={() =>
                    open(
                      <CustomModal>
                        <AccompanimentForm />
                      </CustomModal>
                    )
                  }
                    className="bg-emerald-600 hover:bg-emerald-700 shadow-lg flex-shrink-0 w-full sm:w-auto"
                  >
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    <span className="sm:inline">Nouvel Accompagnement</span>
                  </Button>
                )}
                <Button
                    onClick={() => router.push("accompagnements/chronogramme")}

                  
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-lg flex-shrink-0 w-full sm:w-auto"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  <span className="sm:inline">Chronogramme</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">
                    Nombre d'AGR
                  </CardTitle>
                  <Users className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-6xl font-black text-purple-700">541</div>
                  <p className="text-sm font-semibold text-purple-600">
                    Total des AGR
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-900">
                    AGR Démarrés
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold text-orange-700">299</div>
                  <div className="pt-2 border-t border-orange-200">
                    <p className="text-xs text-orange-600 mb-1">de 541 AGR</p>
                    <div className="text-4xl font-black text-orange-700">
                      55.47%
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">
                    AGR Suivis
                  </CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold text-blue-700">94</div>
                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-xs text-blue-600 mb-1">de 541 AGR</p>
                    <div className="text-4xl font-black text-blue-700">
                      17.44%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card
                className="border-emerald-300/50 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #064e3b 0%, #065f46 45%, #047857 100%)",
                }}
              >
                <CardHeader className="border-b border-emerald-400/20 pb-4">
                  <CardTitle className="text-2xl font-bold text-white">
                    Équipe d'Accompagnement
                  </CardTitle>
                  <CardDescription className="text-emerald-100">
                    Ressources humaines déployées
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    {/* Accompagnateurs */}
                    <div className="bg-emerald-800/40 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/20 hover:border-emerald-400/40 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-emerald-100">
                          Accompagnateurs
                        </span>
                        <div className="px-3 py-1 bg-emerald-500 rounded-full">
                          <span className="text-xs font-bold text-white">
                            90.4%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-black text-white">
                          104
                        </span>
                        <span className="text-emerald-200 text-sm mb-2">
                          agents
                        </span>
                      </div>
                    </div>

                    {/* Superviseurs */}
                    <div className="bg-emerald-800/40 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/20 hover:border-emerald-400/40 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-emerald-100">
                          Superviseurs
                        </span>
                        <div className="px-3 py-1 bg-emerald-500 rounded-full">
                          <span className="text-xs font-bold text-white">
                            9.6%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-black text-white">
                          11
                        </span>
                        <span className="text-emerald-200 text-sm mb-2">
                          agents
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-5 shadow-xl border border-emerald-400/30">
                      <div className="text-center space-y-2">
                        <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">
                          Total Équipe
                        </p>
                        <p className="text-6xl font-black text-white">115</p>
                        <p className="text-emerald-200 text-xs">
                          Professionnels mobilisés
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="border-emerald-300/50 shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  background:
                    "linear-gradient(180deg, #064e3b 0%, #065f46 45%, #047857 100%)",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-white">
                    Répartition par Cohorte
                  </CardTitle>
                  <CardDescription className="text-emerald-100">
                    Pourcentage de suivi (sur 541)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Pourcentage",
                        color: "hsl(160, 84%, 39%)",
                      },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255, 255, 255, 0.1)"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="#ffffff"
                          tick={{ fill: "#ffffff" }}
                        />
                        <YAxis
                          stroke="#ffffff"
                          tick={{ fill: "#ffffff" }}
                          label={{
                            value: "%",
                            angle: -90,
                            position: "insideLeft",
                            fill: "#ffffff",
                          }}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                          cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                        />
                        <Bar
                          dataKey="value"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={60}
                          fill="#10b981"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="mt-4 grid grid-cols-5 gap-2 text-center">
                    {chartData.map((item) => (
                      <div key={item.name} className="space-y-1">
                        <p className="text-xs font-medium text-emerald-100">
                          {item.name}
                        </p>
                        <p className="text-lg font-bold text-white">
                          {item.percentage}
                        </p>
                        <p className="text-xs text-emerald-200">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Liste des accompagnements */}
          <Card className="shadow-sm">
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3 lg:space-y-4">
                <DataTable<AccompagnementProps>
                  data={data ? data : []}
                  columns={columns}
                  searchPlaceholder="Rechercher par nom ou date..."
                  searchField="name"
                  additionalSearchFields={["name", "phone", "users.name", "st"]}
                  header={false}
                  canAdd={false}
                  pageSize={10}
                  addButtonText="Enregistre un nouveau bénéficiaire"
                  isPending={isPending}
                  filters={[
                    {
                      label: "Filtrer par projet",
                      field: "project.name",
                      type: "select",
                      icon: LinkIcon,
                    },
                    {
                      label: "Filtrer par statut",
                      field: "st",
                      type: "select",
                      icon: ChevronsLeftRightEllipsis,
                    },
                    {
                      label: "Filtrer par Accompagnateur",
                      field: "users.name",
                      type: "select",
                      icon: UserSquare,
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
