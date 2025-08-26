"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Clock,
  Calendar,
  User,
  Boxes,
  IdCardLanyard,
} from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
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
import { Badge } from "@/core/components/ui/badge";
import { Separator } from "@/core/components/ui/separator";
import { GradientCard } from "@/core/components/ui/gradient-card";
import { PlanningSchema, PlanningSchemaInput } from "@/core/lib/schemas";
import { Plannings } from "@/core/lib/types";
import { useGetAccompaniments } from "@/core/hooks/use-accompaniment";
import { useGetAccompanist } from "@/core/hooks/use-teams";
import { timeSlots } from "@/core/lib/utils";
import SearchSelect from "@/core/components/global/search_select";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { DatePicker } from "@/core/components/global/data-picker";
import { useCreatePlanning, useCreatevisit } from "@/core/hooks/use-planning";
import { Spinner } from "@/core/components/ui/spinner";

type Props = {
  details: Plannings | null;
  accompanimentId: string;
  userId: string;
};

export const PlanningForm = ({ details, accompanimentId, userId }: Props) => {
  const { mutate: create, isPending: ploading } = useCreatePlanning();
  const { mutate: visite, isPending: vloading } = useCreatevisit();

  let isSubmitting = ploading || vloading;

  const { data: projets, isPending } = useGetAccompaniments();
  const { data: accompanists, isPending: loading } = useGetAccompanist();

  const form = useForm<PlanningSchemaInput>({
    resolver: zodResolver(PlanningSchema),
    defaultValues: {
      usersId: details?.usersId || userId || "",
      accompanimentId: accompanimentId || "",
      visit: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "visit",
  });

  const addVisit = () => {
    append({
      date: new Date(),
      startTime: "07:00",
      endTime: "08:00",
      objetif: "",
      location: "",
    });
  };

  const handleSubmit = async (data: PlanningSchemaInput) => {
    if (details) {
      const visitsWithPlanningId = data.visit.map((visitItem) => ({
        ...visitItem,
        planningId: details.id,
      }));

      visite({ json: visitsWithPlanningId });
    } else {
      create({ json: data });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 max-h-[80vh] h-full ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Informations générales */}
          <GradientCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="usersId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accompagnateur</FormLabel>
                      <FormControl>
                        <SearchSelect
                          className="w-full"
                          Icon={IdCardLanyard}
                          items={accompanists ? accompanists : []}
                          onChangeValue={field.onChange}
                          loading={loading}
                          selectedId={userId}
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accompanimentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accompagnement</FormLabel>
                      <FormControl>
                        <SearchSelect
                          className="w-full"
                          Icon={Boxes}
                          items={projets ? projets : []}
                          onChangeValue={field.onChange}
                          loading={isPending}
                          selectedId={accompanimentId}
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </GradientCard>

          {/* Créneaux de visite */}
          <GradientCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Créneaux de visite
                  <Badge className="ml-2 bg-purple-100 text-purple-700 border-purple-200">
                    {fields.length} créneau{fields.length > 1 ? "x" : ""}
                  </Badge>
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVisit}
                  className="flex items-center gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un créneau
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 w-full">
              <ScrollArea className="h-[350px] p-3 w-full">
                {fields.map((field, index) => {
                  return (
                    <div key={field.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          Créneau {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-destructive hover:text-destructive hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                        <FormField
                          control={form.control}
                          name={`visit.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lieu</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="lieu de la visite"
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
                          name={`visit.${index}.objetif`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Objectif</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Veuillez renseigner l'objectif de la visite"
                                  className="bg-white border-orange-200 focus:border-emerald -400 focus:ring-emerald -400/20 transition-all duration-200 rounded-xl h-12"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-purple-200 rounded-lg bg-purple-50/30">
                        <FormField
                          control={form.control}
                          name={`visit.${index}.date`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-emerald-700 font-semibold">
                                Date *
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

                        <FormField
                          control={form.control}
                          name={`visit.${index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Heure de début</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 focus:ring-purple-500 focus:border-purple-500 w-full">
                                    <SelectValue placeholder="--:--" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-60">
                                  {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`visit.${index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Heure de fin</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 focus:ring-purple-500 focus:border-purple-500 w-full">
                                    <SelectValue placeholder="--:--" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-60">
                                  {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {index < fields.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </ScrollArea>
            </CardContent>
          </GradientCard>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto bg-transparent"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="sm:w-auto min-w-[120px] bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  {details ? "Modification" : "Enregistrement"}
                  <Spinner variant="ellipsis" />
                </div>
              ) : (
                <>
                  <Plus className=" h-4 w-4" />
                  Créer le planning
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
