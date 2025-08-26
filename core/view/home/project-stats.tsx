import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Spinner } from "@/core/components/ui/spinner";

type Props = {
  name: string;
  status: boolean;
  location: string;
  members: number;
  endDate: string;
};

export function ProjectStats({
  projects,
  isPending,
}: {
  projects: Props[];
  isPending: boolean;
}) {
  const activeProjects = projects?.filter((p) => p.status).length ?? 0;
  const pendingProjects = projects?.filter((p) => !p.status).length ?? 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Statistiques Projets
          <Badge variant="secondary">
            {isPending ? (
              <Spinner variant="ring" className="text-primary" />
            ) : (
              projects.length
            )}
            <span>projets</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {isPending ? (
                <div className="w-full flex justify-center items-center mb-2">
                  <Spinner variant="ring" className="text-blue-700 " />
                </div>
              ) : (
                activeProjects
              )}
            </div>
            <div className="text-sm text-blue-700">Projets Terminé</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {isPending ? (
                <div className="w-full flex justify-center items-center mb-2">
                  <Spinner variant="ring" className="text-purple-700 " />
                </div>
              ) : (
                pendingProjects
              )}
            </div>
            <div className="text-sm text-purple-700">Projects en cours</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Projets Récents</h4>
          {isPending ? (
            <div className="w-full flex justify-center items-center">
              <Spinner variant="bars" size={50} className="text-primary" />
            </div>
          ) : (
            projects.slice(0, 3).map((project, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{project.name}</span>
                    <Badge variant={project.status ? "default" : "secondary"}>
                      {project.status ? "Terminé" : "En cours"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.members}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.endDate).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
