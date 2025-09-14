"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PlusIcon,
  TrashIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  Users,
  IdCardLanyard,
  UserCircle,
  Boxes,
  Check,
} from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import {
  AccompanimentSchema,
  type AccompanimentSchemaInput,
} from "@/core/lib/schemas";

import { useGetMembersWithoutGroup } from "@/core/hooks/use-member";
import { useGetAccompanist } from "@/core/hooks/use-teams";

import { Accompaniments, FormProps } from "@/core/lib/types";
import SearchSelect from "@/core/components/global/search_select";
import {
  useCreateAccompaniment,
  useUpdateAccompaniment,
} from "@/core/hooks/use-accompaniment";
import { Spinner } from "@/core/components/ui/spinner";
import { useMemo, useState } from "react";
import { useGetPojet } from "@/core/hooks/use-projet";
import { UploadMultiFilesMinimal } from "@/core/components/global/multi-uploads";
import { ScrollArea } from "@/core/components/ui/scroll-area";

export const AccompanimentForm = ({ details }: FormProps<Accompaniments>) => {
  const [porjectId, setPorjectId] = useState<string>("");
  const excludeIds = useMemo(
    () => details?.members?.map((member) => member.id) || [],
    [details?.members]
  );

  const { mutate: create, isPending: cloading } = useCreateAccompaniment();
  const { mutate: update, isPending: uloading } = useUpdateAccompaniment();

  const { data: members, isPending: loadingMembers } =
    useGetMembersWithoutGroup(porjectId, excludeIds);
  const { data: accompanist, isPending: loadingAccompanist } =
    useGetAccompanist();
  const { data: projets, isPending: projetLoading } = useGetPojet();

  const form = useForm<AccompanimentSchemaInput>({
    resolver: zodResolver(AccompanimentSchema),
    defaultValues: {
      name: details?.name || "",
      adresse: details?.adresse || "",
      phones: details?.phones?.map((p) => ({ value: p })) || [],
      members: details?.members?.map((p) => ({ value: p.id })) || [],
      budget: details?.budget || 0,
      usersid: details?.usersid || "",
      projectId: details?.projectId || "",
    },
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control: form.control,
    name: "phones",
  });

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({
    control: form.control,
    name: "members",
  });

  let isSubmitting = cloading || uloading;

  const handleSubmit = async (data: AccompanimentSchemaInput) => {
    if (details) {
      update({
        json: data,
        param: {
          accId: details.id,
        },
      });
    } else {
      create({ json: data });
    }
  };

  return (
    <div
      className=" max-h-[80vh] "
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Section Informations Générales */}
          <Card className="border-emerald-200 bg-emerald-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <UserIcon className="h-5 w-5" />
                Informations Générales
              </CardTitle>
              <CardDescription>
                Définissez les informations de base de l'accompagnement
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-5 items-center justify-between w-full ">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" /> Project
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchSelect
                        className="w-full"
                        Icon={Boxes}
                        items={projets ? projets : []}
                        onChangeValue={(value) => {
                          field.onChange(value);
                          setPorjectId(value);
                        }}
                        loading={projetLoading}
                        selectedId={field.value}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium">
                      Nom du business
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Ex: Formation Digital Marketing"
                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usersid"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" /> Accompagnateur
                    </FormLabel>
                    <FormControl className="w-full">
                      <SearchSelect
                        className="w-full"
                        Icon={IdCardLanyard}
                        items={accompanist ? accompanist : []}
                        onChangeValue={field.onChange}
                        loading={loadingAccompanist}
                        selectedId={field.value}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {/* Section Localisation */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <MapPinIcon className="h-5 w-5" />
                Localisation
              </CardTitle>
              <CardDescription>
                Précisez l'adresse où se déroulera l'accompagnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Adresse complète
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="123 Rue de l'Innovation, 75001 Paris"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {/* Section Bénéficiaires */}
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Users className="h-5 w-5" />
                Les bénéficiaires
              </CardTitle>
              <CardDescription>
                Ajoutez les bénéficiaires pour ce accompagnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="members"
                bg-emerald-100
                text-emerald-800
                text-sm
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium">
                      Membres
                    </FormLabel>
                    <div className="space-y-3">
                      {memberFields.length === 0 && (
                        <div className="text-center py-6 border-2 border-dashed border-orange-200 rounded-lg">
                          <UserCircle className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                          <p className="text-sm text-orange-600">
                            Aucun bénéficiaire ajouté
                          </p>
                          <p className="text-xs text-orange-500">
                            Cliquez sur "Ajouter" pour commencer
                          </p>
                        </div>
                      )}
                      {memberFields.map((item, index) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name={`members.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-purple-200">
                                <FormControl>
                                  <SearchSelect
                                    className="w-4/5"
                                    Icon={Users}
                                    items={members ? members : []}
                                    onChangeValue={field.onChange}
                                    loading={loadingMembers}
                                    selectedId={field.value ?? ""}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <Button
                                  disabled={isSubmitting}
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                                  onClick={() => removeMember(index)}
                                  aria-label={`Supprimer le membre ${
                                    index + 1
                                  }`}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <Button
                        disabled={isSubmitting}
                        type="button"
                        variant="outline"
                        className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 bg-transparent"
                        onClick={() => appendMember({ value: "" })}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Ajouter un bénéficiaire
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {/* Section Contact */}
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <PhoneIcon className="h-5 w-5" />
                Informations de Contact
              </CardTitle>
              <CardDescription>
                Ajoutez les numéros de téléphone de contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="phones"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Numéros de téléphone
                    </FormLabel>
                    <div className="space-y-3">
                      {phoneFields.length === 0 && (
                        <div className="text-center py-6 border-2 border-dashed border-purple-200 rounded-lg">
                          <PhoneIcon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-sm text-purple-600">
                            Aucun numéro ajouté
                          </p>
                          <p className="text-xs text-purple-500">
                            Cliquez sur "Ajouter" pour commencer
                          </p>
                        </div>
                      )}
                      {phoneFields.map((item, index) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name={`phones.${index}.value`} // Corrected field name for array item
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-purple-200">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <PhoneIcon className="h-4 w-4 text-purple-600" />
                                  </div>
                                </div>
                                <FormControl>
                                  <Input
                                    disabled={isSubmitting}
                                    type="number"
                                    placeholder="Ex: 0123456789"
                                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        Number.parseInt(e.target.value, 10) || 0
                                      )
                                    }
                                  />
                                </FormControl>
                                <Button
                                  disabled={isSubmitting}
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                                  onClick={() => removePhone(index)}
                                  aria-label={`Supprimer le téléphone ${
                                    index + 1
                                  }`}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <Button
                        disabled={isSubmitting}
                        type="button"
                        variant="outline"
                        className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 bg-transparent"
                        onClick={() => appendPhone({ value: 0 })}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Ajouter un numéro de téléphone
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {/* Section Budget */}
          <Card className="border-orange-200 bg-orange-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <CreditCardIcon className="h-5 w-5" />
                Budget
              </CardTitle>
              <CardDescription>
                Définissez le budget alloué à cet accompagnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Montant en euros
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled={isSubmitting}
                          type="number"
                          placeholder="5000"
                          className="border-orange-200 focus:border-orange-500 focus:ring-orange-500 pl-8"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseInt(e.target.value, 10) || 0
                            )
                          }
                        />
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <span className="text-orange-600 text-sm">Fdj</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <CreditCardIcon className="h-5 w-5" />
                PLAN D'AFFAIRES
              </CardTitle>
              <CardDescription>
                Veuillez téléverser le plan d'affaires pour cet accompagnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="w-full flex justify-center items-center  ">
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
            </CardContent>
          </Card>

          <Separator className="my-6" />
          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              disabled={isSubmitting}
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => form.reset()}
            >
              Réinitialiser
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  {details ? "Modification" : "Enregistrement"}
                  <Spinner variant="ellipsis" />
                </div>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {details ? "Modifier le profile" : " Créer le profil"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
