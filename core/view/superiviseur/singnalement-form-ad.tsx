"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Textarea } from "@/core/components/ui/textarea";
import { AlertCircle, Boxes, Check, CreditCardIcon } from "lucide-react";
import {
  useCreateSignalement,
  useUpdateStatusSignalement,
} from "@/core/hooks/use-superivision";
import { Spinner } from "@/core/components/ui/spinner";
import { SignalementSchema, SignalementSchemaInput } from "@/core/lib/schemas";
import { useGetAccompaniments } from "@/core/hooks/use-accompaniment";
import { useState } from "react";
import { useModal } from "@/core/providers/modal-provider";
import Search_select from "@/core/components/global/search_select";

const typesSignalement = [
  { value: "observation", label: "Observation" },
  { value: "incident", label: "Incident" },
  { value: "probleme", label: "Problème" },
  { value: "suggestion", label: "Suggestion" },
  { value: "urgence", label: "Urgence" },
  { value: "autre", label: "Autre" },
];

export default function SignalementFormAd() {
  const { close } = useModal();
  const { mutate: create, isPending: isSubmitting } = useCreateSignalement();
  const { data: groupesAccompagnement, isPending: gloading } =
    useGetAccompaniments();
  const [accompagnateurName, setAccompagnateurName] = useState<string>("");

  const form = useForm<SignalementSchemaInput>({
    resolver: zodResolver(SignalementSchema),
    defaultValues: {
      type: "",
      groupeId: "",
      userId: "",
      supId: "",
      description: "",
    },
  });

  const onSubmit = async (data: SignalementSchemaInput) => {
    create({ json: data });
  };

  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Affichage de l'accompagnateur sélectionné */}
        {accompagnateurName && (
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">
              Accompagnateur concerné
            </p>
            <p className="text-lg font-bold text-teal-800">
              {accompagnateurName}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center gap-5">
          <FormField
            control={form.control}
            name="groupeId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                  <CreditCardIcon className="h-4 w-4" /> Project
                </FormLabel>
                <FormControl className="w-full">
                  <Search_select
                    className="w-full"
                    Icon={Boxes}
                    items={groupesAccompagnement ? groupesAccompagnement : []}
                    onChangeValue={(value) => {
                      field.onChange(value);
                      const selected = groupesAccompagnement?.find(
                        (f) => f.id === value
                      );

                      setAccompagnateurName(selected?.users?.name ?? "");
                      form.setValue("userId", selected?.users?.id ?? "");
                      form.setValue(
                        "supId",
                        selected?.users?.supervisorId ?? ""
                      );
                    }}
                    loading={gloading}
                    selectedId={field.value}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type de signalement */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-teal-600" />
                  Type de signalement
                </FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typesSignalement.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold">
                Description détaillée
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  placeholder="Décrivez le signalement en détail..."
                  className="min-h-[150px] border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boutons d'action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            className="border-gray-300 hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button
            disabled={isSubmitting}
            type="submit"
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 gap-2"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                Enregistrement
                <Spinner variant="ellipsis" />
              </div>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Enregistre le signalement
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
