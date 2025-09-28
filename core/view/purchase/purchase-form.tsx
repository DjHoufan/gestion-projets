"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/core/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Plus, Trash2, Edit, Minus, Eye, Boxes, Check } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { useState } from "react";
import {
  PurchaseItemSchema,
  PurchaseItemSchemaInput,
  PurchaseSchema,
  PurchaseSchemaInput,
} from "@/core/lib/schemas";
import ImageUpload from "@/core/components/global/upload-image";
import { DatePicker } from "@/core/components/global/data-picker";
import { FormProps, PurchaseDetail } from "@/core/lib/types";
import SearchSelect from "@/core/components/global/search_select";
import {
  useGetAccompaniments,
  useGetMyAccompaniments,
} from "@/core/hooks/use-accompaniment";
import {
  useCreatePurchase,
  useUpdatePurchase,
} from "@/core/hooks/use-purchase";
import { Spinner } from "@/core/components/ui/spinner";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const QuantityControl = ({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
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
        disabled={value <= min}
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
        disabled={value >= max}
        className="h-8 w-8 p-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ArticleForm = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: {
  onSubmit: (data: PurchaseItemSchemaInput) => void;
  onCancel: () => void;
  initialData?: PurchaseItemSchemaInput;
  isEditing?: boolean;
}) => {
  const articleForm = useForm<PurchaseItemSchemaInput>({
    resolver: zodResolver(PurchaseItemSchema),
    defaultValues: initialData || {
      name: "",
      price: "",
      quantity: 1,
      image: "",
      facture: "",
      date: new Date(),
    },
  });

  const handleSubmit = (data: PurchaseItemSchemaInput) => {
    onSubmit(data);
    articleForm.reset();
  };

  return (
    <div className=" h-[800px] overflow-y-auto">
      <Form {...articleForm}>
        <form
          onSubmit={(e) => {
            e.stopPropagation(); // Empêche la propagation de l'événement
            articleForm.handleSubmit(handleSubmit)(e); // Exécute la soumission du formulaire
          }}
          className="space-y-4  p-5 "
        >
          <div className="flex justify-between gap-5">
            <FormField
              control={articleForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nom de l'article</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pizza Margherita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={articleForm.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Prix unitaire</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 2500 DJF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={articleForm.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl>
                  <QuantityControl
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={articleForm.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>l'image de l'article *</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? field.value : ""}
                    disabled={false}
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
            control={articleForm.control}
            name="facture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facture *</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? field.value : ""}
                    disabled={false}
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
            control={articleForm.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <DatePicker
                  disabled={false}
                  position="top"
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? "Modifier" : "Ajouter"} l'article
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export const PurchaseForm = ({
  details,
  Id,
}: FormProps<PurchaseDetail> & {
  Id?: string;
}) => {
  const { data: projets, isPending } = useGetAccompaniments();

  const { mutate: create, isPending: cloading } = useCreatePurchase();
  const { mutate: updates, isPending: uloading } = useUpdatePurchase();

  let isSubmitting = cloading || uloading;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<PurchaseSchemaInput>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      purchaseItems:
        details?.purchaseItems?.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          date: item.date,
        })) || [],
      accompanimentId: details?.accompanimentId || Id || "",
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "purchaseItems",
  });

  const handleSubmit = (data: PurchaseSchemaInput) => {
    if (details) {
      updates({
        json: data,
        param: {
          pId: details.id,
        },
      });
    } else {
      create({ json: data });
    }
  };

  const handleAddArticle = (articleData: PurchaseItemSchemaInput) => {
    if (editingIndex !== null) {
      update(editingIndex, articleData);
      setEditingIndex(null);
    } else {
      append(articleData);
    }
    setIsSheetOpen(false);
  };

  const handleEditArticle = (index: number) => {
    setEditingIndex(index);
    setIsSheetOpen(true);
  };

  const handleCancelArticle = () => {
    setIsSheetOpen(false);
    setEditingIndex(null);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    const currentItem = fields[index];
    update(index, { ...currentItem, quantity: newQuantity });
  };

  const calculateTotal = () => {
    return fields.reduce((total, item) => {
      const price = Number.parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return fields.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="max-w-6xl h-[80vh] mx-auto p-6 space-y-6 ">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Achats</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Section Articles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Articles d'achat</h3>
                    <p className="text-sm text-muted-foreground">
                      {fields.length} article{fields.length > 1 ? "s" : ""} •{" "}
                      {getTotalItems()} unité
                      {getTotalItems() > 1 ? "s" : ""} • Total:{" "}
                      {calculateTotal().toFixed(0)} DJF
                    </p>
                  </div>

                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        disabled={isSubmitting}
                        onClick={() => setEditingIndex(null)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un article
                      </Button>
                    </SheetTrigger>
                    <SheetContent className=" sm:w-[550px]   sm:max-w-none">
                      <SheetHeader>
                        <SheetTitle>
                          {editingIndex !== null
                            ? "Modifier l'article"
                            : "Ajouter un article"}
                        </SheetTitle>
                        <SheetDescription>
                          {editingIndex !== null
                            ? "Modifiez les informations de l'article ci-dessous."
                            : "Remplissez les informations pour ajouter un nouvel article."}
                        </SheetDescription>
                      </SheetHeader>

                      <ArticleForm
                        onSubmit={handleAddArticle}
                        onCancel={handleCancelArticle}
                        initialData={
                          editingIndex !== null
                            ? fields[editingIndex]
                            : undefined
                        }
                        isEditing={editingIndex !== null}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Tableau des articles */}
                {fields.length > 0 ? (
                  <ScrollArea className="h-[250px] overflow-auto">
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Facture</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Article</TableHead>
                            <TableHead>Prix unitaire</TableHead>
                            <TableHead>Quantité</TableHead>
                            <TableHead>Sous-total</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => {
                            const unitPrice =
                              Number.parseFloat(
                                field.price.replace(/[^\d.]/g, "")
                              ) || 0;
                            const subtotal = unitPrice * field.quantity;

                            return (
                              <TableRow key={field.id}>
                                <TableCell>
                                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                    {field.facture ? (
                                      <img
                                        src={
                                          field.facture || "/placeholder.svg"
                                        }
                                        alt={field.facture}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                    {field.image ? (
                                      <img
                                        src={field.image || "/placeholder.svg"}
                                        alt={field.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{field.name}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">
                                    {field.price}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <QuantityControl
                                    value={field.quantity}
                                    onChange={(newQuantity) =>
                                      updateQuantity(index, newQuantity)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium">
                                    {subtotal.toFixed(0)} DJF
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {format(field.date, "dd/MM/yyyy", {
                                    locale: fr,
                                  })}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditArticle(index)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => remove(index)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-500">
                      <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        Aucun article ajouté
                      </p>
                      <p className="text-sm">
                        Cliquez sur "Ajouter un article" pour commencer
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Section Accompagnements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Groupe</h3>
                <FormField
                  control={form.control}
                  name="accompanimentId"
                  render={({ field }) => (
                    <FormItem>
                      <SearchSelect
                        className="w-full"
                        Icon={Boxes}
                        items={projets ? projets : []}
                        onChangeValue={field.onChange}
                        loading={isPending}
                        selectedId={Id ? Id : field.value}
                        disabled={Id ? true : isSubmitting}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Résumé et boutons d'action */}
              {fields.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Nombre total d'articles:
                      </span>
                      <span className="font-medium">
                        {getTotalItems()} unité{getTotalItems() > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total de la commande:</span>
                      <span className="text-xl font-bold">
                        {calculateTotal().toFixed(0)} DJF
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          {details ? "Modification" : "Enregistrement"}
                          <Spinner variant="ellipsis" />
                        </div>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          {details ? "Modifier l'achat" : "Enregistrer l'achat"}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
