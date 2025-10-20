"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Badge } from "@/core/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";

import {
  Calendar,
  Plus,
  FileText,
  Image as ImageIcon,
  Presentation,
  Eye,
  Trash2,
  Download,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetEvents } from "@/core/hooks/use-events";
import { Spinner } from "@/core/components/ui/spinner";
import { useModal } from "@/core/providers/modal-provider";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import { EventForm } from "@/core/view/events/event-form";

export default function EventsBody() {
  const { open } = useModal();

  const router = useRouter();

  const { data: events } = useGetEvents();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileViewDialogOpen, setFileViewDialogOpen] = useState(false);

  // Obtenir l'icône selon le type de fichier
  const getFileIcon = (type: string) => {
    if (type === "image") {
      return <ImageIcon className="h-5 w-5 text-blue-600" />;
    } else if (type === "powerpoint") {
      return <Presentation className="h-5 w-5 text-orange-600" />;
    }
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((event) =>
      event.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  // Voir un fichier
  const handleViewFile = (file: any) => {
    setSelectedFile(file);
    setFileViewDialogOpen(true);
  };
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-teal-600" />
                Événements
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez vos événements et leurs documents associés
              </p>
            </div>
            <Button
              onClick={() =>
                open(
                  <CustomModal>
                    <EventForm />
                  </CustomModal>
                )
              }
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel événement
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total événements</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events ? (
                      events.length
                    ) : (
                      <Spinner className="text-primary" variant="bars" />
                    )}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-teal-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ce mois-ci</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {events ? (
                      events.filter((e) => {
                        const eventDate = new Date(e.date);
                        const now = new Date();
                        return (
                          eventDate.getMonth() === now.getMonth() &&
                          eventDate.getFullYear() === now.getFullYear()
                        );
                      }).length
                    ) : (
                      <Spinner className="text-primary" variant="bars" />
                    )}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total fichiers</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {events ? (
                      events.reduce((sum, e) => sum + e.files.length, 0)
                    ) : (
                      <Spinner className="text-primary" variant="bars" />
                    )}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="hover:shadow-lg transition-all duration-300 border-2 hover:border-teal-300 !p-0"
            >
              <CardHeader className="p-5 h-32 rounded-t-lg  bg-gradient-to-br from-teal-50 to-blue-50">
                <CardTitle className="text-lg flex items-start justify-between">
                  <span className="flex-1">{event.titre}</span>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Fichiers */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">
                      Fichiers ({event.files.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.files.slice(0, 3).map((file) => (
                        <Badge
                          key={file.id}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-gray-100"
                          onClick={() => handleViewFile(file)}
                        >
                          {getFileIcon(file.type)}
                          <span className="ml-1 max-w-[100px] truncate">
                            {file.name}
                          </span>
                        </Badge>
                      ))}
                      {event.files.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{event.files.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>   router.push(`/evenements/${event.id}`)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun événement */}
        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Essayez une autre recherche"
                  : "Commencez par créer votre premier événement"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog Voir un fichier */}
      <Dialog open={fileViewDialogOpen} onOpenChange={setFileViewDialogOpen}>
        <DialogContent className="max-w-5xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedFile && getFileIcon(selectedFile.type)}
                {selectedFile?.name}
              </div>
              {selectedFile && (
                <a
                  href={selectedFile.url}
                  download
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Télécharger
                </a>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 h-[calc(90vh-100px)]">
            {selectedFile && selectedFile.type === "image" ? (
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : selectedFile && selectedFile.type === "powerpoint" ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Presentation className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Prévisualisation PowerPoint non disponible
                  </p>
                  <a
                    href={selectedFile.url}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger le fichier
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
