"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  CheckCircle,
  PenTool,
  Plus,
  Trash2,
  User,
  ArrowLeft,
  ArrowRight,
  Clock,
  Building,
  Target,
  Boxes,
  IdCardLanyard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";

import { Checkbox } from "@/core/components/ui/checkbox";
import { useState } from "react";
import { cn } from "@/core/lib/utils";
import { RencontreDetail } from "@/core/lib/types";
import { RencontreSchema, RencontreSchemaInput } from "@/core/lib/schemas";
import { useGetAccompaniments } from "@/core/hooks/use-accompaniment";
import { useGetAccompanist } from "@/core/hooks/use-teams";
import { useGetMembers } from "@/core/hooks/use-member";
import {
  useCreateRencontre,
  useUpdateRencontre,
} from "@/core/hooks/use-rencontre";
import { DatePicker } from "@/core/components/global/data-picker";
import SearchSelect from "@/core/components/global/search_select";
import { UploadMultiFilesMinimal } from "@/core/components/global/multi-uploads";
import { Spinner } from "@/core/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyString } from "@/core/lib/constants";

type Props = {
  details?: RencontreDetail;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

const steps = [
  {
    id: 1,
    title: "Informations générales",
    description: "Date, lieu et participants",
    icon: Calendar,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Ordre du jour",
    description: "Points à aborder",
    icon: FileText,
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Décisions & Actions",
    description: "Résultats et suivi",
    icon: Target,
    color: "bg-orange-500",
  },
  {
    id: 4,
    title: "Signatures",
    description: "Validation des participants",
    icon: PenTool,
    color: "bg-purple-500",
  },
  {
    id: 5,
    title: "Fichier",
    description: "Validation des fichiers",
    icon: PenTool,
    color: "bg-fuchsia-500",
  },
];

export function RencontreForm({ details, open, onOpenChangeAction }: Props) {
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);

  const { data: projets, isPending: ploading } = useGetAccompaniments();
  const { data: users, isPending: loadingUsers } = useGetAccompanist();
  const { data: members, isPending: loadingMembers } = useGetMembers();

  const { mutate: create, isPending: cloading } = useCreateRencontre();
  const { mutate: update, isPending: uloading } = useUpdateRencontre();

  const loading = cloading || uloading;

  const form = useForm<RencontreSchemaInput>({
    resolver: zodResolver(RencontreSchema),
    defaultValues: {
      date: details?.date || new Date(),
      lieu: details?.lieu || "",
      order: details?.order?.map((item) => ({ value: item })) || [
        { value: "" },
      ],
      decisions: details?.decisions?.map((item) => ({ value: item })) || [
        { value: "" },
      ],
      actions: details?.actions?.map((item) => ({ value: item })) || [
        { value: "" },
      ],
      signatures: details?.signatures || [],
      accompanimentId: details?.accompanimentId || "",
      usersId: details?.usersId || "",
    },
  });

  const {
    fields: orderFields,
    append: appendOrder,
    remove: removeOrder,
  } = useFieldArray({ control: form.control, name: "order" });

  const {
    fields: decisionFields,
    append: appendDecision,
    remove: removeDecision,
  } = useFieldArray({ control: form.control, name: "decisions" });

  const {
    fields: actionFields,
    append: appendAction,
    remove: removeAction,
  } = useFieldArray({ control: form.control, name: "actions" });

  const {
    fields: signatureFields,
    append: appendSignature,
    remove: removeSignature,
  } = useFieldArray({ control: form.control, name: "signatures" });

  const resetdata = () => {
    form.reset();
    onOpenChangeAction(false);
    setCurrentStep(1);
    queryClient.invalidateQueries({
      queryKey: [QueryKeyString.rencontre],
    });
  };

  const onSubmit = async (data: RencontreSchemaInput) => {
    if (details) {
      update(
        { json: data, param: { rId: details.id } },
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

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="!max-w-5xl max-h-[95vh] overflow-hidden p-0 border-none">
        <div className="flex h-full">
          {/* Sidebar avec les étapes */}
          <div className="w-80 bg-gradient-to-b from-slate-50 to-slate-100 border-r p-6">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold text-slate-800">
                {details ? "Modifier la rencontre" : "Nouvelle rencontre"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-md transition-all duration-200 cursor-pointer",
                      isActive && "bg-white border",
                      isCompleted && "bg-green-50",
                      !isActive && !isCompleted && "hover:bg-white/50"
                    )}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-semibold",
                        isActive && step.color,
                        isCompleted && "bg-green-500",
                        !isActive && !isCompleted && "bg-slate-300"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={cn(
                          "font-semibold text-sm",
                          isActive && "text-slate-900",
                          isCompleted && "text-green-700",
                          !isActive && !isCompleted && "text-slate-600"
                        )}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          isActive && "text-slate-600",
                          isCompleted && "text-green-600",
                          !isActive && !isCompleted && "text-slate-500"
                        )}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Progression</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Étape {currentStep} sur {steps.length}
              </p>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 flex flex-col">
            {/* Header de l'étape */}
            <div className={cn("p-6 text-white", currentStepData?.color)}>
              <div className="flex items-center gap-3">
                {currentStepData && (
                  <currentStepData.icon className="w-6 h-6" />
                )}
                <div>
                  <h2 className="text-xl font-bold">
                    {currentStepData?.title}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {currentStepData?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu du formulaire */}
            <div className="flex-1 overflow-y-auto p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Étape 1: Informations générales */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <Card className="border border-blue-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            Informations de base
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Date de la rencontre *
                                  </FormLabel>
                                  <DatePicker
                                    disabled={loading}
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lieu"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Lieu *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Lieu de la rencontre"
                                      disabled={loading}
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

                      <Card className="border border-green-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="w-5 h-5 text-green-500" />
                            Participants
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="accompanimentId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    Accompagnement *
                                  </FormLabel>
                                  <SearchSelect
                                    Icon={Boxes}
                                    className="w-full"
                                    items={projets || []}
                                    onChangeValue={field.onChange}
                                    loading={ploading}
                                    selectedId={field.value ?? ""}
                                    disabled={loading}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="usersId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Accompagnateur *
                                  </FormLabel>
                                  <SearchSelect
                                    Icon={IdCardLanyard}
                                    className="w-full"
                                    items={users || []}
                                    onChangeValue={field.onChange}
                                    loading={loadingUsers}
                                    selectedId={field.value ?? ""}
                                    disabled={loading}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Étape 2: Ordre du jour */}
                  {currentStep === 2 && (
                    <Card className="  border border-green-500">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-500" />
                            Points à l'ordre du jour
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={loading}
                            onClick={() => appendOrder({ value: "" })}
                            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un point
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {orderFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex gap-3 items-start"
                          >
                            <Badge
                              variant="secondary"
                              className="mt-2 bg-green-100 text-green-700"
                            >
                              {index + 1}
                            </Badge>
                            <FormField
                              control={form.control}
                              name={`order.${index}.value`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder={`Point ${
                                        index + 1
                                      } de l'ordre du jour`}
                                      disabled={loading}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {orderFields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={loading}
                                onClick={() => removeOrder(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Étape 3: Décisions et Actions */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <Card className="border border-orange-500">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-orange-500" />
                              Décisions prises
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={loading}
                              onClick={() => appendDecision({ value: "" })}
                              className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter une décision
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {decisionFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex gap-3 items-start"
                            >
                              <Badge
                                variant="secondary"
                                className="mt-2 bg-orange-100 text-orange-700"
                              >
                                D{index + 1}
                              </Badge>
                              <FormField
                                control={form.control}
                                name={`decisions.${index}.value`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder={`Décision ${index + 1}`}
                                        disabled={loading}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={loading}
                                onClick={() => removeDecision(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="border border-blue-500">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Target className="w-5 h-5 text-blue-500" />
                              Actions à entreprendre
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={loading}
                              onClick={() => appendAction({ value: "" })}
                              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter une action
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {actionFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex gap-3 items-start"
                            >
                              <Badge
                                variant="secondary"
                                className="mt-2 bg-blue-100 text-blue-700"
                              >
                                A{index + 1}
                              </Badge>
                              <FormField
                                control={form.control}
                                name={`actions.${index}.value`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder={`Action ${index + 1}`}
                                        disabled={loading}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={loading}
                                onClick={() => removeAction(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Étape 4: Signatures */}
                  {currentStep === 4 && (
                    <Card className="border border-purple-500">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <PenTool className="w-5 h-5 text-purple-500" />
                            Signatures et validation
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={loading}
                            onClick={() =>
                              appendSignature({
                                date: new Date(),
                                memberId: "",
                                present: false,
                              })
                            }
                            className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une signature
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {signatureFields.map((field, index) => (
                          <Card
                            key={field.id}
                            className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                          >
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <Badge className="bg-purple-100 text-purple-700">
                                    Signature {index + 1}
                                  </Badge>
                                  {signatureFields.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      disabled={loading}
                                      onClick={() => removeSignature(index)}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Supprimer
                                    </Button>
                                  )}
                                </div>

                                <FormField
                                  control={form.control}
                                  name={`signatures.${index}.present`}
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-purple-200 p-4 bg-white">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          disabled={loading}
                                          className="border-purple-300"
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="text-purple-900 font-medium">
                                          Confirmer la présence du bénéficiaire
                                        </FormLabel>
                                        <FormDescription className="text-purple-600">
                                          Je certifie que le bénéficiaire était
                                          présent lors de cette rencontre
                                        </FormDescription>
                                      </div>
                                    </FormItem>
                                  )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`signatures.${index}.memberId`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                          <User className="w-4 h-4" />
                                          Bénéficiaire *
                                        </FormLabel>
                                        <SearchSelect
                                          Icon={User}
                                          className="w-full"
                                          items={members || []}
                                          onChangeValue={field.onChange}
                                          loading={loadingMembers}
                                          selectedId={field.value ?? ""}
                                          disabled={loading}
                                        />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`signatures.${index}.date`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                          <Calendar className="w-4 h-4" />
                                          Date de signature *
                                        </FormLabel>
                                        <DatePicker
                                          value={field.value}
                                          onChange={field.onChange}
                                          disabled={loading}
                                        />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Étape 5: fichiers */}
                  {currentStep === 5 && (
                    <Card className="border border-purple-500">
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="files"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-emerald-700 font-semibold">
                                Fichiers
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <UploadMultiFilesMinimal
                                    valuetab={field.value || []}
                                    disabled={loading}
                                    onChangeAction={(value) => {
                                      field.onChange(value);
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  )}
                </form>
              </Form>
            </div>

            {/* Footer avec navigation */}
            <div className="border-t bg-gray-50 p-6">
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || loading}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </Button>

                <div className="flex items-center gap-2">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        step.id === currentStep && "bg-blue-500 w-8",
                        step.id < currentStep && "bg-green-500",
                        step.id > currentStep && "bg-gray-300"
                      )}
                    />
                  ))}
                </div>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    onClick={form.handleSubmit(onSubmit)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    {details ? "Mettre à jour" : "Enregistrer"}

                    {loading ? (
                      <Spinner variant="ellipsis" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
