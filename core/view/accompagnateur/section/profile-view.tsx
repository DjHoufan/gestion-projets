"use client";

import type React from "react";

import { useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Separator } from "@/core/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
  Shield,
  Edit,
  Edit2,
  Edit2Icon,
} from "lucide-react";
import {
  useUpdateCvOrProfile,
  useUpdatePassword,
  useUpdateProfile,
} from "@/core/hooks/use-teams";
import { EditableField } from "@/core/view/accompagnateur/components/edit-profile";
import {
  ProfileUserSchema,
  UpdatePasswordFormData,
  updatePasswordSchema,
  UserDataInput,
} from "@/core/lib/schemas";
import { Spinner } from "@/core/components/ui/spinner";
import { UploadMultiFilesMinimal } from "@/core/components/global/multi-uploads";
import { Files } from "@prisma/client";
import { useMyData } from "@/core/hooks/store";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { useModal } from "@/core/providers/modal-provider";
import ImageUpload from "@/core/components/global/upload-image";

// Types pour la validation des mots de passe
interface PasswordValidation {
  strength: "weak" | "medium" | "strong";
}

const ProfileView = () => {
  const { open } = useModal();
  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const { mutate: updateProfile, isPending: loading } = useUpdateProfile();
  const { mutate: updateProfileOrCv, isPending: loadingcvorprofile } =
    useUpdateCvOrProfile();

  const cvRef = useRef<Files | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingCV, setIsUploadingCV] = useState<boolean>(false);

  // Configuration du formulaire avec react-hook-form et Zod
  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validation en temps réel
  });

  const {
    watch,
    formState: { errors, isValid },
  } = form;
  const newPassword = watch("newPassword");

  // Calcul de la force du mot de passe avec useMemo
  const passwordValidation = useMemo((): PasswordValidation => {
    if (!newPassword) {
      return { strength: "weak" };
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const isLongEnough = newPassword.length >= 8;

    // Calcul de la force
    const criteriaCount = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough,
    ].filter(Boolean).length;

    if (criteriaCount >= 5) {
      return { strength: "strong" };
    } else if (criteriaCount >= 3) {
      return { strength: "medium" };
    }

    return { strength: "weak" };
  }, [newPassword]);

  const { data: user } = useMyData();

  if (!user) {
    return <div>Chargement...</div>;
  }

  const handlePasswordChange = async (data: UpdatePasswordFormData) => {
    try {
      updatePassword({
        param: {
          id: user.id,
          newpassword: data.newPassword,
          password: data.currentPassword,
          email: user.email,
        },
      });
      // Reset du formulaire après succès
      // form.reset();
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier que c'est un PDF
      if (file.type !== "application/pdf") {
        alert("Veuillez sélectionner un fichier PDF");
        return;
      }
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier ne doit pas dépasser 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleCVUpload = async () => {
    if (!selectedFile) return;

    setIsUploadingCV(true);

    // Simulation d'upload
    setTimeout(() => {
      alert(`CV "${selectedFile.name}" uploadé avec succès`);
      setSelectedFile(null);
      setIsUploadingCV(false);
      // Reset file input
      const fileInput = document.getElementById(
        "cv-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }, 2000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR");
  };

  // Composant pour afficher la force du mot de passe
  const PasswordStrengthIndicator = () => {
    if (!newPassword) return null;

    const getStrengthColor = () => {
      switch (passwordValidation.strength) {
        case "strong":
          return "bg-green-500";
        case "medium":
          return "bg-yellow-500";
        default:
          return "bg-red-500";
      }
    };

    const getStrengthWidth = () => {
      switch (passwordValidation.strength) {
        case "strong":
          return "w-full";
        case "medium":
          return "w-2/3";
        default:
          return "w-1/3";
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Force du mot de passe:</span>
          <span
            className={`font-medium ${
              passwordValidation.strength === "strong"
                ? "text-green-600"
                : passwordValidation.strength === "medium"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {passwordValidation.strength === "strong"
              ? "Fort"
              : passwordValidation.strength === "medium"
              ? "Moyen"
              : "Faible"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
          />
        </div>
      </div>
    );
  };

  // Fonction pour vérifier si un critère est rempli
  const isCriterionMet = (test: boolean) => {
    return newPassword ? test : false;
  };

  const [hasChanges, setHasChanges] = useState(false);
  const [userData, setUserData] = useState({
    phone: user.phone,
    address: user.address,
    dob: user.dob,
    name: user.name,
  });

  const updateField = <K extends keyof typeof userData>(
    field: K,
    value: (typeof userData)[K]
  ) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const zodValidator =
    <K extends keyof UserDataInput>(field: K) =>
    (val: UserDataInput[K]) => {
      try {
        // ✅ Valide directement le champ ciblé
        ProfileUserSchema.shape[field].parse(val);
        return true;
      } catch (err: any) {
        return err.errors?.[0]?.message || "Erreur de validation";
      }
    };

  const handleSaveAll = () => {
    try {
      ProfileUserSchema.parse(userData); // Validation complète avant sauvegarde
      updateProfile(
        {
          param: {
            id: user.id,
          },
          json: {
            ...userData,
          },
        },
        {
          onSuccess: () => {
            setHasChanges(false);
          },
        }
      );
    } catch (err: any) {
      console.error("❌ Erreurs de validation:", err.errors);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-8 ">
      <div className="space-y-8">
        <Card className="border-border bg-gray-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={user.profile || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <Button
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    size="icon"
                    variant="ghost"
                  >
                    <Edit2Icon className="text-primary h-6 w-6" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-xl">
                    <EditableField
                      value={userData.name}
                      onSave={(value: string) => updateField("name", value)}
                      label="Nom complet"
                      icon={<User className="w-4 h-4" />}
                      validator={zodValidator("name")}
                    />
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {user.type}
                    </Badge>
                    <Badge
                      variant={
                        user.status === "enabled" ? "default" : "destructive"
                      }
                    >
                      {user.status === "enabled" ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() =>
                  open(
                    <CustomModal size="md:max-w-[400px]">
                      <div className="flex items-center justify-center h-full">
                        <ImageUpload
                          value={""}
                          disabled={false}
                          onChange={(url) => {
                            console.log({ url });

                            console.log({
                              op: "profile",
                              value: url,
                              userId: user.id,
                            });

                            if (url) {
                              updateProfileOrCv({
                                param: {
                                  op: "profile",
                                  value: url,
                                  userId: user.id,
                                },
                              });
                            }
                          }}
                          folder="profile"
                          buttonPosition="top-right"
                        />
                      </div>
                    </CustomModal>
                  )
                }
              >
                <Edit2Icon className="h-4 w-4" />
                Modifier
              </Button> */}
            </div>
          </CardHeader>
        </Card>

        <Card className="border-border bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <p className="text-foreground font-medium">{user.email}</p>
              </div>

              <EditableField
                value={userData.phone}
                onSave={(value) => updateField("phone", value)}
                label="Téléphone"
                icon={<Phone className="w-4 h-4" />}
                type="tel"
                validator={zodValidator("phone")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EditableField<Date>
                value={userData.dob}
                onSave={(value) => updateField("dob", value)}
                label="Date de naissance"
                icon={<Calendar className="w-4 h-4" />}
                type="date"
                validator={zodValidator("dob")}
                formatter={formatDate}
              />
              <EditableField
                value={userData.address}
                onSave={(value) => updateField("address", value)}
                label="Adresse"
                icon={<MapPin className="w-4 h-4" />}
                validator={zodValidator("address")}
              />
            </div>

            {hasChanges && (
              <div className="flex justify-end">
                <Button onClick={handleSaveAll} disabled={loading}>
                  {loading && <Spinner variant="circle" />}
                  Sauvegarder les modifications
                </Button>
              </div>
            )}

            {user.cv ? (
              <>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    CV
                  </Label>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          {user.cv.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Document PDF
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <a
                          href={user.cv.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          Télécharger
                        </a>
                      </Button>
                      <Button
                        onClick={() =>
                          open(
                            <CustomModal>
                              <div>
                                <UploadMultiFilesMinimal
                                  multiple={false}
                                  valuetab={user.cv ? [user.cv!] : []}
                                  disabled={false}
                                  onChangeAction={(value) => {
                                    updateProfileOrCv({
                                      param: {
                                        op: "cv",
                                        value: value[0].id,
                                        userId: user.id,
                                      },
                                    });
                                  }}
                                />
                              </div>
                            </CustomModal>
                          )
                        }
                      >
                        <Edit />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Button
                onClick={() =>
                  open(
                    <CustomModal>
                      <div>
                        <UploadMultiFilesMinimal
                          multiple={false}
                          valuetab={user.cv ? [user.cv!] : []}
                          disabled={false}
                          onChangeAction={(value) => {
                            updateProfileOrCv({
                              param: {
                                op: "cv",
                                value: value[0].id,
                                userId: user.id,
                              },
                            });
                          }}
                        />
                      </div>
                    </CustomModal>
                  )
                }
              >
                Importer votre CV
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Assurez-vous d'utiliser un mot de passe fort et unique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handlePasswordChange)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe actuel</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showCurrentPassword ? "text" : "password"}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showNewPassword ? "text" : "password"}
                            className={`pr-16 ${
                              newPassword
                                ? !errors.newPassword
                                  ? "border-green-500 focus:border-green-500"
                                  : "border-red-500 focus:border-red-500"
                                : ""
                            }`}
                          />
                          <div className="absolute right-10 top-0 h-full flex items-center">
                            {newPassword &&
                              (!errors.newPassword ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              ))}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <PasswordStrengthIndicator />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            className={`pr-16 ${
                              field.value
                                ? !errors.confirmPassword
                                  ? "border-green-500 focus:border-green-500"
                                  : "border-red-500 focus:border-red-500"
                                : ""
                            }`}
                          />
                          <div className="absolute right-10 top-0 h-full flex items-center">
                            {field.value &&
                              (!errors.confirmPassword ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              ))}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mb-2">
                    <Shield className="h-4 w-4" />
                    Critères de sécurité
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                    {[
                      {
                        test: newPassword.length >= 8,
                        text: "8 caractères minimum",
                      },
                      {
                        test: /[a-z]/.test(newPassword),
                        text: "Une minuscule",
                      },
                      {
                        test: /[A-Z]/.test(newPassword),
                        text: "Une majuscule",
                      },
                      { test: /\d/.test(newPassword), text: "Un chiffre" },
                      {
                        test: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
                        text: "Un caractère spécial (recommandé)",
                      },
                    ].map((criterion, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-1 ${
                          newPassword
                            ? criterion.test
                              ? "text-green-600"
                              : "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {isCriterionMet(criterion.test) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-current" />
                        )}
                        {criterion.text}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || !isValid}
                >
                  {isPending
                    ? "Modification en cours..."
                    : "Modifier le mot de passe"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ProfileView;
