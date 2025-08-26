import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core//components/ui/card";
import { Progress } from "@/core//components/ui/progress";
import { Badge } from "@/core//components/ui/badge";
import { Spinner } from "@/core/components/ui/spinner";

type PropsUserTypes = {
  type: string;
  count: number;
  percentage: number;
  color: string;
};

type PropsUserStatus = {
  enabled: number;
  disabled: number;
};

type Props = {
  userTypes: PropsUserTypes[];
  userStatus: PropsUserStatus;
  isPending: boolean;
};

export function UserStats({ userTypes, userStatus, isPending }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Statistiques Utilisateurs
          <Badge variant="secondary">
            {isPending ? (
              <Spinner variant="ring" className="text-primary" />
            ) : (
              userTypes.reduce((sum, type) => sum + type.count, 0)
            )}
            <span>total</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Répartition par type</h4>
          <div className="space-y-3">
            {isPending ? (
              <Spinner variant="ring" className="text-primary" />
            ) : (
              userTypes.map((type, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm ">
                    <span>{type.type}</span>
                    <span className="font-medium">{type.count}</span>
                  </div>
                  <Progress
                    value={type.percentage}
                    className={`h-2 ${
                      type.type === "Employé(e)s"
                        ? "!bg-blue-200"
                        : type.type === "Accompagnateur(trice)s"
                        ? "!bg-purple-200"
                        : type.type === "Formateur(trice)s"
                        ? "!bg-orange-200"
                        : "!bg-rose-200"
                    }`}
                    indicatorClassName={`${
                      type.type === "Employé(e)s"
                        ? "!bg-blue-500"
                        : type.type === "Accompagnateur(trice)s"
                        ? "!bg-purple-500"
                        : type.type === "Formateur(trice)s"
                        ? "!bg-orange-500"
                        : "!bg-rose-500"
                    }`}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Statut des Comptes</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {isPending ? (
                  <Spinner variant="ring" className="text-primary" />
                ) : (
                  userStatus.enabled
                )}
              </div>
              <div className="text-sm text-green-700">Actifs</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {isPending ? (
                  <Spinner variant="ring" className="text-primary" />
                ) : (
                  userStatus.disabled
                )}
              </div>
              <div className="text-sm text-red-700">Désactivés</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
