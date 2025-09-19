"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConflitSchema, type ConflitSchemaInput } from "@/core/lib/schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  AlertTriangle,
  Boxes,
  Check,
  BadgeIcon as IdCardLanyard,
  Plus,
  Trash2,
  Users,
  FileText,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Separator } from "@/core/components/ui/separator";
import { ConflitDetail } from "@/core/lib/types";
import {
  useGetAccompaniments,
  useGetMyAccompaniments,
} from "@/core/hooks/use-accompaniment";
import { useGetAccompanist } from "@/core/hooks/use-teams";
import { useCreateConflit, useUpdateConflit } from "@/core/hooks/use-conflit";
import SearchSelect from "@/core/components/global/search_select";
import { UploadMultiFilesMinimal } from "@/core/components/global/multi-uploads";
import { useModal } from "@/core/providers/modal-provider";

interface Props {
  details?: ConflitDetail;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  userId?: string;
  admin?: string;
}

export function ConflitForm({
  details,
  open,
  onOpenChangeAction,
  userId = "",

  admin = "non",
}: Props) {
  const { data: projets, isPending } = useGetMyAccompaniments(userId, admin);

  const { data: users, isPending: loadingUsers } = useGetAccompanist();
  const { mutate: create, isPending: cloading } = useCreateConflit();
  const { mutate: update, isPending: uloading } = useUpdateConflit();
  const { close } = useModal();

  const loading = cloading || uloading;

  const form = useForm<ConflitSchemaInput>({
    resolver: zodResolver(ConflitSchema),
    defaultValues: {
      nature: details?.nature || "",
      accompanimentId: details?.accompanimentId || "",
      partieImpliques: details?.partieImpliques || [{ name: "", role: "" }],
      files: details?.files || [],
      resolution: details?.resolution || "",
      usersId: details?.usersId || userId || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "partieImpliques",
  });

  const reset = () => {
    form.reset();
    onOpenChangeAction(false);
    close();
  };

  const onSubmit = (data: ConflitSchemaInput) => {
    if (details) {
      update(
        { json: data, param: { cId: details.id } },
        {
          onSuccess: () => {
            reset();
          },
        }
      );
    } else {
      create(
        { json: data },
        {
          onSuccess: () => {
            reset();
          },
        }
      );
    }
  };

  const steps = [
    { id: 1, title: "Informations générales", icon: AlertTriangle },
    { id: 2, title: "Parties impliquées", icon: Users },
    { id: 3, title: "Documents", icon: FileText },
    { id: 4, title: "Résolution", icon: Target },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="!max-w-5xl h-[95vh] p-0 flex flex-col">
        <div className="flex flex-1 min-h-0">
          {/* Sidebar avec étapes */}
          <div className="w-80 bg-gradient-to-b from-orange-50 to-red-50 border-r p-6 flex-shrink-0">
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl shadow-lg">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Gestion des Conflits
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 mt-1">
                    {details ? "Modifier le conflit" : "Nouveau conflit"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border-2 border-orange-200">
                      <span className="text-sm font-semibold text-orange-600">
                        {step.id}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {step.title}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-white rounded-lg border border-orange-200">
              <h4 className="font-semibold text-gray-900 mb-2">Conseils</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Soyez précis dans la description</li>
                <li>• Identifiez toutes les parties</li>
                <li>• Joignez les documents pertinents</li>
                <li>• Proposez une résolution claire</li>
              </ul>
            </div>
          </div>

          {/* Contenu principal avec scroll */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                <Form {...form}>
                  <form
                    id="conflit-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {/* Section 1: Informations générales */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Informations générales
                          </h3>
                          <p className="text-sm text-gray-600">
                            Contexte et nature du conflit
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="accompanimentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Accompagnement concerné
                              </FormLabel>
                              <FormControl>
                                <SearchSelect
                                  className="w-full"
                                  Icon={Boxes}
                                  items={projets ? projets : []}
                                  onChangeValue={field.onChange}
                                  loading={isPending}
                                  selectedId={field.value ?? ""}
                                  disabled={loading}
                                />
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
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Accompagnateur responsable
                              </FormLabel>
                              <FormControl>
                                <SearchSelect
                                  className="w-full"
                                  Icon={IdCardLanyard}
                                  items={users ? users : []}
                                  onChangeValue={field.onChange}
                                  loading={loadingUsers}
                                  selectedId={field.value ?? ""}
                                  disabled={userId ? true : loading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="nature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Nature du conflit *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez précisément la nature et l'origine du conflit..."
                                className="min-h-[100px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Section 2: Parties impliquées */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Parties impliquées
                            </h3>
                            <p className="text-sm text-gray-600">
                              Personnes concernées par le conflit
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ name: "", role: "" })}
                          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une personne
                        </Button>
                      </div>

                      <div className="grid gap-4">
                        {fields.map((field, index) => (
                          <Card
                            key={field.id}
                            className="border-l-4 border-l-blue-400"
                          >
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-700"
                                  >
                                    Personne {index + 1}
                                  </Badge>
                                </div>
                                {fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => remove(index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`partieImpliques.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium text-gray-700">
                                        Nom complet *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Nom et prénom"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`partieImpliques.${index}.role`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium text-gray-700">
                                        Rôle dans le conflit *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Ex: Plaignant, Témoin, Médiateur..."
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Section 3: Documents */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Documents justificatifs
                          </h3>
                          <p className="text-sm text-gray-600">
                            Pièces jointes et preuves du conflit
                          </p>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="files"
                        render={({ field }) => (
                          <FormItem>
                            <div className="border-2 border-dashed border-green-200 rounded-lg p-6 bg-green-50">
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

                    <Separator />

                    {/* Section 4: Résolution */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Target className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Plan de résolution
                          </h3>
                          <p className="text-sm text-gray-600">
                            Actions et mesures proposées
                          </p>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="resolution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Résolution proposée *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez les actions à entreprendre, les mesures correctives, les échéances..."
                                className="min-h-[120px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Actions - Fixed at bottom */}
                  </form>
                </Form>
              </div>
            </div>

            {/* Actions fixes en bas */}
            <div className="border-t bg-white p-6 flex-shrink-0">
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    close();
                    onOpenChangeAction(false);
                  }}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  disabled={loading}
                  type="submit"
                  form="conflit-form"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {details ? "Modification..." : "Enregistrement..."}
                    </div>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {details
                        ? "Modifier le conflit"
                        : "Enregistrer le conflit"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
