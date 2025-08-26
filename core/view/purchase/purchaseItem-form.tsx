"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";

import { Plus, Minus, Check } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";

import {
  PurchaseItemSchema,
  PurchaseItemSchemaInput,
} from "@/core/lib/schemas";
import ImageUpload from "@/core/components/global/upload-image";
import { DatePicker } from "@/core/components/global/data-picker";
import { FormProps } from "@/core/lib/types";
import { PurchaseItems } from "@prisma/client";
import { useCreatePurchaseItem } from "@/core/hooks/use-purchase";
import { Spinner } from "@/core/components/ui/spinner";

const QuantityControl = ({
  value,
  onChange,
  disabled,
  min = 2,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled: boolean;
}) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={decrement}
        disabled={value <= min || disabled}
        className="h-8 w-8 p-0 bg-transparent"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="w-12 text-center">
        <span className="text-sm font-medium">{value}</span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={increment}
        disabled={value >= max || disabled}
        className="h-8 w-8 p-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const PruchaseItemForm = ({
  details,
  closeAction,
  purchaseId,
}: FormProps<PurchaseItems> & {
  closeAction: (value: boolean) => void;
  purchaseId: string;
}) => {
  const { mutate: create, isPending: cloading } = useCreatePurchaseItem();

  let isSubmitting = cloading;

  const form = useForm<PurchaseItemSchemaInput>({
    resolver: zodResolver(PurchaseItemSchema),
    defaultValues: {
      name: details?.name || "",
      price: details?.price || "",
      image: details?.image || "",
      quantity: details?.quantity || 1,
      date: details?.date || new Date(),
      purchaseId: details?.purchaseId || purchaseId,
    },
  });

  const handleSubmit = (data: PurchaseItemSchemaInput) => {
    create(
      { json: data },
      {
        onSuccess: () => {
          form.reset();
          closeAction(false);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.stopPropagation(); // Empêche la propagation de l'événement
          form.handleSubmit(handleSubmit)(e); // Exécute la soumission du formulaire
        }}
        className="space-y-4"
      >
        <div className="flex justify-between gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nom de l'article</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Ex: Pizza Margherita"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Prix unitaire</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Ex: 2500 DJF"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité</FormLabel>
              <FormControl>
                <QuantityControl
                  disabled={isSubmitting}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image</FormLabel>
              <FormControl>
                <ImageUpload
                  disabled={isSubmitting}
                  value={field.value ? field.value : ""}
                  onChange={(url) => field.onChange(url)}
                  folder="images"
                  buttonPosition="top-right"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <DatePicker
                disabled={isSubmitting}
                position="top"
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button disabled={isSubmitting} type="submit" className="flex-1">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                {details ? "Modification" : "Enregistrement"}
                <Spinner variant="ellipsis" />
              </div>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {details ? "Modifier l'article" : "Enregistrer l'article"}
              </>
            )}
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() => closeAction(false)}
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  );
};
