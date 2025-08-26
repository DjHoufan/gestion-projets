"use client";

import { toast } from "@/core/components/global/custom-toast";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { useResetPassword } from "@/core/hooks/use-auth";

import { CheckCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const { mutate: resetPassword, isPending } = useResetPassword();

  const router = useRouter();

  const pathname = usePathname;

  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");

  const [view, setView] = useState<"password" | "text">("password");

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const hash = url.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    setAccessToken(token || "");
    setRefreshToken(refreshToken || "");

    if (
      params.get("access_token") === null ||
      params.get("refresh_token") === null
    ) {
      router.replace("/authentification");
    }
  }, [pathname]);

  const handleSubmit = (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    if (password !== confirmPassword) {
      toast.error({
        message: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    resetPassword(
      { json: { password, accessToken, refreshToken } },
      {
        onSuccess: () => {
          router.replace("/");
        },
      }
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword) {
      setPasswordMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password || e.target.value === "");
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Section gauche - Informations et logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=40&width=40')] opacity-5"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="mb-8 relative h-24 w-24 bg-white p-5 rounded">
            <Image
              fill
              src="https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/images//unblurimageai_1670699258598-removebg-preview-removebg-preview.png"
              alt="Logo"
              className=" object-contain"
            />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-center">
            Sécurité Renforcée
          </h2>
          <p className="text-xl text-emerald-100 text-center mb-8 max-w-md">
            Protégez votre compte avec un mot de passe fort et sécurisé
          </p>
        </div>
        {/* Formes décoratives */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Section droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header mobile */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="h-16 w-16 relative  mb-4">
                <Image
                  fill
                  src="https://mrsjolhfnqzmuekkhzde.supabase.co/storage/v1/object/public/images//unblurimageai_1670699258598-removebg-preview-removebg-preview.png"
                  alt="Logo"
                  className=" object-contain"
                />
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Nouveau mot de passe
              </h1>
              <p className="text-gray-600">
                Choisissez un mot de passe sécurisé pour votre compte
              </p>
            </div>

            <form action={handleSubmit} className="space-y-6">
              <fieldset disabled={isPending} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">
                    Nouveau mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      type={view}
                      name="password"
                      required
                      className="h-12 pr-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                      placeholder="Entrez votre nouveau mot de passe"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                      onClick={() =>
                        setView(view === "password" ? "text" : "password")
                      }
                    >
                      {view === "password" ? (
                        <Eye size="20px" />
                      ) : (
                        <EyeOff size="20px" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold text-sm">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      type={view}
                      name="confirm-password"
                      required
                      className={`h-12 pr-12 border-2 rounded-xl transition-colors ${
                        !passwordMatch && confirmPassword
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                          : confirmPassword && passwordMatch
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500"
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      }`}
                      placeholder="Confirmez votre mot de passe"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    {confirmPassword && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {passwordMatch ? (
                          <CheckCircle
                            size="20px"
                            className="text-emerald-500"
                          />
                        ) : (
                          <div className="text-red-500 text-lg font-bold">
                            ✗
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!passwordMatch && confirmPassword && (
                    <p className="text-red-500 text-sm flex items-center mt-2">
                      <span className="mr-1">⚠️</span>
                      Les mots de passe ne correspondent pas
                    </p>
                  )}
                </div>

                <Button
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                  disabled={!passwordMatch || isPending}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                      Mise à jour en cours...
                    </div>
                  ) : (
                    "Mettre à jour le mot de passe"
                  )}
                </Button>
              </fieldset>
            </form>

            <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
              <p className="text-sm text-emerald-800 text-center">
                <strong>Conseil :</strong> Utilisez au moins 8 caractères avec
                des majuscules, minuscules, chiffres et symboles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
