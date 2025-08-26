"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VisiteTerrainSchema,
  type VisiteTerrainSchemaInput,
} from "@/core/lib/schemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Textarea } from "@/core/components/ui/textarea";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  MapPin,
  Plus,
  Trash2,
  Upload,
  Users,
  FileText,
  Calendar,
  User,
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/core/lib/utils";
import { VisiteTerrainDetail } from "@/core/lib/types";
import { useGetAccompanist } from "@/core/hooks/use-teams";
import {
  useCreateVisiteTerrain,
  useUpdateVisiteTerrain,
} from "@/core/hooks/use-vt";
import { SelectVisit } from "@/core/view/rapports/select-visit";
import SearchSelect from "@/core/components/global/search_select";
import { UploadMultiFilesMinimal } from "@/core/components/global/multi-uploads";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyString } from "@/core/lib/constants";

interface VisiteTerrainModalProps {
  details?: VisiteTerrainDetail;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

const tabs = [
  {
    id: "planning",
    label: "Planning",
    icon: Calendar,
    description: "Visite & Accompagnateur",
  },
  {
    id: "participants",
    label: "Participants",
    icon: Users,
    description: "Personnes présentes",
  },
  {
    id: "documents",
    label: "Documents",
    icon: Upload,
    description: "Fichiers joints",
  },
  {
    id: "observations",
    label: "Observations",
    icon: FileText,
    description: "Notes & Remarques",
  },
];

export const VisiteTerrainForm = ({
  details,
  open,
  onOpenChangeAction,
}: VisiteTerrainModalProps) => {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("planning");
  const { data: users, isPending: loadingUsers } = useGetAccompanist();
  const { mutate: create, isPending: cloading } = useCreateVisiteTerrain();
  const { mutate: update, isPending: uloading } = useUpdateVisiteTerrain();

  const loading = cloading || uloading;

  const form = useForm<VisiteTerrainSchemaInput>({
    resolver: zodResolver(VisiteTerrainSchema),
    defaultValues: {
      visitId: details?.visitId || "",
      observations: details?.observations || "",
      personnes: details?.personnes || [],
      files: details?.files || [],
      usersId: details?.usersId || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "personnes",
  });

  const watchedValues = form.watch();

  const resetdata = () => {
    form.reset();
    onOpenChangeAction(false);

    queryClient.invalidateQueries({
      queryKey: [QueryKeyString.vt],
    });
  };

  const onSubmit = (data: VisiteTerrainSchemaInput) => {
    if (details) {
      update(
        { json: data, param: { vId: details.id } },
        {
          onSuccess: () => {
            resetdata();
          },
        }
      );
    } else {
      create(
        { json: data },
        {
          onSuccess: () => {
            resetdata();
          },
        }
      );
    }
  };

  const getTabStatus = (tabId: string) => {
    switch (tabId) {
      case "planning":
        return watchedValues.visitId ? "complete" : "incomplete";
      case "participants":
        return watchedValues.personnes?.length > 0 &&
          watchedValues.personnes.every((p) => p.name && p.role)
          ? "complete"
          : watchedValues.personnes?.length > 0
          ? "partial"
          : "incomplete";
      case "documents":
        return watchedValues?.files?.length! > 0 ? "complete" : "empty";
      case "observations":
        return watchedValues.observations ? "complete" : "empty";
      default:
        return "incomplete";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "planning":
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Planification
              </h2>
              <p className="text-gray-600">
                Configurez les détails de base de votre visite terrain
              </p>
            </div>

            <div className="space-y-8 p-2">
              <FormField
                control={form.control}
                name="visitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Visite planifiée *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <SelectVisit
                          disabled={loading}
                          onChangeValueAction={field.onChange}
                          id={field.value}
                        />
                        {field.value && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usersId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Accompagnateur
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <SearchSelect
                          className="w-full"
                          Icon={User}
                          items={users ? users : []}
                          onChangeValue={field.onChange}
                          loading={loadingUsers}
                          selectedId={field.value ?? ""}
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case "participants":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Participants
                </h2>
                <p className="text-gray-600">
                  Gérez la liste des personnes présentes
                </p>
              </div>
              <Button
                type="button"
                onClick={() => append({ name: "", role: "" })}
                className="bg-orange-600 hover:bg-blue-700 text-white shadow-lg"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Aucun participant
                </h3>
                <p className="text-gray-500 mb-6">
                  Commencez par ajouter les personnes présentes
                </p>
                <Button
                  type="button"
                  onClick={() => append({ name: "", role: "" })}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Première personne
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Participant {index + 1}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Informations personnelles
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 transition-opacity"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`personnes.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Nom complet *
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                placeholder="Nom de la personne"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`personnes.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Fonction/Rôle *
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                placeholder="Ex: Responsable technique"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "documents":
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Documents
              </h2>
              <p className="text-gray-600">
                Joignez les fichiers nécessaires à votre visite
              </p>
            </div>

            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Fichiers joints
                  </FormLabel>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8">
                    <UploadMultiFilesMinimal
                      valuetab={field.value || []}
                      onChangeAction={(value) => {
                        field.onChange(value);
                      }}
                      disabled={loading}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "observations":
        return (
          <div className="space-y-8 p-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Observations
              </h2>
              <p className="text-gray-600">
                Documentez vos observations et remarques
              </p>
            </div>

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notes détaillées
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Décrivez vos observations, les points importants, les recommandations, les problèmes rencontrés..."
                      className="min-h-[300px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="!max-w-7xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-600 text-white rounded-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Visite Terrain
                  </h1>
                  <p className="text-sm text-gray-600">
                    {details ? "Modification" : "Création"}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 p-4">
              <nav className="space-y-4">
                {tabs.map((tab) => {
                  const status = getTabStatus(tab.id);
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl transition-all duration-200 group",
                        isActive
                          ? "bg-orange-500 text-white "
                          : "bg-white hover:bg-gray-100  border border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <tab.icon
                          className={cn(
                            "h-5 w-5",
                            isActive ? "text-white" : "text-[#f34]"
                          )}
                        />
                        <span className="font-semibold">{tab.label}</span>
                        <div className="ml-auto">
                          {status === "complete" && (
                            <CheckCircle className="h-4 w-4 text-orange-800" />
                          )}
                          {status === "partial" && (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                          {status === "incomplete" && (
                            <Clock className="h-4 w-4 text-orange-800" />
                          )}
                        </div>
                      </div>
                      <p
                        className={cn(
                          "text-sm",
                          isActive ? "text-white" : "text-gray-500"
                        )}
                      >
                        {tab.description}
                      </p>
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Content */}
            <ScrollArea className="flex-1 p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {renderTabContent()}
                </form>
              </Form>
            </ScrollArea>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChangeAction(false)}
                  disabled={loading}
                  className="px-6"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={loading}
                  className="px-6 bg-orange-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
