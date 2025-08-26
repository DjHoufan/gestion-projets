"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Button } from "@/core/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
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

import { DatePicker } from "../../components/global/data-picker";
import { FormProps, ProjectDetail } from "@/core/lib/types";
import { projetSchema, ProjetSchemaType } from "@/core/lib/schemas";
import { useCreateProjet, useUpdateProjet } from "@/core/hooks/use-projet";

export function ProjectForm({ details }: FormProps<ProjectDetail>) {
  const { mutate: create, isPending: cloading } = useCreateProjet();
  const { mutate: update, isPending: uloading } = useUpdateProjet();

  let isSubmitting = cloading || uloading;

  const form = useForm<ProjetSchemaType>({
    resolver: zodResolver(projetSchema),
    defaultValues: {
      name: details?.name || "",
      local: details?.local || "",
      startDate: details?.startDate || new Date(),
      endDate: details?.endDate || new Date(),
    },
  });

  const handleSubmit = async (data: ProjetSchemaType) => {
    if (details) {
      update({
        json: data,
        param: {
          projetId: details.id,
        },
      });
    } else {
      create({ json: data });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {details ? "Modifier le projet" : "Nouveau projet"}
        </CardTitle>
        <CardDescription>
          {details
            ? "Modifiez les informations du projet ci-dessous."
            : "Créez un nouveau projet en remplissant les informations ci-dessous."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="flex justify-between items-center gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nom du projet</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom du projet" {...field} />
                    </FormControl>
                    <FormDescription>
                      Le nom doit contenir entre 1 et 25 caractères.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Le lieu du projet</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le lieu du projet"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Le lieu doit contenir entre 1 et 25 caractères.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début</FormLabel>
                    <DatePicker
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
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin</FormLabel>
                    <DatePicker
                      position="center"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline">
                Annuler
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "En cours..."
                  : details
                  ? "Modifier"
                  : "Créer le projet"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
