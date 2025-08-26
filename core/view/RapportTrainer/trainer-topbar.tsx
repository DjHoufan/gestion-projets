"use client";

import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { useLogout } from "@/core/hooks/use-auth";
import { User } from "@supabase/supabase-js";
import { Loader2, LogOut, Settings, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export const TrainerToBar = ({ currentUser }: { currentUser: User }) => {
  const router = useRouter();

  const { mutate: Logout, isPending } = useLogout();

  return (
    <div className="flex justify-between items-center h-16  border-gray-100/50">
      <div className="relative w-20 h-20 mt-20">
        <Image
          src="https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/images/1670699258598.jpeg"
          alt="HOUFAN Research & Transform"
          fill
          priority
        />
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className=" flex items-center gap-2"
            >
              <div className="relative w-8 h-8">
                <Image
                  src={currentUser.user_metadata.profile}
                  alt="Profile"
                  fill
                  className=" rounded-full ring-2 ring-blue-100"
                />
              </div>
              <span className="hidden md:block text-sm font-medium">
                {currentUser.user_metadata.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => router.push("/mon_profile")}
              className="cursor-pointer"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Button
                className="w-full cursor-pointer justify-start h-auto p-2"
                variant="ghost"
                onClick={Logout}
                disabled={isPending}
              >
                {isPending ? (
                  <div className="w-full flex justify-center items-center">
                    <Loader2 className="animate-spin text-primary h-4 w-4" />
                  </div>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-red-500">Déconnexion</span>
                  </>
                )}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
