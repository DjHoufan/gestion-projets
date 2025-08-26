"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  Calendar,
  User,
  Filter,
  X,
  Clock,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { UploadDetail } from "@/core/lib/types";
import { formatDate } from "@/core/lib/utils";

interface SearchDialogProps {
  trigger?: React.ReactNode;
  documentsData: UploadDetail[];
}

export default function SearchDialog({
  trigger,
  documentsData,
}: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAuthor, setFilterAuthor] = useState("all");

 

  // Fonction utilitaire pour obtenir l'extension du fichier
  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  // Fonction utilitaire pour obtenir le statut basé sur la date
  const getDocumentStatus = (dateString: string | Date) => {
    const docDate = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - docDate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) return "Récent";
    if (diffHours < 72) return "Nouveau";
    return "Archivé";
  };

  // Obtenir la liste des auteurs uniques
  const uniqueAuthors = [...new Set(documentsData.map((doc) => doc.user.name))];

  // Fonction de filtrage avancée
  const filteredDocuments = documentsData.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || doc.file.type === filterType;
    const matchesStatus =
      filterStatus === "all" ||
      getDocumentStatus(doc.date).toLowerCase() === filterStatus.toLowerCase();
    const matchesAuthor =
      filterAuthor === "all" || doc.user.name === filterAuthor;

    return matchesSearch && matchesType && matchesStatus && matchesAuthor;
  });

  const handleReset = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterAuthor("all");
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      className="w-full justify-start border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 h-12"
    >
      <Search className="w-5 h-5 mr-3" />
      Recherche avancée
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
              <Search className="w-6 h-6 text-emerald-600" />
              Recherche Avancée
            </DialogTitle>
            <DialogDescription className="text-emerald-700">
              Trouvez rapidement vos documents avec des filtres avancés
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          {/* Barre de recherche principale */}
          <div className="relative mb-6">
            <div className="relative bg-white rounded-md  border border-primary overflow-hidden">
              <div className="flex items-center">
                <div className="pl-4 pr-3 py-3">
                  <Search className="w-5 h-5 text-emerald-600" />
                </div>
                <Input
                  placeholder="Rechercher par titre, nom de fichier ou contenu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 !border-0  !ring-0 !bg-transparent !text-base !h-12"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="mr-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Filtres avancés */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5  mb-6">
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Type de fichier
              </label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="border-gray-200 focus:border-emerald-500 w-full">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="word">Word (.docx)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Statut
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="border-gray-200 focus:border-emerald-500 w-full">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="récent">Récent</SelectItem>
                  <SelectItem value="nouveau">Nouveau</SelectItem>
                  <SelectItem value="archivé">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                Auteur
              </label>
              <Select value={filterAuthor} onValueChange={setFilterAuthor}>
                <SelectTrigger className="border-gray-200 focus:border-emerald-500 w-full">
                  <SelectValue placeholder="Tous les auteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les auteurs</SelectItem>
                  {uniqueAuthors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                Actions
              </label>
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full border-gray-200 hover:bg-emerald-50 hover:border-emerald-200"
              >
                Réinitialiser
              </Button>
            </div>
          </div>

          {/* Résultats de recherche */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Résultats de recherche
              </h3>
              <span className="text-sm text-gray-500">
                {filteredDocuments.length} document(s) trouvé(s)
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-base font-medium text-gray-900 mb-1">
                    Aucun document trouvé
                  </h4>
                  <p className="text-sm text-gray-500">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {doc.titre}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(doc.date)} •{" "}
                          {getFileExtension(doc.file.name)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <img
                            src={doc.user.profile || "/placeholder.svg"}
                            alt={doc.user.name}
                            className="w-4 h-4 rounded-full"
                          />
                          <p className="text-xs text-gray-500">
                            {doc.user.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getDocumentStatus(doc.date) === "Récent"
                            ? "bg-emerald-100 text-emerald-700"
                            : getDocumentStatus(doc.date) === "Nouveau"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {getDocumentStatus(doc.date)}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-100"
                          onClick={() => window.open(doc.file.url, "_blank")}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-100"
                          onClick={() => window.open(doc.file.url, "_blank")}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
