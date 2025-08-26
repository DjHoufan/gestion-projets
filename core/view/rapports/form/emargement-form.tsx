"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmargementSchema,
  type EmargementSchemaInput,
} from "@/core/lib/schemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Textarea } from "@/core/components/ui/textarea";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Check, IdCardLanyard, Upload, Users } from "lucide-react";

import { DatePicker } from "@/core/components/global/data-picker";
import ImageUpload from "@/core/components/global/upload-image";
import { useGetMembers } from "@/core/hooks/use-member";
import { useGetAccompanist } from "@/core/hooks/use-teams";
import SearchSelect from "@/core/components/global/search_select";
import {
  useCreateEmargement,
  useUpdateEmargement,
} from "@/core/hooks/use-rapport";
import { EmargementDetail } from "@/core/lib/types";
import { Spinner } from "@/core/components/ui/spinner";
import { useModal } from "@/core/providers/modal-provider";

interface Props {
  details?: EmargementDetail;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function EmargementForm({ details, open, onOpenChangeAction }: Props) {
  const { close } = useModal();
  const { data: members, isPending: loadingMembers } = useGetMembers();
  const { data: users, isPending: loadingUsers } = useGetAccompanist();

  const { mutate: create, isPending: cloading } = useCreateEmargement();
  const { mutate: update, isPending: uloading } = useUpdateEmargement();

  let loading = cloading || uloading;

  const form = useForm<EmargementSchemaInput>({
    resolver: zodResolver(EmargementSchema),
    defaultValues: {
      PhotoCni: details?.PhotoCni || "",
      cni: details?.cni || "",
      date: details?.date || new Date(),
      signature: details?.signature ?? false,
      montant: details?.montant || 0,
      observations: details?.observations || "",
      usersId: details?.usersId || "",
      memberId: details?.memberId || "",
    },
  });

  const reset = () => {
    close();
    form.reset();
    onOpenChangeAction(false);
  };

  const onSubmit = (data: EmargementSchemaInput) => {
    if (details) {
      update(
        { json: data, param: { emId: details.id } },
        {
          onSuccess: () => reset(),
        }
      );
    } else {
      create(
        { json: data },
        {
          onSuccess: () => reset(),
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction} >
      <DialogContent className="!max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 text-white rounded-lg">
              <Upload className="h-5 w-5" />
            </div>
            Formulaire d'Émargement
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between items-center gap-5">
              <FormField
                control={form.control}
                name="PhotoCni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Photo CNI *</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ? field.value : ""}
                        disabled={loading}
                        onChange={(url) => field.onChange(url)}
                        folder="cni"
                        buttonPosition="top-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full space-y-7">
                <FormField
                  control={form.control}
                  name="cni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro CNI *</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Numéro de CNI"
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Date *</FormLabel>
                      <DatePicker
                        disabled={loading}
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
                  name="montant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant *</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        items={users ? users : []}
                        onChangeValue={field.onChange}
                        loading={loadingUsers}
                        selectedId={field.value ?? ""}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="memberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bénéficiaire</FormLabel>
                    <FormControl>
                      <SearchSelect
                        className="w-full"
                        Icon={Users}
                        items={members ? members : []}
                        onChangeValue={field.onChange}
                        loading={loadingMembers}
                        selectedId={field.value ?? ""}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      disabled={loading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Signature confirmée</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Cochez cette case pour confirmer la signature
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observations</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Observations supplémentaires..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  close();
                  onOpenChangeAction(false);
                }}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    {details ? "Modification" : "Enregistrement"}
                    <Spinner variant="ellipsis" />
                  </div>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {details ? "Modifier" : " Enregistre"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
