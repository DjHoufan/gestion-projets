"use client";

import type React from "react";
import { useState, useRef, useTransition } from "react";
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
}: Props) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadedFiles, setUploadedFiles] =
    useState<Partial<Files>[]>(valuetab);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, startTransition] = useTransition();

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      const filesToAdd = multiple
        ? Array.from(newFiles)
        : [Array.from(newFiles)[0]];

      const fileArray = filesToAdd.map((file) => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        file: file,
        size: file.size,
      }));

      setFiles(
        multiple ? (prevFiles) => [...prevFiles, ...fileArray] : fileArray
      );
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const newFiles = e.dataTransfer.files;
    if (newFiles) {
      const filesToAdd = multiple
        ? Array.from(newFiles)
        : [Array.from(newFiles)[0]];

      const fileArray = filesToAdd.map((file) => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        file: file,
        size: file.size,
      }));

      setFiles(
        multiple ? (prevFiles) => [...prevFiles, ...fileArray] : fileArray
      );
    }
  };

  const handleDelete = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDeleteUploaded = (index: string) => {
    startTransition(() => {
      deleteFileDoc(index).then((data) => {
        if (data?.success) {
          toast.success({ message: "Le document a été supprimé avec succès." });
          setUploadedFiles((prevFiles) =>
            prevFiles.filter((file) => file.id !== index)
          );
        } else if (data?.error) {
          toast.error({
            message:
              "Une erreur est survenue lors de la suppression du document.",
          });
        }
      });
    });
  };

  const uploadFiles = async () => {
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
      } else {
        // autres types ignorés
      }
    }

    startTransition(() => {
      filesUpload(formData).then((data) => {
        if (data?.success) {
          const extractedFiles = Array.isArray(data.success)
            ? data.success.map((item: any) => item.success)
            : [];

          setUploadedFiles((prevFiles) => [...prevFiles, ...extractedFiles]);

          onChangeAction(extractedFiles);
          toast.success({
            message:
              "Le téléchargement des fichiers a été effectué avec succès.",
          });
          setFiles([]);
        } else if (data?.error) {
          toast.error({
            message: "Une erreur est survenue lors du téléchargement.",
          });
        }
      });
    });
  };

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
          {dragActive ? "Déposez vos fichiers" : "Glissez vos fichiers ici"}
        </p>
        <p className="text-sm text-gray-400">
          ou cliquez pour parcourir {multiple ? "vos fichiers" : "un fichier"}
        </p>
        <input
          disabled={disabled}
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          multiple={multiple}
          accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
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
