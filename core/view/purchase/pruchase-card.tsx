import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/core/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { PruchaseItemForm } from "@/core/view/purchase/purchaseItem-form";
import { usePurchases } from "@/core/hooks/store";
import { useDeletPurchaseItem } from "@/core/hooks/use-purchase";
import { PurchaseItems } from "@prisma/client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export const PurchaseCard = ({ id }: { id: string }) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const purchase = usePurchases().getById(id)!;

  console.log({purchase});
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [purchaseItem, setPurchaseItem] = useState<PurchaseItems | null>(null);
  const { mutate: useDelete, isPending: loading } = useDeletPurchaseItem();

  const onConfirmDelete = async () => {
    useDelete(
      { param: { pItemId: purchaseItem?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setPurchaseItem(null);
        },
      }
    );
  };
  return (
    <>
      <DeleteConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
        title={`${purchaseItem?.name} `}
      />
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className=" sm:w-[550px] p-5 sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Ajouter un article</SheetTitle>
            <SheetDescription>
              Remplissez les informations pour ajouter un nouvel article.
            </SheetDescription>
          </SheetHeader>

          <PruchaseItemForm
            closeAction={setIsSheetOpen}
            purchaseId={purchase.id}
          />
        </SheetContent>
      </Sheet>

      <Card className="max-w-4xl">
        <CardHeader className="w-full   flex items-center justify-between">
          <CardTitle>Détails de l'achat</CardTitle>

          <Button
            onClick={() => {
              setIsSheetOpen(true);
            }}
          >
            Ajouter un article
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-medium">
                {purchase.total.toLocaleString()} Fdj
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {format(new Date(purchase.createdAt), "PPPp", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>

         <ScrollArea className="max-h-[600px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Facture</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchase.purchaseItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={item.facture || "/placeholder.svg"}
                          alt={`Facture ${item.name}`}
                          className="h-20 w-20 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          crossOrigin="anonymous"
                          onClick={() => {
                            setPreviewImage(item.facture)
                            setPreviewTitle(`Facture - ${item.name}`)
                          }}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPreviewImage(item.facture)
                              setPreviewTitle(`Facture - ${item.name}`)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadImage(item.facture, `facture-${item.name}.png`)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-20 w-20 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          crossOrigin="anonymous"
                          onClick={() => {
                            setPreviewImage(item.image)
                            setPreviewTitle(`Image - ${item.name}`)
                          }}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPreviewImage(item.image)
                              setPreviewTitle(`Image - ${item.name}`)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadImage(item.image, `${item.name}.png`)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{Number.parseFloat(item.price).toLocaleString()} Fdj</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{(Number.parseFloat(item.price) * item.quantity).toLocaleString()} Fdj</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setPurchaseItem(item)
                          setIsOpen(true)
                        }}
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 className="text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};

 