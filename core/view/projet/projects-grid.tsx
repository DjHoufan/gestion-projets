"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { ProjectCard } from "@/core/view/projet/project-card";
import type { CrudPermissions, ProjectDetail } from "@/core/lib/types";
import { cn } from "@/core/lib/utils";

import { Spinner } from "@/core/components/ui/spinner";

interface ProjectsGridProps {
  projects: ProjectDetail[];
  isPending: boolean;
  permission: CrudPermissions;
  canDetails: boolean;
}

export function ProjectsGrid({
  projects,
  isPending,
  permission,
  canDetails
}: ProjectsGridProps) {
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = projects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isPending) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner size={80} variant="ring" className="text-primary" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-emerald-100 rounded-2xl mb-6">
          <FolderOpen className="h-12 w-12 text-emerald-500" />
        </div>
        <h3 className="text-xl font-semibold text-emerald-900 mb-2">
          Aucun projet trouvé
        </h3>
        <p className="text-emerald-600 max-w-md">
          Commencez par créer votre premier projet ou ajustez vos critères de
          recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} permission={permission} canDetails={canDetails} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-emerald-100">
          <div className="text-sm text-emerald-600">
            Affichage de {startIndex + 1} à{" "}
            {Math.min(startIndex + itemsPerPage, projects.length)} sur{" "}
            {projects.length} projets
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border-emerald-200 hover:bg-emerald-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "w-10 h-10 rounded-xl",
                      currentPage === page
                        ? "bg-gradient-to-r from-emerald-500 to-orange-500 text-white shadow-lg shadow-emerald-500/25"
                        : "hover:bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl border-emerald-200 hover:bg-emerald-50"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
