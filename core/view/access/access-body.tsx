"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/core/components/ui/button";
import { Label } from "@/core/components/ui/label";
import {
  UserSquare2,
  Info,
  Shield,
  Plus,
  Pencil,
  Trash2,
  MonitorCheck,
  PlusSquare,
  RotateCcw,
  Users as UserIcon,
  Activity,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/core/components/ui/collapsible";
import { cn, definePermissions } from "@/core/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { Users } from "@prisma/client";
import { useGetEmploye, useUpdateAccessEmploye } from "@/core/hooks/use-teams";
import { toast } from "@/core/components/global/custom-toast";
import { Spinner } from "@/core/components/ui/spinner";
import SearchSelect from "@/core/components/global/search_select";
import { PermissionProps, RolePermission } from "@/core/lib/types";

// Define types for permissions
type PermissionAction =
  | "create"
  | "update"
  | "delete"
  | "view"
  | "reset"
  | "details";

interface Actions {
  create: boolean;
  update: boolean;
  delete: boolean;
  view: boolean;
  details: boolean;
  reset: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  actions: Record<PermissionAction, boolean>;
}

// Define permission actions
const permissionActions: {
  id: PermissionAction;
  name: string;
  icon: React.ReactNode;
}[] = [
  { id: "view", name: "Voir", icon: <MonitorCheck className="h-3.5 w-3.5" /> },
  {
    id: "reset",
    name: "réinitialiser le mote de passe",
    icon: <RotateCcw className="h-3.5 w-3.5" />,
  },
  {
    id: "details",
    name: "voir plus de détails",
    icon: <Info className="h-3.5 w-3.5" />,
  },
  { id: "create", name: "Ajouter", icon: <Plus className="h-3.5 w-3.5" /> },
  { id: "update", name: "Modifier", icon: <Pencil className="h-3.5 w-3.5" /> },
  { id: "delete", name: "Supprimer", icon: <Trash2 className="h-3.5 w-3.5" /> },
];

// Access data grouped by category
export const AccessGroups = [
  {
    id: "organisation",
    name: "Organisation",
    items: [
      { id: "equipes", name: "Équipes", description: "Gérer les équipes" },
      { id: "classes", name: "Classes", description: "Gérer les classes" },
      { id: "planning", name: "Planning", description: "Gérer le planning" },
    ],
  },
  {
    id: "suivi",
    name: "Suivi",
    items: [
      { id: "projects", name: "Projets", description: "Gérer les projets" },
      {
        id: "beneficiaires",
        name: "Bénéficiaires",
        description: "Gérer les bénéficiaires",
      },
      {
        id: "accompagnements",
        name: "Accompagnements",
        description: "Gérer les accompagnements des bénéficiaires",
      },
    ],
  },
  {
    id: "information",
    name: "Information",
    items: [
      { id: "messages", name: "Messages", description: "Gérer les messages" },
      { id: "rapports", name: "Rapports", description: "Gérer les rapports" },
      { id: "maps", name: "Maps", description: "Gérer les cartes" },
    ],
  },
  {
    id: "securite",
    name: "Sécurité",
    items: [
      { id: "acces", name: "Accès", description: "Gérer les droits d'accès" },
    ],
  },
];

// Flatten access data for lookup
export const AccesData = AccessGroups.flatMap((group) => group.items);

// Initialize default permissions
const initializePermission = (item: {
  id: string;
  name: string;
  description: string;
}): Permission => ({
  id: item.id,
  name: item.name,
  description: item.description,
  actions: {
    view: false,
    create: false,
    update: false,
    delete: false,
    reset: false,
    details: false,
  },
});

export const BodyAcces = ({ permission }: PermissionProps) => {
  const { canAdd } = useMemo(() => {
    return definePermissions(permission, "acces");
  }, [permission]);

  const [employe, setEmploye] = useState<Users | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [initialPermissions, setInitialPermissions] = useState<Permission[]>(
    []
  );
  const [activeTab, setActiveTab] = useState("organisation");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const { data, isPending } = useGetEmploye();

  const { mutate: updateAccess, isPending: loading } = useUpdateAccessEmploye();

  useEffect(() => {
    setExpandedItem(null);
  }, [activeTab]);

  const toggleExpanded = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const isPermissionActive = (permission: Permission) => {
    return Object.values(permission.actions).some((value) => value);
  };

  const togglePermissionAction = (
    permissionId: string,
    action: PermissionAction,
    checked: boolean
  ) => {
    setPermissions((prev) => {
      const newPermissions = prev.map((p) =>
        p.id === permissionId
          ? {
              ...p,
              actions: {
                ...p.actions,
                [action]: checked,
              },
            }
          : p
      );

      const currentStateJSON = JSON.stringify(newPermissions);
      const initialStateJSON = JSON.stringify(initialPermissions);
      setHasChanges(currentStateJSON !== initialStateJSON);

      return newPermissions;
    });
  };

  const ensurePermission = (moduleId: string) => {
    const module = AccesData.find((item) => item.id === moduleId);
    if (!module) return;

    const existingPermission = permissions.find((p) => p.id === moduleId);
    if (!existingPermission) {
      setPermissions((prev) => [...prev, initializePermission(module)]);
    }
  };

  const onSubmit = async () => {
    setHasChanges(false);

    if (!employe) {
      toast.error({
        message: "Veuillez sélectionner un employé avant de sauvegarder",
      });
      return;
    }

    const tabsAcces: string[] = [];
    const idsAcces: string[] = [];

    permissions.forEach((item) => {
      const activeActions = Object.entries(item.actions)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key);

      if (activeActions.length > 0) {
        tabsAcces.push(`${item.id} | ${activeActions.join(" | ")}`);
        idsAcces.push(item.id);
      }
    });

    updateAccess({
      json: {
        routes: idsAcces,
        access: tabsAcces,
      },
      param: { employeId: employe.id },
    });
  };

  const activePermissionsCount = permissions.filter(isPermissionActive).length;
  const totalPermissions = AccesData.length;

  useEffect(() => {
    setHasChanges(false);
  }, [employe]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border  transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Total Employés
                  </p>
                  <p className="text-3xl font-black text-primary">
                    {data?.length || 0}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <UserIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border   transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Modules Disponibles
                  </p>
                  <p className="text-3xl font-black text-primary">
                    {totalPermissions}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border  transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Accès Actifs
                  </p>
                  <p className="text-3xl font-black text-primary">
                    {activePermissionsCount}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border   bg-card">
            <CardHeader className="pb-6 space-y-4 bg-muted/20 border-b">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <CardTitle className="text-3xl font-serif font-black flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                    <span className="text-foreground">
                      Configuration des Permissions
                    </span>
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    Interface épurée avec design moderne cyan et orange
                  </CardDescription>
                </div>
                {canAdd && (
                  <Button
                    className="px-8 py-4 text-base font-bold  transition-all duration-300 bg-primary hover:bg-primary/90"
                    disabled={loading || !employe}
                    onClick={onSubmit}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Spinner className="mr-3" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-3 h-5 w-5" />
                        Sauvegarder les Modifications
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>

            {hasChanges && (
              <div className="px-6">
                <Alert className="border-red-500/30 bg-red-500/5 text-red-500">
                  <Info className="h-4 w-4 text-red-500" />
                  <AlertDescription className="font-semibold">
                    Des modifications ont été apportées. N'oubliez pas de les
                    sauvegarder !
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="space-y-6">
                    <Card className="bg-card border  ">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-serif font-bold flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <UserSquare2 className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-primary">
                            Sélection Employé(e)
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-bold text-primary">
                            Employé(e)
                          </Label>
                          <SearchSelect
                            Icon={UserSquare2}
                            className="w-full p-4 border-2 border-border rounded-md bg-input focus:border-primary focus:ring-2 focus:ring-ring transition-all duration-200"
                            loading={isPending}
                            disabled={loading}
                            items={data!}
                            onChangeValue={(value) => {
                              const employeData = data?.find(
                                (item) => item.id === value
                              );
                              if (!employeData) return;
                              const updatedData: Permission[] = AccesData.map(
                                (item) => {
                                  const newItem: Permission = {
                                    ...item,
                                    actions: {
                                      view: false,
                                      create: false,
                                      update: false,
                                      delete: false,
                                      reset: false,
                                      details: false,
                                    },
                                  };

                                  const entry = employeData.access.find(
                                    (tab: string) => tab.startsWith(item.id)
                                  );

                                  if (entry) {
                                    const actionsToEnable = entry
                                      .split(" | ")
                                      .slice(1) as (keyof Actions)[];

                                    actionsToEnable.forEach((action) => {
                                      if (
                                        newItem.actions[action] !== undefined
                                      ) {
                                        newItem.actions[action] = true;
                                      }
                                    });
                                  }

                                  return newItem;
                                }
                              );

                              setPermissions(updatedData);
                              setInitialPermissions(
                                JSON.parse(JSON.stringify(updatedData))
                              );
                              setEmploye(employeData);
                            }}
                            selectedId={employe?.id}
                          />
                          <p className="text-xs text-muted-foreground italic">
                            💡 Sélectionnez un employé pour configurer ses
                            permissions
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {employe && (
                      <div>
                        <Card className="bg-card border  ">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                              <Activity className="h-5 w-5" />
                              Résumé des Accès
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-5">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-primary">
                                Modules avec accès:
                              </span>
                              <Badge className="bg-secondary text-primary font-mono text-base px-4 py-2">
                                {activePermissionsCount}/{totalPermissions}
                              </Badge>
                            </div>

                            <div className="space-y-3">
                              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-primary h-3 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      (activePermissionsCount /
                                        totalPermissions) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                              <p className="text-sm text-primary text-center font-medium">
                                {Math.round(
                                  (activePermissionsCount / totalPermissions) *
                                    100
                                )}
                                % des modules configurés
                              </p>
                            </div>

                            <div className="space-y-3 pt-2">
                              {AccessGroups.map((group, index) => {
                                const groupModules = group.items.map(
                                  (item) => item.id
                                );
                                const activeModules = permissions.filter(
                                  (p) =>
                                    groupModules.includes(p.id) &&
                                    isPermissionActive(p)
                                ).length;

                                return (
                                  <div
                                    key={group.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border"
                                  >
                                    <span className="text-sm font-semibold text-foreground">
                                      {group.name}
                                    </span>
                                    <Badge
                                      className={cn(
                                        "text-xs font-bold",
                                        activeModules > 0
                                          ? index === 0
                                            ? "bg-primary text-white"
                                            : index === 1
                                            ? "bg-blue-500 text-white"
                                            : index === 2
                                            ? "bg-orange-500 text-white"
                                            : "bg-fuchsia-500 text-white"
                                          : "bg-fuchsia-500 text-white border"
                                      )}
                                    >
                                      {activeModules}/{groupModules.length}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {employe ? (
                    <div>
                      <Tabs
                        defaultValue="organisation"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                      >
                        <TabsList
                          className={cn(
                            "w-full bg-muted grid mb-8 h-14 p-1 rounded-xl border",
                            `grid-cols-${AccessGroups.length}`
                          )}
                        >
                          {AccessGroups.map((group, index) => (
                            <TabsTrigger
                              key={group.id}
                              value={group.id}
                              className={cn(
                                "text-sm font-bold rounded-lg transition-all duration-300",
                                index === 0 &&
                                  "data-[state=active]:bg-primary data-[state=active]:text-white",
                                index === 1 &&
                                  "data-[state=active]:bg-blue-500 data-[state=active]:text-white",
                                index === 2 &&
                                  "data-[state=active]:bg-orange-500 data-[state=active]:text-white",
                                index === 3 &&
                                  "data-[state=active]:bg-fuchsia-500 data-[state=active]:text-white"
                              )}
                            >
                              {group.name}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {AccessGroups.map((group, index) => (
                          <TabsContent
                            key={group.id}
                            value={group.id}
                            className="mt-0"
                          >
                            <div className="space-y-5">
                              {group.items.map((module) => {
                                ensurePermission(module.id);

                                const permission =
                                  permissions.find((p) => p.id === module.id) ||
                                  initializePermission(module);

                                const isActive = isPermissionActive(permission);
                                const isExpanded = expandedItem === module.id;

                                const activeActionsCount = Object.values(
                                  permission.actions
                                ).filter(Boolean).length;

                                return (
                                  <div key={module.id}>
                                    <Collapsible
                                      open={isExpanded}
                                      onOpenChange={() =>
                                        toggleExpanded(module.id)
                                      }
                                      className={cn(
                                        "border-2 rounded-xl transition-all duration-300 overflow-hidden  ",
                                        isActive
                                          ? "order-secondary bg-card  "
                                          : "border-border hover:border-primary bg-card  "
                                      )}
                                    >
                                      <CollapsibleTrigger asChild>
                                        <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/20 transition-colors">
                                          <div className="flex items-center gap-5">
                                            {isActive ? (
                                              <div className="relative">
                                                <Badge className=" h-10 w-10 flex items-center justify-center p-0 rounded-full font-black text-lg bg-secondary text-primary">
                                                  {activeActionsCount}
                                                </Badge>
                                                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
                                              </div>
                                            ) : (
                                              <div className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center hover:border-primary transition-all duration-200">
                                                <Plus className="h-5 w-5 text-muted-foreground" />
                                              </div>
                                            )}
                                            <div>
                                              <h3 className="font-serif font-black text-xl text-foreground">
                                                {module.name}
                                              </h3>
                                              <p className="text-sm font-medium text-muted-foreground">
                                                {module.description}
                                              </p>
                                            </div>
                                          </div>
                                          <Button
                                            className={cn(
                                              "px-8 py-3 font-bold transition-all duration-300 ",
                                              isActive
                                                ? "bg-primary text-white hover:bg-primary/90"
                                                : " bg-accent text-primary hover:bg-secondary/90"
                                            )}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleExpanded(module.id);
                                            }}
                                          >
                                            {isActive
                                              ? "Configurer"
                                              : "Activer"}
                                          </Button>
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="px-6 pb-6 border-t bg-muted/10">
                                          <div className="pt-6 space-y-5">
                                            <h4 className="font-serif font-black text-lg mb-5 flex items-center gap-2 text-foreground">
                                              <Shield className="h-5 w-5" />
                                              Actions Disponibles
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                              {permissionActions
                                                .filter((action) => {
                                                  if (module.id === "acces") {
                                                    return (
                                                      action.id === "create" ||
                                                      action.id === "view"
                                                    );
                                                  }
                                                  if (module.id === "maps") {
                                                    return action.id === "view";
                                                  }

                                                  if (
                                                    module.id ===
                                                    "beneficiaires"
                                                  ) {
                                                    return (
                                                      action.id !== "reset"
                                                    );
                                                  }

                                                  if (
                                                    module.id === "messages"
                                                  ) {
                                                    return action.id === "view";
                                                  }

                                                  if (
                                                    module.id === "projects"
                                                  ) {
                                                    return (
                                                      action.id !== "reset"
                                                    );
                                                  }

                                                  if (module.id === "classes") {
                                                    return (
                                                      action.id !== "reset"
                                                    );
                                                  }

                                                  return (
                                                    action.id !== "reset" &&
                                                    action.id !== "details"
                                                  );
                                                })

                                                .map((action) => (
                                                  <div
                                                    key={action.id}
                                                    className="flex items-center space-x-2 mt-1"
                                                  >
                                                    <Checkbox
                                                      id={`${module.id}-${action.id}`}
                                                      checked={
                                                        permission.actions[
                                                          action.id
                                                        ]
                                                      }
                                                      onCheckedChange={(
                                                        checked
                                                      ) => {
                                                        togglePermissionAction(
                                                          module.id,
                                                          action.id,
                                                          checked === true
                                                        );
                                                      }}
                                                    />
                                                    <Label
                                                      htmlFor={`${module.id}-${action.id}`}
                                                      className="flex items-center gap-2 text-sm cursor-pointer"
                                                    >
                                                      {action.icon}
                                                      {action.name}
                                                    </Label>
                                                  </div>
                                                ))}
                                            </div>
                                          </div>
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </div>
                                );
                              })}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[500px] border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/10">
                      <div className="p-6 bg-primary/10 rounded-2xl mb-8">
                        <UserSquare2 className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="text-2xl font-serif font-black mb-4 text-primary">
                        Aucun employé(e) sélectionné(e)
                      </h3>
                      <p className="text-muted-foreground max-w-md text-lg leading-relaxed font-medium">
                        Choisissez un membre de votre équipe pour commencer à
                        configurer ses permissions
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/10 px-8 py-6 flex items-center justify-between border-t">
              <div className="flex items-center text-sm text-foreground">
                <div className="p-2 bg-primary/10 rounded-lg mr-4">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold">
                  Les modifications seront appliquées immédiatement après la
                  sauvegarde
                </span>
              </div>
              {employe && (
                <Button
                  variant="outline"
                  size="sm"
                  className="px-6 py-3 font-bold border-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-white cursor-pointer hover:border-destructive transition-all duration-300 bg-transparent"
                  onClick={() => {
                    setPermissions(
                      permissions.map((p) => ({
                        ...p,
                        actions: {
                          view: false,
                          create: false,
                          update: false,
                          delete: false,
                          reset: false,
                          details: false,
                        },
                      }))
                    );

                    setHasChanges(true);

                    toast.success({
                      message: "Toutes les permissions ont été réinitialisées",
                    });
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Réinitialiser Tout
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
