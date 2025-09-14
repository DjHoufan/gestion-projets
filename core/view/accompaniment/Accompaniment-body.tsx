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
  PlusIcon,
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  TrendingUpIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  TrashIcon,
  EditIcon,
  NotepadTextIcon,
  FilterIcon,
  Banknote,
  MoreVerticalIcon,
  LucideIcon,
  LinkIcon,
  ChevronsLeftRightEllipsis,
  UserSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { useRouter } from "next/navigation";
import { definePermissions } from "@/core/lib/utils";
import { Project } from "@prisma/client";
import { DataTable } from "@/core/components/global/data-table";

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
        <div className="shadow-sm border-b bg-gradient-to-br from-emerald-100 to-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Gestion des Accompagnements
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Gérez et suivez tous vos accompagnements en un seul endroit
                </p>
              </div>
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
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Statistiques responsives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <StatsCard
              title="Total Accompagnements"
              value={data?.length!}
              description="+2 depuis le mois dernier"
              icon={UsersIcon}
              isPending={isPending}
            />
            <StatsCard
              title="En Cours"
              value={activeCount}
              description="Accompagnements actifs"
              icon={TrendingUpIcon}
              isPending={isPending}
              className="text-emerald-600"
            />
            <StatsCard
              title="Terminés"
              value={completedCount}
              description="Accompagnements finalisés"
              icon={CalendarIcon}
              isPending={isPending}
              className="text-blue-600"
            />
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
