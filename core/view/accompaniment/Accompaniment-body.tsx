"use client";

import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { useRouter } from "next/navigation";
import { definePermissions } from "@/core/lib/utils";

export const AccompanimentBody = ({ permission }: PermissionProps) => {
  const { canAdd, canModify, canDelete } = useMemo(() => {
    return definePermissions(permission,"accompagnements");
  }, [permission]);

  const router = useRouter();

  const { open } = useModal();

  const { data, isPending } = useGetAccompaniments();
  const { mutate: useDelete, isPending: loading } = useDeletAccompaniment();

  const accompaniments = useMemo(() => data || [], [data]);
  const [acc, setAcc] = useState<Accompaniments | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const itemsPerPage = 10;

  // Filtrage selon le statut
  const filteredAccompaniments = accompaniments.filter((acc) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return acc.status === false;
    if (statusFilter === "completed") return acc.status === true;
    return true;
  });

  const activeAccompaniments = accompaniments.filter(
    (acc) => acc.status === false
  ).length;

  const completedAccompaniments = accompaniments.filter(
    (acc) => acc.status === true
  ).length;

  const totalPages = Math.ceil(filteredAccompaniments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccompaniments = filteredAccompaniments.slice(
    startIndex,
    endIndex
  );

  const getStatusColor = (status: boolean) => {
    return status
      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
      : "bg-green-100 text-green-800 hover:bg-green-200";
  };

  const getStatusText = (status: boolean) => {
    return status ? "Terminé" : "En cours";
  };

  // Reset pagination when filter changes
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const onConfirmDelete = async () => {
    useDelete(
      { param: { accId: acc?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setAcc(null);
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
        title={`${acc?.name!}`}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="shadow-sm border-b bg-gradient-to-br from-emerald-100 to-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des Accompagnements
                </h1>
                <p className="mt-2 text-gray-600">
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
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-lg"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Nouvel Accompagnement
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Accompagnements
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isPending ? (
                    <Spinner
                      variant="bars"
                      size={15}
                      className="text-primary"
                    />
                  ) : (
                    accompaniments.length
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2 depuis le mois dernier
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Cours</CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {isPending ? (
                    <Spinner
                      variant="bars"
                      size={15}
                      className="text-primary"
                    />
                  ) : (
                    activeAccompaniments
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Accompagnements actifs
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Terminés</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isPending ? (
                    <Spinner
                      variant="bars"
                      size={15}
                      className="text-primary"
                    />
                  ) : (
                    completedAccompaniments
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Accompagnements finalisés
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Liste des accompagnements */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Accompagnements Récents</CardTitle>
                  <CardDescription>
                    Voici la liste de tous vos accompagnements avec leurs
                    détails
                  </CardDescription>
                </div>

                {/* Filtre par statut */}
                <div className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4 text-gray-500" />
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                  >
                    <SelectTrigger className="w-[180px]">
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

            <CardContent>
              <div className="space-y-4">
                {currentAccompaniments.map((accompaniment) => (
                  <div
                    key={accompaniment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {accompaniment.name}
                        </h3>
                        <Badge className={getStatusColor(accompaniment.status)}>
                          {getStatusText(accompaniment.status)}
                        </Badge>

                        <Badge className="px-5 rounded">
                          {accompaniment.project.name}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{accompaniment.adresse}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4" />
                          <span>{accompaniment.phones.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          <span className="font-medium">
                            {accompaniment.budget.toLocaleString()}Fdj
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/accompagnements/${accompaniment.id}`)
                        }
                        variant="outline"
                        size="sm"
                      >
                        <NotepadTextIcon className="h-4 w-4 text-indigo-500" />
                      </Button>
                      {canModify && (
                        <Button
                          onClick={() =>
                            open(
                              <CustomModal>
                                <AccompanimentForm details={accompaniment} />
                              </CustomModal>
                            )
                          }
                          variant="outline"
                          size="sm"
                        >
                          <EditIcon className="h-4 w-4 text-green-500" />
                        </Button>
                      )}

                      {canDelete && (
                        <Button
                          onClick={() => {
                            setAcc(accompaniment);
                            setIsOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredAccompaniments.length > itemsPerPage && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-700">
                    Affichage de {startIndex + 1} à{" "}
                    {Math.min(endIndex, filteredAccompaniments.length)} sur{" "}
                    {filteredAccompaniments.length} accompagnements
                    {statusFilter !== "all" && (
                      <span className="text-emerald-600 font-medium">
                        {" "}
                        ({statusFilter === "active" ? "en cours" : "terminés"})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      Précédent
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : ""
                            }
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* État vide */}
              {isPending ? (
                <div className="w-full flex justify-center items-center">
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
                    <p className="text-gray-500 mb-4">
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
