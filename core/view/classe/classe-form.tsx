"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Boxes, Shapes, SquareUser } from "lucide-react";

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
import { Classe, Member } from "@prisma/client";
import { FormProps } from "@/core/lib/types";
import { ClasseSchema, ClasseSchemaInput } from "@/core/lib/schemas";

import { Spinner } from "@/core/components/ui/spinner";

import { ScrollArea } from "@/core/components/ui/scroll-area";
import { useGetPojet } from "@/core/hooks/use-projet";
import SearchSelect from "@/core/components/global/search_select";
import { useCreateClasse, useUpdateClasse } from "@/core/hooks/use-classe";
import { useGetTrainers } from "@/core/hooks/use-teams";

export const ClasseForm = ({ details }: FormProps<Classe>) => {
  const { mutate: create, isPending: cloading } = useCreateClasse();
  const { mutate: update, isPending: uloading } = useUpdateClasse();
  const { data: projets, isPending: projetLoading } = useGetPojet();
  const { data: formateurs, isPending: fLoading } = useGetTrainers();

  const form = useForm<ClasseSchemaInput>({
    resolver: zodResolver(ClasseSchema),
    defaultValues: {
      projectId: details?.projectId || "",
      usersId: details?.usersId || "",
      name: details?.name || "",
    },
  });

  let isSubmitting = cloading || uloading;

  const handleSubmit = async (data: ClasseSchemaInput) => {
    if (details) {
      update({
        json: data,
        param: {
          cId: details.id,
        },
      });
    } else {
      create({ json: data });
    }
  };

 

  return (
    <div className="p-6 bg-white rounded-lg    ">
      <h2 className="text-2xl font-bold text-emerald-800 mb-6">
        Détails de la classe
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 p-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-700 font-semibold">
                  Nom de la classe*
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Shapes className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                    <Input
                      disabled={isSubmitting}
                      placeholder="Nom de la classe"
                      className="pl-10 bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl h-12"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="w-full"
                      Icon={Boxes}
                      items={projets ? projets : []}
                      onChangeValue={field.onChange}
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
              name="usersId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-emerald-700 font-semibold">
                    Formateur / Formatrice
                  </FormLabel>
                  <FormControl className="w-full">
                    <SearchSelect
                      className="w-full"
                      Icon={SquareUser}
                      items={formateurs ? formateurs : []}
                      onChangeValue={field.onChange}
                      loading={fLoading}
                      selectedId={field.value}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
    </div>
  );
};
