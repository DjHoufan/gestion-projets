"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  Venus,
  Mars,
  HomeIcon,
  FileTextIcon,
  AccessibilityIcon,
  LanguagesIcon,
  Boxes,
  Shapes,
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
import { Member } from "@prisma/client";
import { FormProps } from "@/core/lib/types";
import { MemberSchema, MemberSchemaInput } from "@/core/lib/schemas";
import { DatePicker } from "@/core/components/global/data-picker";
import ImageUpload from "@/core/components/global/upload-image";
import { useCreateMember, useUpdateMember } from "@/core/hooks/use-member";
import { Spinner } from "@/core/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { useGetPojet } from "@/core/hooks/use-projet";
import SearchSelect from "@/core/components/global/search_select";
import { useGetClasses } from "@/core/hooks/use-classe";
import { useMemo, useState } from "react";

type Props = {
  details?: Member;
  pId?: string;
  classeId?: string;
};

export const MemberForm = ({ details, pId, classeId }: Props) => {
  const [projectId, setProject] = useState<string>("");
  const { mutate: create, isPending: cloading } = useCreateMember();
  const { mutate: update, isPending: uloading } = useUpdateMember();
  const { data: projets, isPending: projetLoading } = useGetPojet();
  const { data: classes, isPending: classeLoading } = useGetClasses();

  const classe = useMemo(() => {
    if (!classes) return [];

    const id = projectId || pId || details?.projectId;
    return classes.filter((c) => c.projectId === id);
  }, [classes, projectId, details?.projectId]);

  const form = useForm<MemberSchemaInput>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      projectId: details?.projectId || pId || "",
      classeId: details?.classeId || classeId || "",
      profile: details?.profile || "",
      name: details?.name || "",
      phone: details?.phone || "",
      commune: details?.commune || "",
      residential: details?.residential || "",
      disability: details?.disability || "",
      language: details?.language || "",
      gender: details?.gender || "",
      dob: details?.dob || new Date(),
      attestation: details?.attestation || "",
    },
  });

  let isSubmitting = cloading || uloading;

  const handleSubmit = async (data: MemberSchemaInput) => {
    if (details) {
      update({
        json: data,
        param: {
          emId: details.id,
        },
      });
    } else {
      create({ json: data });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg    ">
      <h2 className="text-2xl font-bold text-emerald-800 mb-6">
        Détails du Membre
      </h2>
      <ScrollArea className="max-h-[70vh] h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Section 1: Profile (left) & Name, Email, Phone (right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile URL */}
              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-700 font-semibold">
                      Profile *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ImageUpload
                          value={field.value ? field.value : ""}
                          disabled={isSubmitting}
                          onChange={(url) => field.onChange(url)}
                          folder="profile"
                          buttonPosition="top-right"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name, Email, Phone (in a column) */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-emerald-700 font-semibold">
                        Project
                      </FormLabel>
                      <FormControl className="w-full">
                        <SearchSelect
                          className="w-full bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl h-12"
                          Icon={Boxes}
                          items={projets ? projets : []}
                          onChangeValue={(value) => {
                            field.onChange(value);
                            setProject(value);
                          }}
                          loading={projetLoading}
                          selectedId={pId || field.value}
                          disabled={pId ? true : isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classeId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-emerald-700 font-semibold">
                        Classe
                      </FormLabel>
                      <FormControl className="w-full">
                        <SearchSelect
                          className="w-full bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl h-12"
                          Icon={Shapes}
                          items={classe ? classe : []}
                          onChangeValue={field.onChange}
                          loading={classeLoading}
                          selectedId={classeId || field.value}
                          disabled={classeId ? true : isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Nom complet */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-700 font-semibold">
                        Nom complet *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                          <Input
                            disabled={isSubmitting}
                            placeholder="nom complet"
                            className="pl-10 bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl h-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}

                {/* Numéro de Téléphone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-700 font-semibold">
                        Numéro de Téléphone *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                          <Input
                            disabled={isSubmitting}
                            type="tel"
                            placeholder="77 00 00 00"
                            className="pl-10 bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl h-12"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 2: Gender (left) & Date de Naissance (right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Genre */}

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
                    >
                      <FormControl className="w-full">
                        <div className="w-full relative ">
                          <SelectTrigger className="w-full bg-white border-emerald-200 flex  focus:border-emerald-400 rounded-lg h-12">
                            <SelectValue placeholder="Sélectionner le genre" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="homme">
                          <Mars className="text-emerald-500" /> Homme
                        </SelectItem>
                        <SelectItem value="femme">
                          <Venus className="text-emerald-500" />
                          Femme
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date de Naissance */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-emerald-700 font-semibold">
                      Date de Naissance *
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

            {/* Section 3: Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Commune */}

              <FormField
                control={form.control}
                name="commune"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-700 font-semibold">
                      Commune *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <div className="w-full relative ">
                          <SelectTrigger className="w-full bg-white border-emerald-200 flex  focus:border-emerald-400 rounded-lg h-12">
                            <SelectValue placeholder="Sélectionner la commune" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="balballa">
                          <MapPinIcon className="text-emerald-500" />
                          Balballa
                        </SelectItem>
                        <SelectItem value="ras dika">
                          <MapPinIcon className="text-emerald-500" />
                          Ras dika
                        </SelectItem>
                        <SelectItem value="autre">
                          <MapPinIcon className="text-emerald-500" />
                          Autre
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Quartier Résidentiel */}
              <FormField
                control={form.control}
                name="residential"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-700 font-semibold">
                      Quartier Résidentiel *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                        <Input
                          disabled={isSubmitting}
                          placeholder="Quartier 7"
                          className="pl-10 bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl h-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section 5: Additional Information */}

              {/* Type de Handicap */}

              <FormField
                control={form.control}
                name="disability"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-emerald-700 font-semibold">
                      Type de Handicap *
                    </FormLabel>
                    <FormControl>
                      <div className="relative p-2">
                        <AccessibilityIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                        <Input
                          disabled={isSubmitting}
                          placeholder=" le type de handicap"
                          className="pl-10 bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl h-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-700 font-semibold">
                      Langue *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <div className="w-full relative ">
                          <SelectTrigger className="w-full bg-white border-emerald-200 flex  focus:border-emerald-400 rounded-lg h-12">
                            <SelectValue placeholder="Sélectionner la langue" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="afar">
                          <LanguagesIcon className="text-emerald-500" />
                          Afar
                        </SelectItem>
                        <SelectItem value="somali">
                          <LanguagesIcon className="text-emerald-500" />
                          Somali
                        </SelectItem>
                        <SelectItem value="arabe">
                          <LanguagesIcon className="text-emerald-500" />
                          Arabe
                        </SelectItem>
                        <SelectItem value="autre">
                          <LanguagesIcon className="text-emerald-500" />
                          Autre
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Langue */}
            </div>
            {/* Section 6: Attestation */}
            <FormField
              control={form.control}
              name="attestation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-700 font-semibold">
                    Attestation *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileTextIcon className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                      <textarea
                        disabled={isSubmitting}
                        placeholder="Détails de l'attestation..."
                        className="pl-10 p-2 w-full bg-white border border-emerald-300 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl min-h-[100px]"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors duration-200"
            >
              {isSubmitting
                ? details
                  ? "Modification"
                  : "Enregistrement"
                : details
                ? "Modifier"
                : "Enregistrer"}
              {isSubmitting && <Spinner variant="ellipsis" />}
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
};
