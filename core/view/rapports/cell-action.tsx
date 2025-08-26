"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";

import { useModal } from "@/core/providers/modal-provider";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import { useMemo, useState } from "react";
import { toast } from "@/core/components/global/custom-toast";
import { ClipboardList, Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { CrudPermissions, RolePermission } from "@/core/lib/types";
import { definePermissions } from "@/core/lib/utils";

interface Props<T> {
  details: T;
  FormComponent: React.ComponentType<any>;
  DetailComponent?: React.ComponentType<{ data: T }>;
  DeleteHookAction: () => {
    mutate: (params: any, options?: any) => void;
    isPending: boolean;
  };
  getDeleteParamAction: (details: T) => any;
  entityName?: string;
  idField?: keyof T;
  permission?: CrudPermissions;
}

export const CellAction = <T extends Record<string, any>>({
  details,
  FormComponent,
  DetailComponent,
  DeleteHookAction,
  getDeleteParamAction,
  entityName = "l'enregistrement",
  idField = "id" as keyof T,
  permission,
}: Props<T>) => {
const { canModify, canDelete } = permission ?? { canModify: false, canDelete: false };



  const { open } = useModal();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { mutate: deleteItem, isPending: isDeleting } = DeleteHookAction();
  const [openAction, setOpen] = useState<boolean>(false);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success({
      message: "L'identifiant a été copié dans le presse-papiers",
    });
  };

  const handlShowDetail = () => {
    if (DetailComponent) {
      open(
        <CustomModal>
          <DetailComponent data={details} />
        </CustomModal>
      );
    }
  };

  const handleConfirmDelete = async () => {
    const params = getDeleteParamAction(details);
    deleteItem(params, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  };

  return (
    <>
      <FormComponent
        details={details}
        open={openAction}
        onOpenChangeAction={setOpen}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={entityName}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 hover:bg-gray-100 rounded" type="button">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {DetailComponent && (
            <DropdownMenuItem onClick={handlShowDetail}>
              <ClipboardList className="mr-2 h-4 w-4" /> Detail
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => handleCopyId(String(details[idField]))}
          >
            <Copy className="mr-2 h-4 w-4" /> Copier l'ID
          </DropdownMenuItem>

          {canModify && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </DropdownMenuItem>
          )}

          {canDelete && (
            <DropdownMenuItem
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
