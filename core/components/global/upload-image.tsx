"use client";

import { useState, useTransition, useCallback, memo } from "react";
import { CloudUpload, Trash, Camera, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { cn } from "@/core/lib/utils";
import { UrlPath } from "@/core/lib/constants";

import { uploadImage } from "@/core/lib/storage";
import { toast } from "./custom-toast";
import { 
  compressImage, 
  validateFileSize, 
  validateFileType, 
  formatFileSize 
} from "@/core/lib/image-compression";

type Props = {
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
  folder: string;
  view?: boolean;
  buttonPosition?: "top" | "center" | "top-left" | "top-right";
};

// ✅ Composant optimisé avec React.memo
const ImageUploadComponent = ({
  disabled = false,
  onChange,
  value,
  folder,
  view = false,
  buttonPosition = "center",
}: Props) => {
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>(value);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);

  // ✅ Optimisation des callbacks avec useCallback
  const handleFileChange = useCallback(async (selectedFile: File) => {
    // Validation du type de fichier
    if (!validateFileType(selectedFile)) {
      toast.error({
        message: "Format non supporté. Utilisez JPG, PNG ou WebP.",
      });
      return;
    }

    // Validation de la taille (max 10MB avant compression)
    if (!validateFileSize(selectedFile, 10)) {
      toast.error({
        message: `Image trop volumineuse (${formatFileSize(selectedFile.size)}). Maximum 10MB.`,
      });
      return;
    }

    try {
      // Compression automatique de l'image
      toast.success({ message: "Compression de l'image en cours..." });
      const compressedFile = await compressImage(selectedFile, {
        maxSizeMB: 2, // Taille cible 2MB
        maxWidthOrHeight: 1920, // Dimension max
        quality: 0.8, // Qualité 80%
      });

      const originalSize = formatFileSize(selectedFile.size);
      const compressedSize = formatFileSize(compressedFile.size);
      const reduction = Math.round((1 - compressedFile.size / selectedFile.size) * 100);

      toast.success({
        message: `Image optimisée : ${originalSize} → ${compressedSize} (-${reduction}%)`,
      });

      setFile(compressedFile);
      const url = URL.createObjectURL(compressedFile);
      setPreview(url);

      // Nettoyer l'ancienne URL si elle existe
      return () => URL.revokeObjectURL(url);
    } catch (error) {
      toast.error({
        message: "Erreur lors de la compression de l'image.",
      });
      console.error("Compression error:", error);
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    startTransition(async () => {
      try {
        const data = await uploadImage(formData, folder);
        const { success, error } = data;

        if (success) {
          toast.success({ message: "Image téléchargée avec succès." });
          const finalUrl = `${UrlPath}/${folder}/${success.path}`;
          onChange(finalUrl);
          setPreview(finalUrl);
        } else {
          toast.error({
            message: `Échec du téléchargement: ${error?.message || ""}`,
          });
        }
      } catch (err) {
        toast.error({ message: "Erreur réseau lors du téléchargement." });
      }
    });
  }, [file, folder, onChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) handleFileChange(droppedFile);
    },
    [handleFileChange]
  );

  const handleDelete = useCallback(() => {
    setFile(undefined);
    setPreview("");
    onChange("");
  }, [onChange]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
    },
    [handleFileChange]
  );

  // ✅ Composants mémorisés avec useCallback
  const renderUploadButton = useCallback(
    () => (
      <Button
        onClick={handleUpload}
        disabled={isPending}
        size="sm"
        type="button"
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CloudUpload className="mr-2 h-4 w-4" />
        )}
        Télécharger
      </Button>
    ),
    [handleUpload, isPending]
  );

  const renderImagePreview = useCallback(
    () => (
      <div className="relative group">
        <div className="relative overflow-hidden rounded-lg border-4 transition-all h-[250px] w-[300px] border-slate-100">
          <img
    
            sizes="300px"
            alt="Aperçu de l'image"
            src={preview || "/placeholder.svg?height=250&width=300"}
            className="object-cover h-[300px] w-[300px]"
          />
          {!isPending && !view && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
              <Button
                variant="destructive"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash className="h-5 w-5" />
              </Button>
            </div>
          )}
          {/* Bouton en haut à gauche de l'image */}
          {!view && value.length <= 1 && buttonPosition === "top-left" && (
            <div className="absolute top-2 left-2 z-10">
              {renderUploadButton()}
            </div>
          )}
          {/* Bouton en haut à droite de l'image */}
          {!view && value.length <= 1 && buttonPosition === "top-right" && (
            <div className="absolute top-2 right-2 z-10">
              {renderUploadButton()}
            </div>
          )}
        </div>
      </div>
    ),
    [
      preview,
      isPending,
      view,
      value,
      buttonPosition,
      handleDelete,
      renderUploadButton,
    ]
  );

  return (
    <div className="w-full">
      {preview ? (
        <div className="flex flex-col items-center gap-4">
          {/* Bouton en haut */}
          {!view &&
            value.length <= 1 &&
            buttonPosition === "top" &&
            renderUploadButton()}

          {renderImagePreview()}

          {/* Bouton au centre (position par défaut) */}
          {!view &&
            value.length <= 1 &&
            buttonPosition === "center" &&
            renderUploadButton()}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col relative items-center justify-center h-[250px] w-[300px] rounded-xl border-2 border-dashed p-4 transition-all",
            isDragging
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-200 bg-slate-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {disabled ? (
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
          ) : (
            <>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center space-y-4 pointer-events-none">
                <div className="p-4 rounded-full bg-emerald-100">
                  <Camera className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-emerald-600">
                    Cliquez pour télécharger
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    ou glissez et déposez une image
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    PNG, JPG ou WebP • Max 10MB
                  </p>
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Compression automatique activée
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ✅ Export du composant mémorisé
export default memo(ImageUploadComponent, (prevProps, nextProps) => {
  // ✅ Comparaison personnalisée pour éviter les re-renders
  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.value === nextProps.value &&
    prevProps.folder === nextProps.folder &&
    prevProps.view === nextProps.view &&
    prevProps.buttonPosition === nextProps.buttonPosition &&
    prevProps.onChange === nextProps.onChange
  );
});
