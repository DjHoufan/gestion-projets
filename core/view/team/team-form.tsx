"use client";

import React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  IdCardLanyard,
  Users,
  UserRoundCog,
  CircleDot,
  Venus,
  Mars,
  Contact,
} from "lucide-react";

import { Button } from "@/core/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";

import { SiReaddotcv } from "react-icons/si";

import { cn } from "@/core/lib/utils";
import { UserSchema, UserSchemaInput } from "@/core/lib/schemas";
import { FormProps, UserDetail } from "@/core/lib/types";
import ImageUpload from "@/core/components/global/upload-image";
import { DatePicker } from "@/core/components/global/data-picker";
import { Spinner } from "@/core/components/ui/spinner";
import { useCreateTeam, useUpdateTeam } from "@/core/hooks/use-teams";
import { UploadMultiFilesMinimal } from "@/core/components/global/multi-uploads";

const getSteps = (typeSelect: string) => [
  {
    id: 1,
    title: "Photo de profil",
    description: "Ajoutez votre photo",
    icon: Camera,
    fields: ["profile"],
    visible: true,
  },
  {
    id: 2,
    title: "Informations personnelles",
    description: "Vos données personnelles",
    icon: User,
    fields: ["name", "gender", "dob"],
    visible: true,
  },
  {
    id: 3,
    title: "Contact",
    description: "Moyens de communication",
    icon: Mail,
    fields: ["email", "phone", "address"],
    visible: true,
  },
  {
    id: 4,
    title: "Paramètres",
    description: "Configuration du compte",
    icon: Shield,
    fields: ["type", "status"],
    visible: true,
  },
  {
    id: 5,
    title: "CV",
    description: "Téléverse le CV du formateur",
    icon: SiReaddotcv,
    fields: ["file"],
    visible: typeSelect === "trainer" || typeSelect === "accompanist",
  },
];

export const EquipeForm = ({ details }: FormProps<UserDetail>) => {
  const [typeSelect, settypeSelect] = useState<string>(details?.type! || "");
  const [currentStep, setCurrentStep] = useState<number>(1);

  const { mutate: create, isPending: cloading } = useCreateTeam();
  const { mutate: update, isPending: uloading } = useUpdateTeam();

  let isSubmitting = cloading || uloading;

  const STEPS = getSteps(typeSelect);

  const form = useForm<UserSchemaInput>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      profile: details?.profile || "",
      name: details?.name || "",
      email: details?.email || "",
      phone: details?.phone || "",
      address: details?.address || "",
      gender: details?.gender || "",
      dob: details?.dob || new Date(),
      status: details?.status || "disabled",
      type: details?.type || "employe",
      cv: details?.cv || null,
    },
  });

  const handleSubmit = async (data: UserSchemaInput) => {
    if (details) {
      update({
        json: data,
        param: {
          teamId: details.id,
        },
      });
    } else {
      create({ json: data });
    }
  };

  const nextStep = async () => {
    const currentStepFields =
      STEPS.find((step) => step.id === currentStep)?.fields || [];
    const isValid = await form.trigger(currentStepFields as any);

    if (isValid) {
      // Trouver la prochaine étape visible
      let nextStepId = currentStep + 1;
      while (nextStepId <= STEPS.length) {
        const nextStep = STEPS.find((step) => step.id === nextStepId);
        if (nextStep?.visible) {
          setCurrentStep(nextStepId);
          return;
        }
        nextStepId++;
      }

      // Si on arrive ici, c'est qu'on est à la dernière étape
      if (currentStep < STEPS.length) {
        setCurrentStep(STEPS.length);
      }
    }
  };

  const prevStep = () => {
    // Trouver la précédente étape visible
    let prevStepId = currentStep - 1;
    while (prevStepId >= 1) {
      const prevStep = STEPS.find((step) => step.id === prevStepId);
      if (prevStep?.visible) {
        setCurrentStep(prevStepId);
        return;
      }
      prevStepId--;
    }
  };

  const goToStep = (stepId: number) => {
    const step = STEPS.find((step) => step.id === stepId);
    if (step?.visible) {
      setCurrentStep(stepId);
    }
  };

  const isStepCompleted = (stepId: number) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;

    return step.fields.every((field) => {
      const value = form.getValues(field as keyof UserSchemaInput);
      return value !== "" && value !== undefined;
    });
  };

  const currentStepData = STEPS.find((step) => step.id === currentStep);

  return (
    <div className="flex h-full">
      {/* Sidebar with steps */}
      <div className="w-80 bg-gradient-to-b from-emerald-50 to-orange-50 p-6 border-r border-emerald-100">
        <div className="space-y-4">
          {STEPS.filter((step) => step.visible).map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = isStepCompleted(step.id);

            return (
              <div key={step.id} className="relative">
                <button
                  type="button"
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left",
                    isActive
                      ? "bg-white shadow-lg border-2 border-emerald-300"
                      : isCompleted
                      ? "bg-emerald-100 hover:bg-emerald-150"
                      : "hover:bg-white/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive
                        ? "bg-emerald-500 text-white shadow-lg"
                        : isCompleted
                        ? "bg-emerald-400 text-white"
                        : "bg-white text-emerald-500 border-2 border-emerald-200"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={cn(
                        "font-semibold transition-colors duration-300",
                        isActive
                          ? "text-emerald-800"
                          : isCompleted
                          ? "text-emerald-700"
                          : "text-emerald-600"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm transition-colors duration-300",
                        isActive ? "text-emerald-600" : "text-emerald-500"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-emerald-600 mb-2">
            <span>Progression</span>
            <span>{Math.round((currentStep / STEPS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Step header */}
        <div className="p-6 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            {currentStepData && (
              <>
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <currentStepData.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-800">
                    {currentStepData.title}
                  </h2>
                  <p className="text-emerald-600">
                    {currentStepData.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full">
              {/* Step 1: Profile Photo */}
              {currentStep === 1 && (
                <div className="flex items-center justify-center h-full">
                  <FormField
                    control={form.control}
                    name="profile"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            value={field.value ? field.value : ""}
                            disabled={isSubmitting}
                            onChange={(url) => field.onChange(url)}
                            folder="profile"
                            buttonPosition="top-right"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 2 && (
                <div className="max-w-md mx-auto space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 font-semibold">
                          Nom complet *
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder="nom complet"
                            className="bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 font-semibold">
                          Genre *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger className="bg-white border-emerald-200 focus:border-emerald-400 rounded-xl h-12">
                              <SelectValue placeholder="Sélectionner le genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="homme">
                              <Mars /> Homme
                            </SelectItem>
                            <SelectItem value="femme">
                              <Venus />
                              Femme
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 font-semibold">
                          Date de naissance *
                        </FormLabel>
                        <DatePicker
                          disabled={isSubmitting}
                          position="center"
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Contact */}
              {currentStep === 3 && (
                <div className="max-w-md mx-auto space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            className="bg-white border-orange-200 focus:border-emerald -400 focus:ring-emerald -400/20 transition-all duration-200 rounded-xl h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Téléphone *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="77000000"
                            className="bg-white border-orange-200 focus:border-emerald -400 focus:ring-emerald -400/20 transition-all duration-200 rounded-xl h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Adresse *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Rue de la Paix, 75001 Djibouti"
                            className="bg-white border-orange-200 focus:border-emerald -400 focus:ring-emerald -400/20 transition-all duration-200 rounded-xl h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 4: Settings */}
              {currentStep === 4 && (
                <div className="max-w-md mx-auto space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 font-semibold">
                          Type d'utilisateur *
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            settypeSelect(value);
                          }}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 rounded-xl h-12">
                              <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="employe">
                              <IdCardLanyard /> Employé
                            </SelectItem>
                            <SelectItem value="accompanist">
                              <Users /> Accompagnateur/trice
                            </SelectItem>
                            <SelectItem value="trainer">
                              <Contact /> Formateur/trice
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700 font-semibold">
                          Statut *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 rounded-xl h-12">
                              <SelectValue placeholder="Sélectionner le statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="enabled">
                              <CircleDot
                                className="text-green-500 "
                                size="300px"
                              />{" "}
                              Actif
                            </SelectItem>
                            <SelectItem value="disabled">
                              <CircleDot className="text-red-500" /> Désactivé
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Summary */}
                  <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h3 className="font-semibold text-emerald-800 mb-3">
                      Résumé du profil
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-emerald-600">Nom:</span>
                        <span className="text-emerald-800 font-medium">
                          {form.watch("name") || "Non renseigné"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-600">Email:</span>
                        <span className="text-emerald-800 font-medium">
                          {form.watch("email") || "Non renseigné"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-600">Type:</span>
                        <span className="text-emerald-800 font-medium">
                          {form.watch("type") === "employe" ? (
                            <div className="flex justify-center items-center gap-5">
                              <span>Employé</span>
                              <IdCardLanyard />
                            </div>
                          ) : form.watch("type") === "accompanist" ? (
                            <div className="flex justify-center items-center gap-5">
                              <span>Accompagnateur</span>
                              <Users />
                            </div>
                          ) : form.watch("type") === "admin" ? (
                            <div className="flex justify-center items-center gap-5">
                              <span>Administrateur</span>
                              <UserRoundCog />
                            </div>
                          ) : form.watch("type") === "trainer" ? (
                            <div className="flex justify-center items-center gap-5">
                              <span>Formateur</span>
                              <Contact />
                            </div>
                          ) : (
                            "Non renseigné"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: CV (visible seulement pour les formateurs) */}
              {currentStep === 5 &&
                (typeSelect === "trainer" || typeSelect === "accompanist") && (
                  <div className="max-w-md mx-auto space-y-6">
                    <FormField
                      control={form.control}
                      name="cv"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="w-full flex justify-center items-center">
                              <UploadMultiFilesMinimal
                                multiple={false}
                                valuetab={field.value ? [field.value] : []}
                                disabled={false}
                                onChangeAction={(value) => {
                                  field.onChange(value[0]);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
            </form>
          </Form>
        </div>

        {/* Navigation footer */}
        <div className="p-6 border-t border-emerald-100 bg-white">
          <div className="flex justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>

            {(() => {
              // Trouver les étapes visibles restantes
              const remainingVisibleSteps = STEPS.slice(currentStep).filter(
                (step) => step.visible
              );

              // S'il reste des étapes visibles
              if (remainingVisibleSteps.length > 0) {
                return (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="flex bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                );
              }
              // Sinon, afficher le bouton de soumission
              return (
                <Button
                  type="submit"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      {details ? "Modification" : "Enregistrement"}
                      <Spinner variant="ellipsis" />
                    </div>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {details ? "Modifier le profile" : "Créer le profil"}
                    </>
                  )}
                </Button>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
