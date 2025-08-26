"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 
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
import { UploadSchema, UploadSchemaInput } from "@/core/lib/schemas";
import SearchSelect from "@/core/components/global/search_select";
import { Contact, Plus, Upload } from "lucide-react";
import { useGetTrainers } from "@/core/hooks/use-teams";
import {  UploadDetail } from "@/core/lib/types";
import { DatePicker } from "@/core/components/global/data-picker";
import { UploadMultiFilesMinimal } from "@/core/components/global/multi-uploads";
import { Spinner } from "@/core/components/ui/spinner";
import { useCreateTrainer, useUpdateTrainer } from "@/core/hooks/use-trainer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";

interface Props {
  details?: UploadDetail;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  userId?: string;
}

export const RapportTrainerForm = ({
  details,
  userId,
  onOpenChangeAction,
  open,
}: Props) => {
  const { data: trainers, isPending } = useGetTrainers();

  const { mutate: create, isPending: cloading } = useCreateTrainer();
  const { mutate: update, isPending: uloading } = useUpdateTrainer();

  const form = useForm<UploadSchemaInput>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      titre: details?.titre || "",
      date: details?.date || new Date(),
      userId: userId || details?.userId || "",
      file: details?.file || null,
    },
  });

  let isSubmitting = cloading || uloading;

  const onSubmit = async (data: UploadSchemaInput) => {
    if (details) {
      update({
        json: data,
        param: {
          tId: details.id,
        },
      });
    } else {
      create({ json: data });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="!max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 text-white rounded-lg">
              <Upload className="h-5 w-5" />
            </div>
            {details ? "Modifier le rapport" : "Nouveau Rapport "}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Champ ID (optionnel) */}

            <div className="flex w-full justify-between items-center gap-5">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Formateur *</FormLabel>
                    <FormControl>
                      <SearchSelect
                        className="w-full"
                        Icon={Contact}
                        items={trainers ? trainers : []}
                        onChangeValue={field.onChange}
                        loading={isPending}
                        selectedId={userId ? userId : field.value}
                        disabled={userId ? true : isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Champ Titre */}
              <FormField
                control={form.control}
                name="titre"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Titre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le titre du document"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Champ Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date *</FormLabel>
                  <FormControl>
                    <DatePicker
                      disabled={isSubmitting}
                      position="center"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ Fichier */}
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-emerald-700 font-semibold">
                    Fichiers
                  </FormLabel>
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

            {/* Boutons */}
            <div className="w-full flex justify-end">
              <Button
                className="!px-12 rounded"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {isSubmitting
                  ? details
                    ? "Modification"
                    : "Enregistrement"
                  : details
                  ? "Modifier"
                  : "Enregistrer"}

                {isSubmitting ? <Spinner variant="circle" /> : <Plus />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
