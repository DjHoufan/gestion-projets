"use client";

import { DataTable } from "@/core/components/global/data-table";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { Spinner } from "@/core/components/ui/spinner";

import { Status, StatusIndicator } from "@/core/components/ui/status";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { useGetAdmins } from "@/core/hooks/use-admin";
import { useDeletTeam } from "@/core/hooks/use-teams";
import { UserDetail } from "@/core/lib/types";
import { formatDate } from "@/core/lib/utils";
import { useModal } from "@/core/providers/modal-provider";
import { AdminForm } from "@/core/view/admin/admin-form";

import {
  Edit,
  MoreHorizontal,
  Trash,
  UserCheck,
  Users as UserIcon,
  UserX2,
} from "lucide-react";
import { useMemo, useState } from "react";

export const AdminBody = () => {
  const { open } = useModal();

  const { data, isPending } = useGetAdmins();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserDetail | null>(null);
  const { mutate: useDelete, isPending: loading } = useDeletTeam();

  const enabledAndDisabledCount = useMemo(() => {
    if (!data) return { enabled: 0, disabled: 0 };

    const enabled = data.filter((admin) => admin.status === "enabled").length;
    const disabled = data.filter((admin) => admin.status === "disabled").length;

    return { enabled, disabled };
  }, [data]);

  const columns = [
    {
      id: "user",
      header: "Utilisateur",
      cell: ({ row }: any) => {
        const admin = row.original;
        return (
          <div className="flex items-center gap-4 py-4">
            <Avatar className="h-12 w-12 border-2 border-emerald-200 shadow-sm">
              <AvatarImage
                src={admin.profile || "/placeholder.svg"}
                alt={admin.name}
              />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                {admin.name
                  .split(" ")
                  .map((n: String) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-emerald-900 text-base">
                {admin.name}
              </span>
              <span className="text-sm text-emerald-600">{admin.email}</span>
            </div>
          </div>
        );
      },
      size: 250,
    },
    {
      id: "phone",
      header: "Téléphone",
      cell: ({ row }: any) => (
        <span className="text-emerald-700 font-medium">
          {row.original.phone}
        </span>
      ),
      size: 150,
    },
    {
      id: "address",
      header: "Adresse",
      cell: ({ row }: any) => (
        <span className="text-emerald-700">{row.original.address}</span>
      ),
      size: 200,
    },
    {
      id: "gender",
      header: "Genre",
      cell: ({ row }: any) => (
        <span className="text-emerald-700 capitalize">
          {row.original.gender}
        </span>
      ),
      size: 120,
    },
    {
      id: "dob",
      header: "Date de naissance",
      cell: ({ row }: any) => (
        <span className="text-emerald-700">{formatDate(row.original.dob)}</span>
      ),
      size: 150,
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const status = row.original.status;
        return status === "enabled" ? (
          <Status status="online">
            <StatusIndicator />
            Actif
          </Status>
        ) : (
          <Status status="offline">
            <StatusIndicator />
            Désactivé
          </Status>
        );
      },
      size: 120,
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const user = row.original;
        return (
          <div className="text-center">
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
                <DropdownMenuItem
                  onClick={() =>
                    open(
                      <CustomModal>
                        <AdminForm details={user} />
                      </CustomModal>
                    )
                  }
                  className="flex items-center gap-2 rounded-lg cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setUser(user);
                    setIsOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-lg cursor-pointer"
                >
                  <Trash className="textre h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const onConfirmDelete = async () => {
    useDelete(
      { param: { teamId: user?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setUser(null);
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
        title={`${user?.name!}`}
      />
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Administrateurs
                  </p>
                  <p className="text-3xl font-bold">
                    {data ? data.length : <Spinner variant="bars" />}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <UserIcon className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">
                    Comptes Actifs
                  </p>
                  <p className="text-3xl font-bold">
                    {isPending ? (
                      <Spinner variant="bars" />
                    ) : (
                      enabledAndDisabledCount.enabled
                    )}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <UserCheck className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-r from-red-400 to-red-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">
                    Comptes Désactiver
                  </p>
                  <p className="text-3xl font-bold">
                    {isPending ? (
                      <Spinner variant="bars" />
                    ) : (
                      enabledAndDisabledCount.enabled
                    )}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <UserX2 className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable<Omit<UserDetail, "cv">>
          data={data ? data : []}
          columns={columns}
          searchPlaceholder="Rechercher par nom ou email..."
          searchField="name"
          additionalSearchFields={["phone", "email", "status"]}
          title="des administrateurs"
          description="Administrez les comptes et les informations des administrateurs"
          canAdd={true}
          onAddButtonClick={() =>
            open(
              <CustomModal>
                <AdminForm />
              </CustomModal>
            )
          }
          pageSize={10}
          addButtonText="Enregistre un nouveau Admin"
          isPending={isPending}
        />
      </div>
    </>
  );
};
