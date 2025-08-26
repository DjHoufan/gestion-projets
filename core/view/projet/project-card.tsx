"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Edit,
  MapPinCheckInside,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Progress } from "@/core/components/ui/progress";

import type { CrudPermissions, ProjectDetail } from "@/core/lib/types";
import { calculateProgress, cn, getProjectStatus } from "@/core/lib/utils";
import { ActionButton } from "./project-body";
import { useMemo } from "react";

interface ProjectCardProps {
  project: ProjectDetail;
  permission: CrudPermissions;
  canDetails: boolean;
}

export function ProjectCard({
  project,
  permission,
  canDetails,
}: ProjectCardProps) {
  const { canModify, canDelete } = permission;
  const status = getProjectStatus(project);
  const progress = useMemo(() => {
    return calculateProgress(project.startDate, project.endDate) || 1;
  }, [project.startDate, project.endDate]);
  return (
    <Card className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-emerald-100 hover:border-emerald-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-emerald-900 truncate mb-2">
              {project.name}
            </h3>

            <div className="flex justify-between items-center mt-3">
              <h6 className="font-semibold text-lg text-emerald-900 truncate mb-2 flex items-center gap-1">
                <MapPinCheckInside />
                {project.local}
              </h6>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={cn("text-xs font-medium border", status.color)}
                >
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>
          <ActionButton
            project={project}
            canModify={canModify}
            canDelete={canDelete}
            canDetails={canDetails}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-600 font-medium">Progression</span>
              <span className="text-emerald-700 font-semibold">
                {progress}%
              </span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-emerald-100 [&>*]:bg-emerald-500"
            />
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-emerald-600">
            <Calendar className="h-4 w-4" />
            <div>
              <p className="font-medium">Début</p>
              <p className="text-emerald-700">
                {format(new Date(project.startDate), "dd MMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <Clock className="h-4 w-4" />
            <div>
              <p className="font-medium">Fin</p>
              <p className="text-emerald-700">
                {format(new Date(project.endDate), "dd MMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        {project.accompaniments && project.accompaniments.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <Users className="h-4 w-4" />
            <span className="font-medium">Accompagnements:</span>
            <span className="text-emerald-700">
              {project.accompaniments.length} membre
              {project.accompaniments.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
