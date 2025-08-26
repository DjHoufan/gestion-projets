"use client";

import { useState } from "react";
import { Card } from "@/core//components/ui/card";
import { Badge } from "@/core//components/ui/badge";
import { Button } from "@/core//components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/core//components/ui/dialog";
import {
  Eye,
  Download,
  ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Trash2,
} from "lucide-react";
import { Files } from "@prisma/client";
import { useMedia } from "@/core/hooks/store";
import { DeleteConfirmation } from "@/core/components/global/delete-confirmation";
import { useRemoveMedia } from "@/core/hooks/use-accompaniment";

// Types pour les médias

// Fonction utilitaire pour formater la taille des fichiers
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

type Props = {
  canDelete: boolean;
};

export const MediaGallery = ({ canDelete }: Props) => {
  const { data: mediaData } = useMedia();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: useDelete, isPending: loading } = useRemoveMedia();
  const [file, setFile] = useState<Files | null>(null);

  const [selectedMedia, setSelectedMedia] = useState<Files | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(mediaData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMedia = mediaData.slice(startIndex, endIndex);

  const handleViewMedia = (media: Files) => {
    setSelectedMedia(media);
    setIsDialogOpen(true);
  };

  const handleDownload = (media: Files) => {
    const link = document.createElement("a");
    link.href = media.url;
    link.download = media.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrevious = () => {
    if (!selectedMedia) return;
    const currentIndex = mediaData.findIndex((m) => m.id === selectedMedia.id);
    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : mediaData.length - 1;
    setSelectedMedia(mediaData[previousIndex]);
  };

  const handleNext = () => {
    if (!selectedMedia) return;
    const currentIndex = mediaData.findIndex((m) => m.id === selectedMedia.id);
    const nextIndex =
      currentIndex < mediaData.length - 1 ? currentIndex + 1 : 0;
    setSelectedMedia(mediaData[nextIndex]);
  };

  const onConfirmDelete = async () => {
    useDelete(
      { param: { MId: file?.id! } },
      {
        onSuccess: () => {
          setIsOpen(false);
          setFile(null);
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
        title={`${file?.name!}`}
      />

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {currentMedia.map((media, index) => (
              <div key={media.id} className="flex flex-col">
                <Card className="p-0 group overflow-hidden bg-card/80 backdrop-blur-sm border-border/30 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full">
                  <div
                    className="relative overflow-hidden cursor-pointer aspect-[3/4]"
                    onClick={() => handleViewMedia(media)}
                  >
                    <img
                      src={media.url || "/placeholder.svg"}
                      alt={media.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Eye className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Badge className="bg-accent/90 text-accent-foreground border-0 backdrop-blur-sm">
                        {media.type}
                      </Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate text-sm">
                            {media.name}
                          </h3>
                          <p className="text-white/70 text-xs mt-1">
                            {formatFileSize(media.size)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(media);
                          }}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm ml-3"
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-card/50 border-border/50 hover:bg-primary/10 hover:border-primary/50 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[44px] backdrop-blur-sm transition-all duration-300 ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "bg-card/50 border-border/50 hover:bg-primary/10 hover:border-primary/50"
                      }`}
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
                className="bg-card/50 border-border/50 hover:bg-primary/10 hover:border-primary/50 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {mediaData.length === 0 && (
            <div className="text-center py-20">
              <div className="p-6 bg-muted/30 rounded-2xl inline-block mb-6">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Aucun média trouvé
              </h3>
              <p className="text-muted-foreground text-lg">
                Aucun fichier média n'est disponible pour le moment.
              </p>
            </div>
          )}
        </main>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="!max-w-5xl max-h-[90vh] h-full p-0 border-0 bg-transparent shadow-none">
            {selectedMedia && (
              <div className="modal-content relative  backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-border/20">
                <div className="absolute top-0 left-0 right-0 z-20   p-8">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="flex-1 min-w-0">
                      <span className="text-2xl font-black text-white mb-3 tracking-tight">
                        {selectedMedia.name}
                      </span>
                      <div className="flex items-center gap-6 text-white/80">
                        <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm px-4 py-2">
                          {selectedMedia.type}
                        </Badge>
                      </div>
                    </DialogTitle>
                  </div>
                </div>

                <div className="relative bg-black/20 min-h-[80vh] flex items-center justify-center p-8">
                  <img
                    src={selectedMedia.url || "/placeholder.svg"}
                    alt={selectedMedia.name}
                    className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevious}
                    className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/60   text-white rounded-full p-4 backdrop-blur-sm border border-white/10"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/60  text-white rounded-full p-4 backdrop-blur-sm border border-white/10"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </div>

                <div className="bg-white h-full p-5 ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="text-muted-foreground font-medium">
                        Image{" "}
                        {mediaData.findIndex((m) => m.id === selectedMedia.id) +
                          1}{" "}
                        sur {mediaData.length}
                      </div>
                      <div className="h-4 w-px bg-border" />
                    </div>
                    <div className="flex justify-between gap-5">
                      <Button
                        onClick={() => handleDownload(selectedMedia)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground  px-6 py-3 rounded"
                      >
                        <Download className="h-5 w-5 mr-3" />
                        Télécharger
                      </Button>
                      {canDelete && (
                        <Button
                          onClick={() => {
                            setFile(selectedMedia);
                            setIsOpen(true);
                          }}
                          className="bg-red-500 hover:bg-red-500/90   px-6 py-3 rounded"
                        >
                          <Trash2 className="h-5 w-5 mr-3" />
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
