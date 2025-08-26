"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { MapPin, Loader2, CreditCardIcon, Boxes } from "lucide-react";
import { FormProps, MapDetail } from "@/core/lib/types";
import { MapsSchema, MapsSchemaInput } from "@/core/lib/schemas";
import { useGetAccompaniments } from "@/core/hooks/use-accompaniment";
import { Spinner } from "@/core/components/ui/spinner";
import SearchSelect from "@/core/components/global/search_select";
import { useCreateMaps, useUpdateMaps } from "@/core/hooks/use-maps";
import { toast } from "@/core/components/global/custom-toast";

export default function MapsForm({
  id,
  details,
  edited,
}: FormProps<MapDetail> & { edited: boolean; id: string }) {
  const { data: projets, isPending: Loading } = useGetAccompaniments();

  const { mutate: create, isPending: cloading } = useCreateMaps();
  const { mutate: update, isPending: uloading } = useUpdateMaps();

  let isSubmitting = cloading || uloading;

  const form = useForm<MapsSchemaInput>({
    resolver: zodResolver(MapsSchema),
    defaultValues: {
      accompanimentId: details?.accompanimentId || id,
      latitude: details?.latitude || "",
      longitude: details?.longitude || "",
    },
  });

  const handleSubmit = (data: MapsSchemaInput) => {
    if (edited) {
      update({
        json: data,
        param: {
          mapId: details?.id!,
        },
      });
    } else {
      create({ json: data });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude.toString());
          form.setValue("longitude", position.coords.longitude.toString());
        },
        (error) => {
          toast.error({ message: "Error getting location:", error });
        }
      );
    } else {
      toast.error({ message: "Geolocation is not supported by this browser." });
    }
  };

  return (
    <Card className="w-full  border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localisation
        </CardTitle>
        <CardDescription>
          Définir la position géographique pour l'accompagnement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="accompanimentId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4" /> Accompagnament
                  </FormLabel>
                  <FormControl className="w-full">
                    <SearchSelect
                      className="w-full"
                      Icon={Boxes}
                      items={projets ? projets : []}
                      onChangeValue={field.onChange}
                      loading={Loading}
                      selectedId={field.value}
                      disabled={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 48.8566" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2.3522" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              className="w-full bg-transparent"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Utiliser ma position actuelle
            </Button>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {edited ? "Modification" : "Enregistrement"}
                  <Spinner variant="bars" />
                </>
              ) : edited ? (
                "Modifier la localisation"
              ) : (
                "Enregistrer la localisation"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
