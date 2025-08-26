"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Edit,
  Calendar,
  Trash,
  GanttChart,
  Eye,
  FolderKanban,
  X,
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
import {
  CrudPermissions,
  PermissionProps,
  ProjectDetail,
} from "@/core/lib/types";
import { DeleteConfirmation } from "../../components/global/delete-confirmation";
import { GranttView } from "@/core/view/projet/gantt-view";
import { useRouter } from "next/navigation";
import { useSelectProject } from "@/core/hooks/store";
import { Card, CardContent } from "@/core/components/ui/card";
import SearchSelect from "@/core/components/global/search_select";

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
        <StatsCards projects={projects ?? []} isPending={isPending} />

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
            <GranttView projects={projects ?? []} />
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
