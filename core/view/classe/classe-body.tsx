"use client";
import { DataTable } from "@/core/components/global/data-table";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { useDeletClasse, useGetClasses } from "@/core/hooks/use-classe";
import { ClasseDetail, PermissionProps } from "@/core/lib/types";
import { definePermissions } from "@/core/lib/utils";
import { useModal } from "@/core/providers/modal-provider";
import { ClasseForm } from "@/core/view/classe/classe-form";
import { format } from "date-fns";
import {
  Edit,
  LinkIcon,
  MoreHorizontal,
  NotebookText,
  SquareUser,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ClasseBody = ({ permission }: PermissionProps) => {
  const { canAdd, canModify, canDelete, canDetails } = useMemo(() => {
    return definePermissions(permission, "classes");
  }, [permission]);

  const { data: classes, isPending } = useGetClasses();
  const [classe, setclasse] = useState<ClasseDetail | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: useDelete, isPending: loading } = useDeletClasse();

  const router = useRouter();
  const { open } = useModal();

  const columns = [
    {
      header: "Classe",
      accessorKey: "name",
      cell: ({ row }: any) => (
        <div className="flex justify-center items-center  *:">
          <span className="block uppercase w-5/6  ">{row.original.name}</span>
        </div>
      ),
    },

    {
      id: "user",
      header: "Formateur/Formatrice",
      cell: ({ row }: any) => {
        const user = row.original.user;
        const gender = user.gender.toLowerCase();
        const genderMap = {
          homme: {
            label: "Homme",
            class: "bg-blue-100 text-blue-800 border-blue-200",
          },
          femme: {
            label: "Femme",
            class: "bg-pink-100 text-pink-800 border-pink-200",
          },
        };
        const genderConfig = genderMap[gender as keyof typeof genderMap] || {
          label: user.gender,
          class: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-primary-200">
              <AvatarImage src={user.profile || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <span className="font-medium text-primary-900">{user.name}</span>
              <div className="flex justify-between items-center gap-5 w-full">
                <span className="text-xs text-primary-600">{user.phone}</span>
                <Badge
                  variant="outline"
                  className={`${genderConfig.class} font-medium capitalize`}
                >
                  {genderConfig.label}
                </Badge>
              </div>
            </div>
          </div>
        );
      },
    },

    {
      id: "project",
      header: "Projet",
      cell: ({ row }: any) => {
        const project = row.original.project;
        return (
          <div className="flex flex-col justify-center gap-1">
            <p className="block font-medium">{project.name}</p>
            <p className="block text-xs text-gray-500">
              <span className="pr-2"> {project.local} •</span>
              {format(new Date(project.startDate), "dd/MM/yyyy")} -{" "}
              {format(new Date(project.endDate), "dd/MM/yyyy")}
            </p>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const item = row.original;
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {canDetails && (
                  <DropdownMenuItem
                    onClick={() => router.push(`/classes/${item.id}`)}
                    className="flex items-center gap-2 rounded-lg cursor-pointer"
                  >
                    <NotebookText className="h-4 w-4" />
                    Details
                  </DropdownMenuItem>
                )}
                {canModify && (
                  <DropdownMenuItem
                    onClick={() =>
                      open(
                        <CustomModal>
                          <ClasseForm details={item} />
                        </CustomModal>
                      )
                    }
                    className="flex items-center gap-2 rounded-lg cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                )}

                {canDelete && (
                  <DropdownMenuItem
                    onClick={() => {
                      setclasse(item);
                      setIsOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-lg cursor-pointer"
                  >
                    <Trash className="textre h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const onConfirmDelete = async () => {
    useDelete(
      { param: { cId: classe?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setclasse(null);
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
        title={`${classe?.name!}`}
      />

      <DataTable<ClasseDetail>
        data={classes ? classes : []}
        columns={columns}
        searchPlaceholder="Rechercher par nom ou date..."
        searchField="name"
        additionalSearchFields={["name", "user.name", "project.name"]}
        title="des classes"
        description="Gérez les informations et les comptes des classes"
        canAdd={canAdd}
        onAddButtonClick={() =>
          open(
            <CustomModal>
              <ClasseForm />
            </CustomModal>
          )
        }
        pageSize={10}
        addButtonText="Enregistre une nouvelle classe"
        isPending={isPending}
        filters={[
          {
            label: "Filtrer par projet",
            field: "project.name",
            type: "select",
            icon: LinkIcon,
          },
          {
            label: "Filtrer par Formateur/trice",
            field: "user.name",
            type: "select",
            icon: SquareUser,
          },
        ]}
      />
    </>
  );
};

export default ClasseBody;
