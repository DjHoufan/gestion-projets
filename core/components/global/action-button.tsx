import { useState } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { useModal } from "@/core/providers/modal-provider";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";

interface ActionButtonProps<T> {
  data: T;
  useDeleteMutation: any; // Utilisez le type approprié pour votre mutation
  FormComponent: React.ComponentType<{ details: T }>;
  idKey: keyof T;
  nameKey: keyof T;
}

export const ActionButton = <T,>({
  data,
  useDeleteMutation,
  FormComponent,
  idKey,
  nameKey,
}: ActionButtonProps<T>) => {
  const { open } = useModal();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteMutation();

  const handleDelete = async () => {
    deleteItem({ [idKey]: data[idKey] });
  };

  const handleEdit = () => {
    open(
      <CustomModal>
        <FormComponent details={data} />
      </CustomModal>
    );
  };

  return (
    <>
    
      <div className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menu actions</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-lg cursor-pointer"
            >
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 rounded-lg cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash className="h-4 w-4" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
