"use client";

import type React from "react";
import { useState, useRef, useTransition, useCallback, useMemo, useEffect } from "react";
import { Upload, X, FileIcon, Trash2 } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { toast } from "@/core/components/global/custom-toast";
import { FaRegFileWord, FaRegFileVideo, FaRegFileImage } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { deleteFileDoc, filesUpload } from "@/core/lib/storage";

// Types
interface FileItem {
  name: string;
  type: string;
  url: string;
  file: File;
  size: number;
}

interface Files {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

type Props = {
  valuetab: Partial<Files>[];
  disabled: boolean;
  onChangeAction: (value: Files[]) => void;
  multiple?: boolean;
  // ✅ Options de compression d'images
  compressImages?: boolean; // Activer/désactiver la compression (défaut: true)
  maxWidth?: number; // Largeur max (défaut: 1920px)
  maxHeight?: number; // Hauteur max (défaut: 1080px)
  quality?: number; // Qualité 0-1 (défaut: 0.8)
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  );
};

// ✅ Vérifier si le fichier est un document (pas une image)
const isDocument = (type: string): boolean => {
  return (
    type === 'application/pdf' ||
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'application/vnd.ms-powerpoint' ||
    type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  );
};

// ✅ Compression d'images natives avec Canvas API
const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // ✅ Calculer nouvelles dimensions en gardant le ratio
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback si pas de contexte
          return;
        }
        
        // ✅ Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        // ✅ Convertir en Blob avec compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // Fallback si échec
              return;
            }
            
            // ✅ Créer nouveau File avec le blob compressé
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            
            console.log(
              `📦 Compression: ${file.name} - ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)} (${Math.round((1 - compressedFile.size / file.size) * 100)}% réduit)`
            );
            
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => {
        console.error('Erreur lors du chargement de l\'image');
        resolve(file); // Fallback en cas d'erreur
      };
    };
    
    reader.onerror = () => {
      console.error('Erreur lors de la lecture du fichier');
      resolve(file); // Fallback en cas d'erreur
    };
  });
};

export const GetFileIcon = (type: string) => {
  if (type.includes("image"))
    return <FaRegFileImage className="w-10 h-10 text-blue-500" />;
  if (type.includes("video"))
    return <FaRegFileVideo className="w-10 h-10 text-orange-500" />;
  if (type.includes("application/pdf") || type.includes("pdf"))
    return <FaRegFilePdf className="w-10 h-10 text-red-500" />;
  if (
    type === "word" ||
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return <FaRegFileWord className="w-10 h-10 text-blue-700" />;
  // PowerPoint => icône générique (modifiable si tu veux)
  if (
    type === "application/vnd.ms-powerpoint" ||
    type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return <FileIcon className="w-10 h-10 text-orange-600" />;
  return <FileIcon className="w-10 h-10 text-gray-500" />;
};

export const UploadMultiFilesMinimal = ({
  valuetab,
  onChangeAction,
  disabled,
  multiple = true,
  compressImages = true, // ✅ Compression activée par défaut
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8,
}: Props) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadedFiles, setUploadedFiles] =
    useState<Partial<Files>[]>(valuetab);
  const [dragActive, setDragActive] = useState(false);
  const [compressing, setCompressing] = useState(false); // ✅ État de compression
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, startTransition] = useTransition();

  // ✅ Synchroniser uploadedFiles avec valuetab (props externes)
  useEffect(() => {
    setUploadedFiles(valuetab);
  }, [valuetab]);

  // ✅ Cleanup : Libérer les URLs créées
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [files]);

  // ✅ Mémoriser avec useCallback pour éviter re-création
  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = event.target.files;
      if (newFiles) {
        setCompressing(true);
        const filesToAdd = multiple
          ? Array.from(newFiles)
          : [Array.from(newFiles)[0]];

        // Séparer images et documents
        const images: File[] = [];
        const documents: File[] = [];
        
        filesToAdd.forEach(file => {
          if (isDocument(file.type)) {
            documents.push(file);
          } else {
            images.push(file);
          }
        });

        // ✅ Compresser les images avant de les ajouter
        const processedImages = await Promise.all(
          images.map(async (file) => {
            // Compresser seulement les images si option activée
            const processedFile = compressImages && file.type.startsWith('image/')
              ? await compressImage(file, maxWidth, maxHeight, quality)
              : file;
              
            return {
              name: processedFile.name,
              type: processedFile.type,
              url: URL.createObjectURL(processedFile),
              file: processedFile,
              size: processedFile.size,
            };
          })
        );

        // ✅ Ajouter les images à la liste (attente upload manuel)
        if (processedImages.length > 0) {
          setFiles(
            multiple ? (prevFiles) => [...prevFiles, ...processedImages] : processedImages
          );
        }
        
        setCompressing(false);

        // ✅ Upload automatique des documents
        if (documents.length > 0) {
          const formData = new FormData();
          
          for (const doc of documents) {
            if (doc.type === 'application/pdf') {
              formData.append('pdf', doc);
            } else if (
              doc.type === 'application/msword' ||
              doc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
              formData.append('word', doc);
            } else if (
              doc.type === 'application/vnd.ms-powerpoint' ||
              doc.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ) {
              formData.append('powerpoint', doc);
            }
          }

          // Upload direct des documents
          startTransition(async () => {
            const data = await filesUpload(formData);
            if (data?.success) {
              const extractedFiles = Array.isArray(data.success)
                ? data.success.map((item: any) => item.success)
                : [];

              // ✅ Mise à jour du state
              const newFiles = [...uploadedFiles, ...extractedFiles];
              setUploadedFiles(newFiles);
              
              // ✅ Notifier le parent de manière asynchrone (évite erreur React)
              setTimeout(() => {
                onChangeAction(newFiles as Files[]);
              }, 0);

              toast.success({
                message: `${documents.length} document(s) uploadé(s) automatiquement.`,
              });
            } else if (data?.error) {
              console.log(data?.error);
              
              toast.error({
                message: "Erreur lors de l'upload automatique des documents.",
              });
            }
          });
        }
      }
    },
    [multiple, compressImages, maxWidth, maxHeight, quality, onChangeAction]
  );

  // ✅ Mémoriser avec useCallback
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // ✅ Mémoriser avec useCallback
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const newFiles = e.dataTransfer.files;
      if (newFiles) {
        setCompressing(true);
        const filesToAdd = multiple
          ? Array.from(newFiles)
          : [Array.from(newFiles)[0]];

        // Séparer images et documents
        const images: File[] = [];
        const documents: File[] = [];
        
        filesToAdd.forEach(file => {
          if (isDocument(file.type)) {
            documents.push(file);
          } else {
            images.push(file);
          }
        });

        // ✅ Compresser les images avant de les ajouter
        const processedImages = await Promise.all(
          images.map(async (file) => {
            // Compresser seulement les images si option activée
            const processedFile = compressImages && file.type.startsWith('image/')
              ? await compressImage(file, maxWidth, maxHeight, quality)
              : file;
              
            return {
              name: processedFile.name,
              type: processedFile.type,
              url: URL.createObjectURL(processedFile),
              file: processedFile,
              size: processedFile.size,
            };
          })
        );

        // ✅ Ajouter les images à la liste (attente upload manuel)
        if (processedImages.length > 0) {
          setFiles(
            multiple ? (prevFiles) => [...prevFiles, ...processedImages] : processedImages
          );
        }
        
        setCompressing(false);

        // ✅ Upload automatique des documents
        if (documents.length > 0) {
          const formData = new FormData();
          
          for (const doc of documents) {
            if (doc.type === 'application/pdf') {
              formData.append('pdf', doc);
            } else if (
              doc.type === 'application/msword' ||
              doc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
              formData.append('word', doc);
            } else if (
              doc.type === 'application/vnd.ms-powerpoint' ||
              doc.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ) {
              formData.append('powerpoint', doc);
            }
          }

          // Upload direct des documents
          startTransition(async () => {
            const data = await filesUpload(formData);
            if (data?.success) {
              const extractedFiles = Array.isArray(data.success)
                ? data.success.map((item: any) => item.success)
                : [];

              // ✅ Mise à jour du state
              const newFiles = [...uploadedFiles, ...extractedFiles];
              setUploadedFiles(newFiles);
              
              // ✅ Notifier le parent de manière asynchrone (évite erreur React)
              setTimeout(() => {
                onChangeAction(newFiles as Files[]);
              }, 0);

              toast.success({
                message: `${documents.length} document(s) uploadé(s) automatiquement.`,
              });
            } else if (data?.error) {
              console.log(data?.error);
              
              toast.error({
                message: "Erreur lors de l'upload automatique des documents.",
              });
            }
          });
        }
      }
    },
    [multiple, compressImages, maxWidth, maxHeight, quality, onChangeAction]
  );

  // ✅ Mémoriser avec useCallback + cleanup URL
  const handleDelete = useCallback((index: number) => {
    setFiles((prevFiles) => {
      const fileToDelete = prevFiles[index];
      if (fileToDelete?.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToDelete.url);
      }
      return prevFiles.filter((_, i) => i !== index);
    });
  }, []);

  // ✅ Mémoriser avec useCallback
  const handleDeleteUploaded = useCallback((index: string) => {
    startTransition(async () => {
      const data = await deleteFileDoc(index);
      if (data?.success) {
        toast.success({ message: "Le document a été supprimé avec succès." });
        
        // ✅ Mise à jour du state
        setUploadedFiles((prevFiles) => {
          const newFiles = prevFiles.filter((file) => file.id !== index);
          
          // ✅ Notifier le parent de manière asynchrone
          setTimeout(() => {
            onChangeAction(newFiles as Files[]);
          }, 0);
          
          return newFiles;
        });
      } else if (data?.error) {
        toast.error({
          message:
            "Une erreur est survenue lors de la suppression du document.",
        });
      }
    });
  }, [onChangeAction]);

  // ✅ Mémoriser avec useCallback
  const uploadFiles = useCallback(async () => {
    const formData = new FormData();

    for (const fileItem of files) {
      if (fileItem.type.startsWith("image/")) {
        formData.append("image", fileItem.file);
      } else if (fileItem.type.startsWith("video/")) {
        formData.append("video", fileItem.file);
      } else if (fileItem.type === "application/pdf") {
        formData.append("pdf", fileItem.file);
      } else if (
        fileItem.type === "application/msword" ||
        fileItem.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        formData.append("word", fileItem.file);
      } else if (
        fileItem.type === "application/vnd.ms-powerpoint" ||
        fileItem.type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        formData.append("powerpoint", fileItem.file);
      }
    }

    startTransition(async () => {
      const data = await filesUpload(formData);
      if (data?.success) {
        const extractedFiles = Array.isArray(data.success)
          ? data.success.map((item: any) => item.success)
          : [];

        // ✅ Mise à jour du state
        const allFiles = [...uploadedFiles, ...extractedFiles];
        setUploadedFiles(allFiles);
        
        // ✅ Notifier le parent de manière asynchrone
        setTimeout(() => {
          onChangeAction(allFiles as Files[]);
        }, 0);

        toast.success({
          message:
            "Le téléchargement des fichiers a été effectué avec succès.",
        });
        
        // ✅ Cleanup URLs et vider files
        files.forEach((file) => {
          if (file.url.startsWith('blob:')) {
            URL.revokeObjectURL(file.url);
          }
        });
        setFiles([]);
      } else if (data?.error) {
        console.log(data?.error);
        
        toast.error({
          message: "Une erreur est survenue lors du téléchargement.",
        });
      }
    });
  }, [files, onChangeAction]);

  return (
    <div
      className={`w-full max-w-2xl mx-auto ${
        disabled && "opacity-50 pointer-events-none"
      }`}
    >
      <div
        className={`
          border-2 border-dashed rounded-lg p-5 max-w-xl mx-auto text-center transition-all duration-200 cursor-pointer
          ${
            dragActive
              ? "border-black bg-gray-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50"
          }
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload
          className={`w-8 h-8 mx-auto mb-4 ${
            dragActive ? "text-black" : "text-gray-400"
          }`}
        />
        <p className="text-gray-600 mb-2">
          {uploading ? "📤 Upload des documents en cours..." : compressing ? "📦 Compression des images..." : dragActive ? "Déposez vos fichiers" : "Glissez vos fichiers ici"}
        </p>
        <p className="text-sm text-gray-400">
          {uploading || compressing ? "Veuillez patienter" : `ou cliquez pour parcourir ${multiple ? "vos fichiers" : "un fichier"}`}
        </p>
        {compressImages && !uploading && !compressing && (
          <p className="text-xs text-green-600 mt-2">
            ✅ Compression automatique activée (max {maxWidth}x{maxHeight})
          </p>
        )}
        {!uploading && !compressing && (
          <p className="text-xs text-blue-600 mt-1">
            📄 Documents (PDF, Word, PowerPoint) uploadés automatiquement
          </p>
        )}
        <input
          disabled={disabled}
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          multiple={multiple}
          accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
          aria-label="Upload files"
        />
      </div>

      {/* Fichiers en attente */}
      {files.length > 0 && (
        <div className="mt-8 ">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {files.length} fichier(s) sélectionné(s)
            </p>
            <Button
              type="button"
              onClick={uploadFiles}
              disabled={uploading}
              variant="default"
              size="sm"
              className="bg-green-500 hover:bg-green-800 text-white"
            >
              {uploading
                ? "Chargement en cours..."
                : `Téléverser ${files.length} fichier${
                    files.length > 1 ? "s" : ""
                  }`}
            </Button>
          </div>
          <div className="space-y-2 ">
            <ScrollArea className="h-32">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      {GetFileIcon(file.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(index)}
                    disabled={uploading}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Fichiers uploadés */}
      {/* Fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">
            {uploadedFiles.length} fichier(s) uploadé(s)
          </p>
          <ScrollArea className="h-32">
            {" "}
            {/* <-- ajout du ScrollArea ici */}
            <div className="space-y-1">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded group"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      {GetFileIcon(file.type || "")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 truncate">
                        {file.name}
                      </p>
                      {file.size && (
                        <p className="text-xs text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      )}
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUploaded(file.id!)}
                    disabled={uploading}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {uploadedFiles.length === 0 && files.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">Aucun fichier uploadé</p>
        </div>
      )}
    </div>
  );
};
