"use client";

import { useGetTrainers } from "@/core/hooks/use-trainer";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import {
  CalendarDays,
  Download,
  FileText,
  HardDrive,
  User,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { formatDate } from "@/core/lib/utils";




export const TrainerRapport = () => {
  const { data: documentsData } = useGetTrainers();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Filtrer les documents selon le terme de recherche
  const filteredDocuments = useMemo(() => {
    if (!documentsData) return [];

    return documentsData.filter(
      (document) =>
        document.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, documentsData]);

  // Calculer la pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 quand on change la recherche
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Changer le nombre d'éléments par page
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function getFileTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case "word":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pdf":
        return "bg-red-100 text-red-800 border-red-200";
      case "excel":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec recherche */}
        <div className="mb-8">
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par titre, fichier, utilisateur..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
              />
            </div>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 par page</SelectItem>
                <SelectItem value="8">8 par page</SelectItem>
                <SelectItem value="12">12 par page</SelectItem>
                <SelectItem value="16">16 par page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {filteredDocuments.length} document
              {filteredDocuments.length > 1 ? "s" : ""} trouvé
              {filteredDocuments.length > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />1 utilisateur actif
            </span>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-bold">
                    {filteredDocuments.length}
                  </p>
                  <p className="text-emerald-100">Documents trouvés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <HardDrive className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-bold">
                    {formatFileSize(
                      filteredDocuments.reduce(
                        (acc, doc) => acc + doc.file.size,
                        0
                      )
                    )}
                  </p>
                  <p className="text-teal-100">Espace utilisé</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-green-100">Utilisateur actif</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Grid */}
        {currentDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2   gap-6 mb-8">
            {currentDocuments.map((document, index) => (
              <Card
                key={document.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {document.titre}
                      </CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className={`ml-2 ${getFileTypeColor(
                        document.file.type
                      )} border`}
                    >
                      {document.file.type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* File Info */}
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {document.file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        {formatFileSize(document.file.size)}
                      </span>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-emerald-100">
                      <AvatarImage
                        src={document.user.profile || "/placeholder.svg"}
                        alt={document.user.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm">
                        {document.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {document.user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {document.user.email}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <CalendarDays className="h-3 w-3" />
                      <span>{formatDate(document?.date!)}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => window.open(document.file.url, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
            <div className="text-sm text-slate-600">
              Affichage de {startIndex + 1} à{" "}
              {Math.min(endIndex, filteredDocuments.length)} sur{" "}
              {filteredDocuments.length} résultats
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white/80"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                          : "bg-white/80"
                      }
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-white/80"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Message si aucun résultat */}
        {currentDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Aucun document trouvé
            </h3>
            <p className="text-slate-600">
              Essayez de modifier votre recherche ou de réinitialiser les
              filtres.
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => handleSearchChange("")}
                className="mt-4"
              >
                Effacer la recherche
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
