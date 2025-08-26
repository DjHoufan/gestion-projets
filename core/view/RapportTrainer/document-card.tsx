"use client";

import { Button } from "@/core/components/ui/button";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { UploadDetail } from "@/core/lib/types";
import { formatDate } from "@/core/lib/utils";
import { useModal } from "@/core/providers/modal-provider";
import { RapportTrainerForm } from "@/core/view/RapportTrainer/rapport-trainer-form";
import { FileText, Download, Edit, Trash } from "lucide-react";

interface DocumentCardProps {
  document: UploadDetail;
  getFileExtensionAction: (filename: string) => string;
  getDocumentStatusAction: (date: string | Date) => string;
  formatFileSizeAction: (bytes: number) => string;
  setIsOpenAction: (value: boolean) => void;
  setDocAction: (value: UploadDetail) => void;
}

export default function DocumentCard({
  document,
  getFileExtensionAction,
  getDocumentStatusAction,
  formatFileSizeAction,
  setIsOpenAction,
  setDocAction,
}: DocumentCardProps) {
  const { open, close } = useModal();
  const status = getDocumentStatusAction(document.date);

  return (
    <>
      <div className="group flex items-center justify-between p-6 rounded-xl border border-gray-100/50 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 cursor-pointer hover:shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
            <FileText className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">
              {document.titre}
            </h4>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <span>{formatDate(document.date)}</span>
              <span>•</span>
              <span>{getFileExtensionAction(document.file.name)}</span>
              <span>•</span>
              <span className="font-medium">
                {formatFileSizeAction(document.file.size)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={document.user.profile || "/placeholder.svg"}
                alt={document.user.name}
                className="w-5 h-5 rounded-full ring-2 ring-white shadow-sm"
              />
              <p className="text-xs text-gray-500 font-medium">
                {document.user.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              status === "Récent"
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : status === "Nouveau"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-700 border border-gray-200"
            }`}
          >
            {status}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg"
              onClick={() => window.open(document.file.url, "_blank")}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={() =>
                open(
                  <CustomModal>
                    <RapportTrainerForm
                      details={document}
                      userId={document.user.id}
                      onOpenChangeAction={close}
                      open={true}
                    />
                  </CustomModal>
                )
              }
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                setDocAction(document);
                setIsOpenAction(true);
              }}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
