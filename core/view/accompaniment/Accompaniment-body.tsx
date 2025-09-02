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

interface MobileActionsProps {
  accompaniment: AccompagnementProps;
  canModify: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

interface AccompanimentCardProps {
  accompaniment: AccompagnementProps;
  canModify: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

interface ResponsivePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  statusFilter: string;
}

interface PaginationData {
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentAccompaniments: AccompagnementProps[];
}

interface FilteredData {
  filteredAccompaniments: AccompagnementProps[];
  activeCount: number;
  completedCount: number;
}

type StatusFilter = "all" | "active" | "completed";

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

// Composant pour les actions mobiles
const MobileActions: React.FC<MobileActionsProps> = ({
  accompaniment,
  canModify,
  canDelete,
  onEdit,
  onDelete,
  onView,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">
        <MoreVerticalIcon className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={onView}>
        <NotepadTextIcon className="h-4 w-4 mr-2 text-indigo-500" />
        Voir détails
      </DropdownMenuItem>
      {canModify && (
        <DropdownMenuItem onClick={onEdit}>
          <EditIcon className="h-4 w-4 mr-2 text-green-500" />
          Modifier
        </DropdownMenuItem>
      )}
      {canDelete && (
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <TrashIcon className="h-4 w-4 mr-2" />
          Supprimer
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

// Composant pour une carte d'accompagnement
const AccompanimentCard: React.FC<AccompanimentCardProps> = ({
  accompaniment,
  canModify,
  canDelete,
  onEdit,
  onDelete,
  onView,
}) => {
  const getStatusColor = (status: boolean): string => {
    return status
      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
      : "bg-green-100 text-green-800 hover:bg-green-200";
  };

  const getStatusText = (status: boolean): string => {
    return status ? "Terminé" : "En cours";
  };

  return (
    <div className="border rounded-lg hover:bg-gray-50 transition-colors overflow-hidden">
      {/* Mobile Layout */}
      <div className="block md:hidden p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {accompaniment.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge className={getStatusColor(accompaniment.status)}>
                {getStatusText(accompaniment.status)}
              </Badge>
              <Badge className="px-2 text-xs truncate max-w-[120px]">
                {accompaniment.project.name}
              </Badge>
            </div>
          </div>
          <MobileActions
            accompaniment={accompaniment}
            canModify={canModify}
            canDelete={canDelete}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="break-words">{accompaniment.adresse}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{accompaniment.phones.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">
              {accompaniment.budget.toLocaleString()} Fdj
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="font-semibold text-lg">{accompaniment.name}</h3>
            <Badge className={getStatusColor(accompaniment.status)}>
              {getStatusText(accompaniment.status)}
            </Badge>
            <Badge className="px-3 rounded">{accompaniment.project.name}</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 min-w-0">
              <MapPinIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{accompaniment.adresse}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <PhoneIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {accompaniment.phones.join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">
                {accompaniment.budget.toLocaleString()} Fdj
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            onClick={onView}
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <NotepadTextIcon className="h-4 w-4 text-indigo-500" />
          </Button>
          {canModify && (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <EditIcon className="h-4 w-4 text-green-500" />
            </Button>
          )}
          {canDelete && (
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <TrashIcon className="h-4 w-4 text-red-500" />
            </Button>
          )}
          {/* Menu mobile pour écrans moyens */}
          <div className="sm:hidden">
            <MobileActions
              accompaniment={accompaniment}
              canModify={canModify}
              canDelete={canDelete}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagination responsive
const ResponsivePagination: React.FC<ResponsivePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
  statusFilter,
}) => {
  const getVisiblePages = (): number[] => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t gap-4">
      <div className="text-sm text-gray-700 text-center sm:text-left">
        Affichage de {startIndex + 1} à {Math.min(endIndex, totalItems)} sur{" "}
        {totalItems} accompagnements
        {statusFilter !== "all" && (
          <span className="text-emerald-600 font-medium block sm:inline">
            {" "}
            ({statusFilter === "active" ? "en cours" : "terminés"})
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 sm:px-3"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Précédent</span>
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {getVisiblePages().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={
                currentPage === page
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : ""
              }
            >
              {page}
            </Button>
          ))}
        </div>

        {/* Pagination mobile simplifiée */}
        <div className="sm:hidden text-sm text-gray-600 px-2">
          {currentPage} / {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-3"
        >
          <span className="hidden sm:inline mr-1">Suivant</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

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

  const accompaniments: AccompagnementProps[] = useMemo(
    () => data || [],
    [data]
  );
  const [acc, setAcc] = useState<AccompagnementProps | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const itemsPerPage: number = 10;

  // Calculs optimisés avec useMemo
  const { filteredAccompaniments, activeCount, completedCount }: FilteredData =
    useMemo(() => {
      const filtered = accompaniments.filter((acc) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "active") return acc.status === false;
        if (statusFilter === "completed") return acc.status === true;
        return true;
      });

      const active = accompaniments.filter(
        (acc) => acc.status === false
      ).length;
      const completed = accompaniments.filter(
        (acc) => acc.status === true
      ).length;

      return {
        filteredAccompaniments: filtered,
        activeCount: active,
        completedCount: completed,
      };
    }, [accompaniments, statusFilter]);

  const paginationData: PaginationData = useMemo(() => {
    const totalPages: number = Math.ceil(
      filteredAccompaniments.length / itemsPerPage
    );
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const endIndex: number = startIndex + itemsPerPage;
    const currentAccompaniments: AccompagnementProps[] =
      filteredAccompaniments.slice(startIndex, endIndex);

    return { totalPages, startIndex, endIndex, currentAccompaniments };
  }, [filteredAccompaniments, currentPage, itemsPerPage]);

  // Callbacks optimisés
  const handleStatusFilterChange = useCallback((value: StatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(page);
  }, []);

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

  const handleDelete = useCallback((accompaniment: AccompagnementProps): void => {
    setAcc(accompaniment);
    setIsOpen(true);
  }, []);

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
              value={accompaniments.length}
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
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="min-w-0">
                  <CardTitle className="text-lg sm:text-xl">
                    Accompagnements Récents
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Voici la liste de tous vos accompagnements avec leurs
                    détails
                  </CardDescription>
                </div>

                {/* Filtre par statut */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <FilterIcon className="h-4 w-4 text-gray-500" />
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">En cours</SelectItem>
                      <SelectItem value="completed">Terminés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3 lg:space-y-4">
                {paginationData.currentAccompaniments.map((accompaniment) => (
                  <AccompanimentCard
                    key={accompaniment.id}
                    accompaniment={accompaniment}
                    canModify={canModify}
                    canDelete={canDelete}
                    onEdit={() => handleEdit(accompaniment)}
                    onDelete={() => handleDelete(accompaniment)}
                    onView={() => handleView(accompaniment)}
                  />
                ))}
              </div>

              {/* Pagination responsive */}
              {filteredAccompaniments.length > itemsPerPage && (
                <ResponsivePagination
                  currentPage={currentPage}
                  totalPages={paginationData.totalPages}
                  onPageChange={handlePageChange}
                  startIndex={paginationData.startIndex}
                  endIndex={paginationData.endIndex}
                  totalItems={filteredAccompaniments.length}
                  statusFilter={statusFilter}
                />
              )}

              {/* État vide */}
              {isPending ? (
                <div className="w-full flex justify-center items-center py-12">
                  <Spinner variant="bars" size={60} className="text-primary" />
                </div>
              ) : (
                filteredAccompaniments.length === 0 && (
                  <div className="text-center py-12">
                    <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {statusFilter === "all"
                        ? "Aucun accompagnement"
                        : `Aucun accompagnement ${
                            statusFilter === "active" ? "en cours" : "terminé"
                          }`}
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                      {statusFilter === "all"
                        ? "Commencez par créer votre premier accompagnement"
                        : "Essayez de changer le filtre ou créez un nouvel accompagnement"}
                    </p>
                    {canAdd && (
                      <Button
                        onClick={() =>
                          open(
                            <CustomModal>
                              <AccompanimentForm />
                            </CustomModal>
                          )
                        }
                        className="w-full sm:w-auto"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Créer un accompagnement
                      </Button>
                    )}
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
