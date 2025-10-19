"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { EventsSchema, EventsSchemaInput } from "@/core/lib/schemas";
import { FormProps, EventDetails } from "@/core/lib/types";
import { DatePicker } from "@/core/components/global/data-picker";
import { Spinner } from "@/core/components/ui/spinner";
import { UploadMultiFilesMinimal } from "@/core/components/global/multi-uploads";
import { useCreatEvent, useUpdateEvent } from "@/core/hooks/use-events";

export const EventForm = ({ details }: FormProps<EventDetails>) => {
  const { mutate: create, isPending: cloading } = useCreatEvent();
  const { mutate: update, isPending: uloading } = useUpdateEvent();

  let isSubmitting = cloading || uloading;

  const form = useForm<EventsSchemaInput>({
    resolver: zodResolver(EventsSchema),
    defaultValues: {
      titre: details?.titre || "",
      date: details?.date || new Date(),
      files: details?.files || [],
    },
  });

  const handleSubmit = async (data: EventsSchemaInput) => {
    if (details) {
      update({
        json: data,
        param: {
          eventId: details.id,
        },
      });
    } else {
      create({ json: data });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4"
      >
        <FormField
          control={form.control}
          name="titre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'événement</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="Ex: Formation sur les techniques agricoles"
                  {...field}
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

        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-700 font-semibold">
                Fichiers
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <UploadMultiFilesMinimal
                    valuetab={field.value || []}
                    disabled={isSubmitting}
                    onChangeAction={(value) => {
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isSubmitting}
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
          }}
        >
          Annuler
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
        >
          {isSubmitting
            ? details
              ? "Modification"
              : "Enregistrement"
            : details
            ? "Modifier"
            : "       Créer événement"}
          {isSubmitting && <Spinner variant="ellipsis" />}
        </Button>
      </form>
    </Form>
  );
};
