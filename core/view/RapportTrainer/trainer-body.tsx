"use client";

import { useState, useMemo } from "react";

import {
  FileText,
  Upload,
  TrendingUp,
  Search,
  Filter,
  Clock,
  HardDrive,
  Plus,
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import StatsCard, {
  StatsCardProps,
} from "@/core/view/RapportTrainer/stats-card";
import UploadDialog from "@/core/view/RapportTrainer/upload-dialog";
import DocumentCard from "@/core/view/RapportTrainer/document-card";
import SearchDialog from "@/core/view/RapportTrainer/search-dialog";
import { UploadDetail } from "@/core/lib/types";
import { TrainerToBar } from "@/core/view/RapportTrainer/trainer-topbar";
import { Pagination } from "@/core/view/RapportTrainer/pagination";
import { useModal } from "@/core/providers/modal-provider";

import { Spinner } from "@/core/components/ui/spinner";
import { useDeletTrainer, useGetMyTrainer } from "@/core/hooks/use-trainer";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { RapportTrainerForm } from "@/core/view/RapportTrainer/rapport-trainer-form";
import { User } from "@supabase/supabase-js";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";

type Props = {
  userId: string;
  currentUser: User;
};

export const TrainerBody = ({ userId, currentUser }: Props) => {
  const { open, close } = useModal();
  const { data: documentsData, isPending } = useGetMyTrainer(userId);

 

  const { mutate: useDelete, isPending: loading } = useDeletTrainer();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [doc, setDoc] = useState<UploadDetail | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Calculs des statistiques réelles
  const stats = useMemo(() => {
    const documents = documentsData || []; // Default to empty array if undefined

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisWeekDocs = documents.filter(
      (doc) => new Date(doc.date) >= thisWeek
    ).length;

    const thisMonthDocs = documents.filter(
      (doc) => new Date(doc.date) >= thisMonth
    ).length;

    const lastMonthDocs = documents.filter((doc) => {
      const docDate = new Date(doc.date);
      return docDate >= lastMonth && docDate < thisMonth;
    }).length;

    const monthlyGrowth =
      lastMonthDocs > 0
        ? Math.round(((thisMonthDocs - lastMonthDocs) / lastMonthDocs) * 100)
        : thisMonthDocs > 0
        ? 100
        : 0;

    const totalSize = documents.reduce(
      (sum, doc) => sum + (doc.file.size || 0),
      0
    );
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);

    return [
      {
        isPending: isPending,
        title: "Total Documents",
        value: documents.length.toString(),
        change:
          thisWeekDocs > 0
            ? `+${thisWeekDocs} cette semaine`
            : "Aucun cette semaine",
        icon: FileText,
        color: "blue",
        trend: "up",
      },
      {
        isPending: isPending,
        title: "Uploads ce mois",
        value: thisMonthDocs.toString(),
        change:
          monthlyGrowth > 0
            ? `+${monthlyGrowth}%`
            : monthlyGrowth < 0
            ? `${monthlyGrowth}%`
            : "Stable",
        icon: Upload,
        color: "emerald",
        trend: monthlyGrowth > 0 ? "up" : monthlyGrowth < 0 ? "down" : "stable",
      },
      {
        isPending: isPending,
        title: "Stockage utilisé",
        value: `${totalSizeMB} MB`,
        change: `${documents.length} fichiers`,
        icon: HardDrive,
        color: "purple",
        trend: "up",
      },
    ] as StatsCardProps[];
  }, [documentsData]);
  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  const getDocumentStatus = (dateString: string | Date) => {
    const docDate = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - docDate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) return "Récent";
    if (diffHours < 72) return "Nouveau";
    return "Archivé";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Filtrage optimisé des documents
  const filteredDocuments = useMemo(() => {
    if (!documentsData) return [];

    return documentsData.filter((doc) => {
      const matchesSearch =
        searchQuery === "" ||
        doc.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.user.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === "all" || doc.file.type === filterType;
      const matchesStatus =
        filterStatus === "all" ||
        getDocumentStatus(doc.date).toLowerCase() ===
          filterStatus.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [documentsData, searchQuery, filterType, filterStatus]);
  const handleFilterReset = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterStatus("all");
  };

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDocuments.slice(startIndex, endIndex);
  }, [filteredDocuments, currentPage, itemsPerPage, documentsData]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const onConfirmDelete = async () => {
    useDelete(
      { param: { tId: doc?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setDoc(null);
        },
      }
    );
  };

  return (
    <>
      <DeleteConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
        title={`${doc?.titre!}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header optimisé */}
        <header className="bg-white/80 backdrop-blur-md  border-gray-200/50 sticky top-0 z-50 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top bar */}
            <TrainerToBar currentUser={currentUser} />

            {/* Barre de recherche améliorée */}
            <div className="py-6">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <div
                    className={`relative transition-all duration-500 ${
                      isSearchFocused ? "transform scale-[1.02]" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl blur-xl opacity-20" />
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-lg shadow border border-teal-100/50 overflow-hidden ">
                      <div className="flex flex-col md:flex-row  justify-center items-center gap-5 p-5 md:p-0">
                        <div className="flex justify-between items-center gap-5 w-full">
                          <div className="pl-6 pr-4 py-4">
                            <Search className="w-6 h-6 text-emerald-600" />
                          </div>
                          <Input
                            placeholder="Rechercher des documents, fichiers ou auteurs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="flex-1 border-0 focus:ring-0 bg-transparent text-lg placeholder:text-gray-400 "
                          />
                        </div>
                        <div className="mr-5 flex items-center gap-4 ">
                          <Select
                            value={filterType}
                            onValueChange={setFilterType}
                          >
                            <SelectTrigger className="w-36 border-0 bg-gray-50 hover:bg-gray-100/80 transition-colors rounded-md">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                Tous les types
                              </SelectItem>
                              <SelectItem value="word">Word</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={filterStatus}
                            onValueChange={setFilterStatus}
                          >
                            <SelectTrigger className="w-32 border-0 bg-gray-50/80 hover:bg-gray-100/80 transition-colors rounded-md">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous</SelectItem>
                              <SelectItem value="récent">Récent</SelectItem>
                              <SelectItem value="nouveau">Nouveau</SelectItem>
                              <SelectItem value="archivé">Archivé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards optimisées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Section principale optimisée */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Documents récents */}
            <div className="lg:col-span-3">
              <Card className="border-0 p-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="p-5 pb-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 rounded-t-lg border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Clock className="w-6 h-6 text-blue-600" />
                        Documents récents
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        {filteredDocuments.length} document(s) trouvé(s) •{" "}
                        {stats[2].value} utilisés
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      onClick={handleFilterReset}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {isPending ? (
                      <div className="w-full flex justify-center items-center">
                        <Spinner
                          variant="bars"
                          className="text-primary"
                          size={50}
                        />
                      </div>
                    ) : filteredDocuments.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucun document trouvé
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Essayez de modifier vos critères de recherche
                        </p>
                        <UploadDialog
                          trigger={
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Upload className="w-4 h-4 mr-2" />
                              Ajouter un document
                            </Button>
                          }
                        />
                      </div>
                    ) : (
                      paginatedDocuments.map((doc) => (
                        <DocumentCard
                          key={doc.id}
                          document={doc}
                          getFileExtensionAction={getFileExtension}
                          getDocumentStatusAction={getDocumentStatus}
                          formatFileSizeAction={formatFileSize}
                          setIsOpenAction={setIsOpen}
                          setDocAction={setDoc}
                        />
                      ))
                    )}
                    {filteredDocuments.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={filteredDocuments.length}
                          itemsPerPage={itemsPerPage}
                          onPageChangeAction={handlePageChange}
                          onItemsPerPageChangeAction={handleItemsPerPageChange}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides optimisées */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() =>
                      open(
                        <RapportTrainerForm
                          userId={userId}
                          open={true}
                          onOpenChangeAction={close}
                        />
                      )
                    }
                    className="w-full justify-start bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Nouveau document
                  </Button>

                  <SearchDialog
                    documentsData={documentsData ? documentsData : []}
                    trigger={
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-200 hover:bg-blue-50 hover:border-blue-200 h-12"
                      >
                        <Search className="w-5 h-5 mr-3" />
                        Recherche avancée
                      </Button>
                    }
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-200 hover:bg-blue-50 hover:border-blue-200 h-12"
                    onClick={handleFilterReset}
                  >
                    <Filter className="w-5 h-5 mr-3" />
                    Réinitialiser filtres
                  </Button>
                </CardContent>
              </Card>

              {/* Statistiques détaillées */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Activité récente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-sm">
                        Résultats actuels
                      </span>
                      <span className="font-semibold">
                        {filteredDocuments.length} documents
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-sm">
                        Cette semaine
                      </span>
                      <span className="font-semibold">{stats[0].change}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-sm">
                        Stockage total
                      </span>
                      <span className="font-semibold">{stats[2].value}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
