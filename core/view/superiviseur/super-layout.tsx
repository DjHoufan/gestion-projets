"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { LogOut, List, Flag, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";

import SignalementForm from "@/core/view/superiviseur/singnalement-form";
import { useSupervision } from "@/core/contexts/SupervisionContext";
import { User } from "@supabase/supabase-js";
import { useLogout } from "@/core/hooks/use-auth";
import Logo from "@/core/components/global/logo";

type Props = {
  children: React.ReactNode;
  user: User;
  userId: string;
};

export function SupLayoutContent({ userId, user, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [signalementDialogOpen, setSignalementDialogOpen] = useState(false);
  const { selectedAccompanist } = useSupervision();

  const { mutate: Logout, isPending } = useLogout();

  const userInfo = useMemo(
    () => ({
      userName: user.user_metadata.name,
      userEmail: user.email,
      profile: user.user_metadata.profile,
    }),
    [user.user_metadata.name, user.email, user.user_metadata.profile]
  );

  return (
    <div className="">
      {/* Header moderne avec glassmorphism */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        {/* Barre de couleur en haut */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"></div>

        <div className="px-6 py-3">
          <div className="flex items-center justify-between gap-6">
            {/* Logo HOUFAN */}
            <div className="flex items-center gap-4">
              <div className="cursor-pointer">
                 <Logo size="md" />
              </div>

              {/* Séparateur */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

              {/* Titre de la page */}
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {pathname.includes("/signalements")
                    ? "Signalements"
                    : "Supervision"}
                </h1>
                <p className="text-xs text-gray-500">
                  Gestion des accompagnements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Bouton de navigation dynamique */}
              {pathname.includes("/signalements") ? (
                <Button
                  onClick={() => router.push("/superviseur")}
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200"
                >
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Supervision</span>
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/signalements")}
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200"
                >
                  <List className="h-4 w-4" />
                  <span className="font-medium">Signalements</span>
                </Button>
              )}

              {/* Bouton Signaler */}
              <Button
                onClick={() => setSignalementDialogOpen(true)}
                size="sm"
                className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-200"
              >
                <Flag className="h-4 w-4" />
                <span className="font-medium">Signaler</span>
              </Button>

              {/* Séparateur */}
              <div className="h-8 w-px bg-gray-200"></div>

              {/* Profil utilisateur */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 transition-all duration-200 group">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {userInfo.userName}
                  </p>
                  <p className="text-xs text-gray-500">{userInfo.userEmail}</p>
                </div>
                <Avatar className="h-10 w-10 ring-2 ring-teal-500 ring-offset-2 group-hover:ring-teal-600 transition-all">
                  <AvatarImage src={userInfo?.profile} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold">
                    {userInfo.userName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Bouton Déconnexion */}
              <Button
                onClick={Logout}
                variant="ghost"
                size="sm"
                className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                disabled={isPending}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu des pages */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Dialog Signalement */}
      <Dialog
        open={signalementDialogOpen}
        onOpenChange={setSignalementDialogOpen}
      >
        <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Flag className="h-6 w-6 text-orange-600" />
              Nouveau Signalement
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Remplissez ce formulaire pour signaler une observation, un
              incident ou tout autre problème concernant un groupe
              d'accompagnement.
            </DialogDescription>
          </DialogHeader>
          <SignalementForm
            supId={userId}
            onClose={() => setSignalementDialogOpen(false)}
            groupesAccompagnement={
              selectedAccompanist?.accompaniments?.map((acc: any) => ({
                id: acc.id,
                name: acc.name,
              })) || []
            }
            userId={selectedAccompanist?.id}
            accompagnateurName={selectedAccompanist?.name}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
