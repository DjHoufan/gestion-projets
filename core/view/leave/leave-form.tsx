import { leaveDetail, MemberDetailWP } from "@/core/lib/types";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Boxes, CalendarIcon, Plus, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { cn } from "@/core/lib/utils";
import { LeaveSchema, LeaveSchemaInput } from "@/core/lib/schemas";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { DatePicker } from "@/core/components/global/data-picker";
import { useGetPojet } from "@/core/hooks/use-projet";
import { useGetMembers } from "@/core/hooks/use-member";
import SearchSelect from "@/core/components/global/search_select";
import { useModal } from "@/core/providers/modal-provider";
import { useCreatLeave, useUpdateleave } from "@/core/hooks/use-leave";
import { Spinner } from "@/core/components/ui/spinner";
 

type Props = {
  details?: leaveDetail;
  projectId?: string;
  cmembers: MemberDetailWP[];
};

const LeaveForm = ({ details, projectId, cmembers }: Props) => {
  const { close } = useModal();
  const { data: projects, isPending: pPending } = useGetPojet();
  const hasLocalMembers = cmembers.length > 0;

  const { data: members, isPending } = useGetMembers(!hasLocalMembers);
  const finalMembers = hasLocalMembers ? cmembers : members;
  const finalPending = hasLocalMembers ? false : isPending;

  const { mutate: create, isPending: cloading } = useCreatLeave();
  const { mutate: update, isPending: uloading } = useUpdateleave();

  let isLoading = cloading || uloading;

  const form = useForm<LeaveSchemaInput>({
    resolver: zodResolver(LeaveSchema),
    defaultValues: {
      reason: details?.reason || "",
      date: details?.date || new Date(Date.now()),
      memberId: details?.memberId || "",
      projectId: details?.projectId || projectId || "",
    },
  });

  const handleSubmit = async (data: LeaveSchemaInput) => {
    if (details) {
      update({
        json: data,
        param: {
          lId: details.id,
        },
      });
    } else {
      create({ json: data });
    }
  };

  return (
    <Card className="p-5 border-0">
      <CardHeader>
        <CardTitle>{details ? "Enregistre" : "Modifier"} un abandon</CardTitle>
        <CardDescription>
          Remplissez le formulaire pour soumettre les données de l'abandon.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Champ Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-emerald-700 font-semibold">
                  Date de congé *
                </FormLabel>
               <DatePicker 
                  disabled={isLoading}
                  position="center"
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center gap-5">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <SearchSelect
                      Icon={Users}
                      items={finalMembers ? finalMembers : []}
                      onChangeValue={field.onChange}
                      loading={finalPending}
                      selectedId={field.value ?? ""}
                      disabled={finalPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <SearchSelect
                      Icon={Boxes}
                      items={projects ? projects : []}
                      onChangeValue={field.onChange}
                      loading={pPending}
                      selectedId={projectId ?? field.value ?? ""}
                      disabled={projectId ? true : pPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Champ Raison */}
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-700 font-semibold">
                  Raison de l'abandon *
                </FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder="Décrivez la raison de votre demande de congé..."
                    className="bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <div className="text-xs text-muted-foreground text-right">
                  {field.value?.length || 0}/1000
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => close()}
              disabled={isLoading}
              className="rounded-xl h-12 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 transition-all duration-200"
            >
              {isLoading
                ? details
                  ? "Modification"
                  : "Enregistrement"
                : details
                ? "Modifier"
                : "Enregistrer"}
              {isLoading && <Spinner variant="ellipsis" />}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default LeaveForm;
