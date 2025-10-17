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
import { AlertCircle, Check } from "lucide-react";
import {
  useCreateSignalement,
  useUpdateSignalement,
} from "@/core/hooks/use-superivision";
import { Spinner } from "@/core/components/ui/spinner";
import { SignalementSchema, SignalementSchemaInput } from "@/core/lib/schemas";

interface SignalementFormProps {
  onClose: () => void;
  groupesAccompagnement?: Array<{ id: string; name: string }>;
  userId?: string;
  supId: string;
  accompagnateurName?: string;
}

const typesSignalement = [
  { value: "observation", label: "Observation" },
  { value: "incident", label: "Incident" },
  { value: "probleme", label: "Problème" },
  { value: "suggestion", label: "Suggestion" },
  { value: "urgence", label: "Urgence" },
  { value: "autre", label: "Autre" },
];

export default function SignalementForm({
  onClose,
  supId,
  groupesAccompagnement = [],
  userId,
  accompagnateurName,
}: SignalementFormProps) {
  const { mutate: create, isPending: isSubmitting } = useCreateSignalement();

  const form = useForm<SignalementSchemaInput>({
    resolver: zodResolver(SignalementSchema),
    defaultValues: {
      type: "",
      groupeId: "",
      userId: userId,
      supId: supId,
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
            {groupesAccompagnement.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {groupesAccompagnement.length} groupe
                {groupesAccompagnement.length > 1 ? "s" : ""} d'accompagnement
                disponible{groupesAccompagnement.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center gap-5">
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

          {/* Groupe d'accompagnement */}
          <FormField
            control={form.control}
            name="groupeId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-700 font-semibold">
                  Groupe d'accompagnement
                </FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Sélectionnez un groupe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {groupesAccompagnement.length > 0 ? (
                      groupesAccompagnement.map((groupe) => (
                        <SelectItem key={groupe.id} value={groupe.id}>
                          {groupe.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="default" disabled>
                        Aucun groupe disponible
                      </SelectItem>
                    )}
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
            onClick={onClose}
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
