import { DataTable } from "@/core/components/global/data-table";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import { Button } from "@/core/components/ui/button";
import { PurchaseCard } from "@/core/view/purchase/pruchase-card";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { usePurchases } from "@/core/hooks/store";
import { useDeletPurchase } from "@/core/hooks/use-purchase";
import { CrudPermissions, PurchaseDetail } from "@/core/lib/types";
import { useModal } from "@/core/providers/modal-provider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  permission: CrudPermissions;
};

export const PurchaseView = ({ permission }: Props) => {
  const { canDelete } = permission;

  const purchases = usePurchases();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null);
  const { mutate: useDelete, isPending: loading } = useDeletPurchase();

  const { open } = useModal();
  
  const purchaseColumns = [
    {
      id: "total",
      header: "Total",
      cell: ({ row }: any) => (
        <span className="font-medium">
          {row.original.total.toLocaleString()} Fdj
        </span>
      ),
      size: 120,
    },
    {
      id: "itemsCount",
      header: "Nombre d'articles",
      cell: ({ row }: any) => (
        <span>{row.original.purchaseItems.length} articles</span>
      ),
      size: 150,
    },
    {
      id: "data",
      header: "Date d'achat",
      cell: ({ row }: any) => (
        <span>
          {format(new Date(row.original.createdAt), "PPPp", { locale: fr })}
        </span>
      ),
      size: 200,
    },
    {
      id: "details",
      header: "Détails",
      cell: ({ row }: any) => {
        const purchase = row.original;

        return (
          <Button
            onClick={() =>
              open(
                <CustomModal>
                  <PurchaseCard id={purchase.id!} />
                </CustomModal>
              )
            }
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Voir détails
          </Button>
        );
      },
      size: 150,
    },

    ...(canDelete
      ? [
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }: any) => (
              <Button
                onClick={() => {
                  setPurchase(row.original);
                  setIsOpen(true);
                }}
                variant="ghost"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer"
              >
                <Trash2 />
              </Button>
            ),
            size: 100,
          },
        ]
      : []),
  ];

  const onConfirmDelete = async () => {
    useDelete(
      { param: { pId: purchase?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setPurchase(null);
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
        title={"l'achat"}
      />
      <DataTable<PurchaseDetail>
        color="bg-orange-500"
        data={purchases.data}
        columns={purchaseColumns}
        searchPlaceholder="Rechercher par nom ou date..."
        searchField="name"
        additionalSearchFields={["phone", "email", "status"]}
        canAdd={false}
        pageSize={10}
        isPending={false}
        header={false}
      />
    </>
  );
};
