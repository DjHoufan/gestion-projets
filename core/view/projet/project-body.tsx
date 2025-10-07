"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Edit,
  Trash,
  GanttChart,
  Eye,
  FolderKanban,
  X,
  Users,
  UserX,
  Calendar,
  GraduationCap,
  MapPin,
  Briefcase,
  Clock,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Heart,
} from "lucide-react";

import { StatsCards } from "@/core/view/projet/stats-cards";
import { ProjectsGrid } from "@/core/view/projet/projects-grid";

import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/core/components/ui/toggle-group";

import {
  calculateDuration,
  cn,
  definePermissions,
  getProjectStatus,
} from "@/core/lib/utils";
import { useModal } from "@/core/providers/modal-provider";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { ProjectForm } from "./project-form";
import { useDeleteProjet, useGetPojet } from "@/core/hooks/use-projet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { Badge } from "@/core/components/ui/badge";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  createExcelExporter,
  DataTable,
} from "@/core/components/global/data-table";
import { PermissionProps, ProjectDetail } from "@/core/lib/types";
import { DeleteConfirmation } from "../../components/global/delete-confirmation";
import { GranttView } from "@/core/view/projet/gantt-view";
import { useRouter } from "next/navigation";
import { useSelectProject } from "@/core/hooks/store";
import SearchSelect from "@/core/components/global/search_select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import Main2 from "@/core/view/projet/new-gant";

export const ProjectBody = ({ permission }: PermissionProps) => {
  const { canAdd, canModify, canDelete, canDetails } = useMemo(() => {
    return definePermissions(permission, "acces");
  }, [permission]);

  const project = useSelectProject();

  const { open } = useModal();
  const { data: projects, isPending } = useGetPojet();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table" | "gantt">("grid");

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (isPending || !projects) return [];

    if (!searchQuery.trim()) return projects;

    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery, isPending]);

  const columns = [
    {
      id: "name",
      header: "Nom du projet",
      cell: ({ row }: any) => (
        <span className="font-medium text-emerald-900">
          {row.original.name}
        </span>
      ),
    },
    {
      id: "local", // cohérence : même nom que la propriété
      header: "Local",
      cell: ({ row }: any) => (
        <span className="font-medium text-emerald-900">
          {row.original.local}
        </span>
      ),
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const status = getProjectStatus(row.original);
        return (
          <Badge className={cn("text-xs font-medium border", status.color)}>
            {status.label}
          </Badge>
        );
      },
    },
    {
      id: "startDate",
      header: "Date de début",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 text-emerald-700">
          <Calendar className="h-4 w-4 text-emerald-500" />
          {format(new Date(row.original.startDate), "dd MMM yyyy", {
            locale: fr,
          })}
        </div>
      ),
    },
    {
      id: "endDate",
      header: "Date de fin",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 text-emerald-700">
          <Calendar className="h-4 w-4 text-emerald-500" />
          {format(new Date(row.original.endDate), "dd MMM yyyy", {
            locale: fr,
          })}
        </div>
      ),
    },
    {
      id: "duration",
      header: "Durée",
      cell: ({ row }: any) => {
        const duration = calculateDuration(
          row.original.startDate,
          row.original.endDate
        );
        return <span className="text-emerald-600">{duration}</span>;
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const project: ProjectDetail = row.original;
        return (
          <ActionButton
            project={project}
            canDetails={canDetails}
            canModify={canModify}
            canDelete={canDelete}
          />
        );
      },
    },
  ];

  const stats = {
    totalBeneficiaires: 1000,
    abandons: 36,
    tauxAbandon: 3.6,
    dureeJours: 141,
    dureeJoursOuvrables: Math.floor(141 * (5 / 7)), // Jours ouvrables (hors vendredi et samedi)
    nombreClasses: 37,
    nombreFormateurs: 46,
    communeBalballa: 71,
    communeRasdika: 29,
    totalAGR: 541,
    enAttenteAccompagnement: 775,
    tauxRetention: 96.4,
  };

  const exportProjects = createExcelExporter(
    {
      name: "Nom du projet",
      status: "Statut",
      startDate: "Date de début",
      endDate: "Date de fin",
      duration: "Durée",
    },
    (project: any) => {
      const status = getProjectStatus(project);
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const durationDays = differenceInDays(endDate, startDate);

      // Formatage cohérent avec l'affichage UI
      const formatDuration = () => {
        if (durationDays >= 365) {
          const years = Math.floor(durationDays / 365);
          return `${years} an${years > 1 ? "s" : ""}`;
        }
        if (durationDays >= 30) {
          const months = Math.floor(durationDays / 30);
          return `${months} mois`;
        }
        return `${durationDays} jour${durationDays > 1 ? "s" : ""}`;
      };

      return {
        name: project.name,
        status: status.label,
        startDate: format(startDate, "dd MMM yyyy", { locale: fr }),
        endDate: format(endDate, "dd MMM yyyy", { locale: fr }),
        duration: formatDuration(),
      };
    },
    "projets",
    `Export_Projets_${format(new Date(), "yyyyMMdd")}`
  );

  return project.value === "PARVBG" ? (
    <main className="min-h-screen ">
      <div className="container mx-auto px-4  space-y-8">
        {/* Top Actions: Search & Add Project */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 bg-white p-3 rounded shadow">
          <div className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded"
              />
            </div>
          </div>
          <div className="flex  items-center gap-4 w-full md:w-auto justify-end">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value: "grid" | "table") =>
                value && setViewMode(value)
              }
              className="border border-emerald-200 rounded-xl p-1 bg-emerald-50"
            >
              <ToggleGroupItem
                value="grid"
                aria-label="Afficher en grille"
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100",
                  viewMode === "grid" &&
                  "!bg-emerald-500 !text-white shadow-sm !hover:bg-emerald-600 rounded"
                )}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grille
              </ToggleGroupItem>
              <ToggleGroupItem
                value="table"
                aria-label="Afficher en tableau"
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100",
                  viewMode === "table" &&
                  "!bg-emerald-500 !text-white shadow-sm !hover:bg-emerald-600 rounded"
                )}
              >
                <List className="h-4 w-4 mr-2" />
                Tableau
              </ToggleGroupItem>

              <ToggleGroupItem
                value="gantt"
                aria-label="Afficher en grille"
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100",
                  viewMode === "gantt" &&
                  "!bg-emerald-500 !text-white shadow-sm !hover:bg-emerald-600 rounded"
                )}
              >
                <GanttChart className="h-4 w-4 mr-2" />
                Gantt
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex flex-col-reverse md:flex-row items-center gap-2">
              {canAdd && (
                <Button
                  onClick={() =>
                    open(
                      <CustomModal>
                        <ProjectForm />
                      </CustomModal>
                    )
                  }
                  className="bg-primary text-white shadow-lg shadow-emerald-500/25 rounded"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau projet
                </Button>
              )}
              <div className="sapce-x-2">
                <SearchSelect
                  className="w-44"
                  Icon={FolderKanban}
                  items={[{ id: "PARVBG", name: "PARVBG" }]}
                  onChangeValue={(value) => {
                    project.set(value);
                  }}
                  loading={false}
                  selectedId={project.value}
                  disabled={false}
                />
                <Button
                  size={"icon"}
                  variant="ghost"
                  onClick={() => project.set("")}
                >
                  <X />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}

        <div className="mx-auto max-w-7xl space-y-6">
          {/* Main Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Bénéficiaires */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">
                  Total des Bénéficiaires
                </CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-4xl font-bold text-blue-700">
                  {stats.totalBeneficiaires.toLocaleString()}
                </div>
                <p className="text-sm font-semibold text-blue-600">
                  jeunes filles formées
                </p>
              </CardContent>
            </Card>

            {/* Abandons */}
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden relative">
              {/* Effet de fond décoratif */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-300 rounded-full blur-3xl opacity-20" />

              <CardHeader className="relative z-10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-500 p-3 shadow-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-amber-900">
                    Modules de Formation
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 relative z-10">
                <div className="space-y-3">
                  {/* Module 1 */}
                  <div className="flex items-start gap-3 p-3 bg-white/70 rounded-lg border border-amber-200 hover:bg-white transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Formation en Entreprenariat & Soft Skills</p>
                    </div>
                    <BookOpen className="h-4 w-4 text-amber-500 mt-0.5" />
                  </div>

                  {/* Module 2 */}
                  <div className="flex items-start gap-3 p-3 bg-white/70 rounded-lg border border-amber-200 hover:bg-white transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Séances de sensibilisation sur les VBG</p>
                    </div>
                    <Heart className="h-4 w-4 text-amber-500 mt-0.5" />
                  </div>

                  {/* Module 3 */}
                  <div className="flex items-start gap-3 p-3 bg-white/70 rounded-lg border border-amber-200 hover:bg-white transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Modules sur la SSR et les droits de la femme</p>
                    </div>
                    <Users className="h-4 w-4 text-amber-500 mt-0.5" />
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-300 flex items-center justify-between">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Programme PARVBG
                  </p>
                  <span className="text-xs bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-semibold">
                    3 Modules
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Classes */}
            <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-violet-900">
                  Nombre de Classes
                </CardTitle>
                <GraduationCap className="h-5 w-5 text-violet-600" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-4xl font-bold text-violet-700">
                  36
                </div>
                <p className="text-sm font-semibold text-violet-600">
                  Classes actives
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Formateurs */}
            <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-teal-900">
                  Nombre de Formateurs
                </CardTitle>
                <Users className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-4xl font-bold text-teal-700">
                  {stats.nombreFormateurs}
                </div>
                <p className="text-sm font-semibold text-teal-600">
                  Formateurs qualifiés
                </p>
              </CardContent>
            </Card>

            {/* Total AGR */}

            <div className="max-w-md">
              <Card className="border-rose-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                {/* Bordure animée */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ padding: "2px" }}
                >
                  <div className="absolute inset-[2px] bg-white rounded-lg" />
                </div>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                  <CardTitle className="text-sm font-bold text-rose-900 uppercase tracking-wide">
                    Total AGR
                  </CardTitle>
                  <div className="rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 p-2.5 shadow-md group-hover:scale-110 transition-transform">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  <div className="text-5xl font-black text-rose-600 drop-shadow-sm">
                    {stats.totalAGR}
                  </div>

                  {/* Badges compacts */}
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg p-3 border border-rose-300">
                      <div className="text-xs text-rose-700 font-medium mb-1">
                        Individuels
                      </div>
                      <div className="text-2xl font-bold text-rose-900">
                        281
                      </div>
                    </div>

                    <div className="flex-1 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-3 border border-pink-300">
                      <div className="text-xs text-pink-700 font-medium mb-1">
                        Collectifs
                      </div>
                      <div className="text-2xl font-bold text-pink-900">
                        260
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-rose-600 text-center py-2 bg-rose-50 rounded-md">
                    💼 Activités génératrices de revenus
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Taux de Rétention */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-900">
                  Taux de Rétention
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-4xl font-bold text-emerald-700">
                  {stats.tauxRetention}%
                </div>
                <p className="text-sm font-semibold text-emerald-600">
                  Excellent taux de maintien
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Geographic Distribution & Waiting */}

          {/* Distribution Géographique */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <MapPin className="h-5 w-5 text-purple-600" />
                Distribution Géographique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-800">
                    Commune Balballa
                  </span>
                  <span className="text-sm font-bold text-purple-700">81%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-purple-200">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                    style={{ width: `81%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-800">
                    Commune Boulaos
                  </span>
                  <span className="text-sm font-bold text-orange-700">19%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-orange-200">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                    style={{ width: `19%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900">
                {searchQuery ? "Résultats de recherche" : "Tous les projets"}
              </h2>
              <p className="text-emerald-600">
                {filteredProjects.length} projet
                {filteredProjects.length > 1 ? "s" : ""} trouvé
                {filteredProjects.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {viewMode === "grid" ? (
            <ProjectsGrid
              projects={filteredProjects}
              isPending={isPending}
              permission={{ canModify, canAdd, canDelete }}
              canDetails={canDetails}
            />
          ) : viewMode === "gantt" ? (
            <Main2 />
          ) : (
            <DataTable<ProjectDetail>
              data={filteredProjects}
              columns={columns}
              searchPlaceholder="Rechercher par nom ou date..."
              searchField="name"
              additionalSearchFields={["startDate", "endDate", "duration"]}
              canAdd={false}
              pageSize={10}
              isPending={isPending}
              exportFunction={exportProjects}
            />
          )}
        </div>
      </div>
    </main>
  ) : (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center">
      <Card
        className={cn(
          "w-80 h-48 cursor-pointer transition-all duration-200 hover:shadow-lg",
          project.value === "PARVBG"
            ? "ring-2 ring-primary bg-primary/5 border-primary"
            : "hover:border-primary/50"
        )}
        onClick={() => project.set("PARVBG")}
      >
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">PARVBG</h2>
            <p className="text-sm text-muted-foreground">
              {project.value === "PARVBG"
                ? "Sélectionné"
                : "Cliquez pour sélectionner"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type ActionButtonProps = {
  project?: ProjectDetail;
  canDetails?: boolean;
  canModify?: boolean;
  canDelete?: boolean;
};

export const ActionButton = ({
  project,
  canDelete,
  canModify,
  canDetails,
}: ActionButtonProps) => {
  const { open } = useModal();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: useDelete, isPending } = useDeleteProjet();
  const router = useRouter();

  const onConfirmDelete = async () => {
    useDelete(
      { param: { projetId: project?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
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
        loading={isPending}
        title={`le project  ${project?.name!}`}
      />
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
            {canDetails && (
              <DropdownMenuItem
                onClick={() => router.push(`/projects/${project?.id!}`)}
                className="flex items-center gap-2 rounded-lg cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                Detail
              </DropdownMenuItem>
            )}

            {canModify && (
              <DropdownMenuItem
                onClick={() =>
                  open(
                    <CustomModal>
                      <ProjectForm details={project} />
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
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg cursor-pointer"
              >
                <Trash className="textre h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
