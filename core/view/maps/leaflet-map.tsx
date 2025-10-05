"use client";

import type { MapDetail } from "@/core/lib/types";
import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Map,
  Satellite,
  Globe,
  AlertTriangle,
  User,
  UserCheck,
  XCircle,
  CheckCircle,
  Building,
  MapPin,
  Phone,
  DollarSign,
  Calendar,
  RefreshCw,
  Clipboard,
  Users,
  Mail,
  Smartphone,
  X,
  Target,
  Home,
  ChevronDown,
  Check,
  Banknote,
} from "lucide-react";
import { toast } from "@/core/components/global/custom-toast";

interface LeafletMapProps {
  coordinates: MapDetail[];
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    L: any;
    openGroupDialog: (groupId: string) => void;
    closeGroupDialog: (groupId: string) => void;
    getDirections: (lat: number, lng: string, placeName: string) => void;
    showRouteOnMap: (lat: string, lng: string, placeName: string) => void;
    clearRoute: () => void;
  }
}

// Types de cartes avec icônes Lucide
const mapTypes = {
  standard: {
    name: "Standard",
    icon: Map,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  },
  satellite_hd: {
    name: "Satellite HD",
    icon: Satellite,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri",
    maxZoom: 19,
  },
  satellite: {
    name: "Satellite",
    icon: Globe,
    url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    attribution: "© Google",
    maxZoom: 20,
  },
};

export default function LeafletMap({
  coordinates = [],
  className = "",
  onMapClick,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const markerClusterGroupRef = useRef<any>(null);
  const [currentMapType, setCurrentMapType] =
    useState<keyof typeof mapTypes>("satellite_hd");
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [status, setStatus] = useState("Initialisation...");
  const [selectedGroup, setSelectedGroup] = useState<MapDetail | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const routingControlRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);

  // Ensure coordinates is always an array
  const safeCoordinates = coordinates || [];

  // Fonctions pour gérer le dialog
  const openGroupDialog = (groupId: string) => {
    const group = safeCoordinates.find((coord) => coord.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setShowDialog(true);
      document.body.style.overflow = "hidden";
    }
  };

  const closeGroupDialog = () => {
    setShowDialog(false);
    setSelectedGroup(null);
    document.body.style.overflow = "auto";
  };

  // Exposer les fonctions globalement pour les popups
  useEffect(() => {
    window.openGroupDialog = openGroupDialog;
    window.closeGroupDialog = closeGroupDialog;

    // Fonction pour obtenir l'itinéraire
    window.getDirections = (lat: number, lng: string, placeName: string) => {
      if (navigator.geolocation) {
        // Afficher un indicateur de chargement
        const loadingToast = document.createElement("div");
        loadingToast.innerHTML = `
          <div style="
            position: fixed; 
            top: 20px; 
            right: 20px; 
            background: white; 
            padding: 16px 20px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
            z-index: 999;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'Segoe UI', sans-serif;
          ">
            <div style="
              width: 20px; 
              height: 20px; 
              border: 2px solid #1CA472; 
              border-top: 2px solid transparent; 
              border-radius: 50%; 
              animation: spin 1s linear infinite;
            "></div>
            <span style="color: #1CA472; font-weight: 500;">Localisation en cours...</span>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `;
        document.body.appendChild(loadingToast);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Supprimer l'indicateur de chargement
            document.body.removeChild(loadingToast);

            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Construire l'URL Google Maps avec itinéraire
            const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${lat},${lng}/@${userLat},${userLng},15z/data=!3m1!4b1!4m2!4m1!3e0`;

            // Ouvrir dans un nouvel onglet
            window.open(googleMapsUrl, "_blank");

            // Afficher une confirmation
            const successToast = document.createElement("div");
            successToast.innerHTML = `
              <div style="
                position: fixed; 
                top: 20px; 
                right: 20px; 
                background: linear-gradient(135deg, #1CA472, #047857); 
                color: white;
                padding: 16px 20px; 
                border-radius: 12px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
                z-index: 999;
                font-family: 'Segoe UI', sans-serif;
                font-weight: 500;
              ">
                ✅ Itinéraire vers ${placeName} ouvert dans Google Maps
              </div>
            `;
            document.body.appendChild(successToast);

            // Supprimer le toast après 3 secondes
            setTimeout(() => {
              if (document.body.contains(successToast)) {
                document.body.removeChild(successToast);
              }
            }, 3000);
          },
          (error) => {
            // Supprimer l'indicateur de chargement
            document.body.removeChild(loadingToast);

            let errorMessage = "Erreur de géolocalisation";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage =
                  "Accès à la localisation refusé. Veuillez autoriser la géolocalisation.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage =
                  "Position non disponible. Vérifiez votre connexion.";
                break;
              case error.TIMEOUT:
                errorMessage = "Délai de localisation dépassé.";
                break;
            }

            // Afficher l'erreur
            const errorToast = document.createElement("div");
            errorToast.innerHTML = `
              <div style="
                position: fixed; 
                top: 20px; 
                right: 20px; 
                background: linear-gradient(135deg, #ef4444, #dc2626); 
                color: white;
                padding: 16px 20px; 
                border-radius: 12px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
                z-index: 999;
                font-family: 'Segoe UI', sans-serif;
                font-weight: 500;
                max-width: 300px;
              ">
                ❌ ${errorMessage}
              </div>
            `;
            document.body.appendChild(errorToast);

            // Supprimer le toast après 5 secondes
            setTimeout(() => {
              if (document.body.contains(errorToast)) {
                document.body.removeChild(errorToast);
              }
            }, 5000);

            // En cas d'erreur, ouvrir quand même Google Maps sans position de départ
            const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            window.open(fallbackUrl, "_blank");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          }
        );
      } else {
        // Géolocalisation non supportée
        const errorToast = document.createElement("div");
        errorToast.innerHTML = `
          <div style="
            position: fixed; 
            top: 20px; 
            right: 20px; 
            background: linear-gradient(135deg, #ef4444, #dc2626); 
            color: white;
            padding: 16px 20px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
            z-index: 999;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 500;
          ">
            ❌ Géolocalisation non supportée par votre navigateur
          </div>
        `;
        document.body.appendChild(errorToast);

        setTimeout(() => {
          if (document.body.contains(errorToast)) {
            document.body.removeChild(errorToast);
          }
        }, 5000);

        // Ouvrir quand même Google Maps sans position de départ
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(fallbackUrl, "_blank");
      }
    };

    // Fonction pour afficher l'itinéraire sur la carte
    window.showRouteOnMap = (lat: string, lng: string, placeName: string) => {
      if (!mapInstanceRef.current) return;

      setRouteLoading(true);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const destLat = Number.parseFloat(lat);
            const destLng = Number.parseFloat(lng);

            // Supprimer l'ancien itinéraire s'il existe
            if (routingControlRef.current) {
              mapInstanceRef.current.removeControl(routingControlRef.current);
            }

            // Supprimer l'ancien marqueur de position utilisateur
            if (userLocationMarkerRef.current) {
              mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
            }

            // Ajouter un marqueur pour la position de l'utilisateur
            const userIcon = window.L.divIcon({
              html: `
            <div style="
              width: 30px;
              height: 30px;
              background: #3b82f6;
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: relative;
            ">
              <div style="
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
              "></div>
            </div>
          `,
              className: "user-location-marker",
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            });

            userLocationMarkerRef.current = window.L.marker(
              [userLat, userLng],
              { icon: userIcon }
            )
              .addTo(mapInstanceRef.current)
              .bindPopup("📍 Votre position actuelle");

            // Créer l'itinéraire
            routingControlRef.current = window.L.Routing.control({
              waypoints: [
                window.L.latLng(userLat, userLng),
                window.L.latLng(destLat, destLng),
              ],
              routeWhileDragging: false,
              addWaypoints: false,
              createMarker: () => null, // Ne pas créer de marqueurs par défaut
              lineOptions: {
                styles: [
                  {
                    color: "#3b82f6",
                    weight: 6,
                    opacity: 0.8,
                  },
                ],
              },
              router: window.L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1",
                profile: "driving",
              }),
              formatter: new window.L.Routing.Formatter({
                language: "fr",
              }),
              show: false, // Masquer le panneau d'instructions par défaut
              collapsible: true,
            }).addTo(mapInstanceRef.current);

            // Événements du routage
            routingControlRef.current.on("routesfound", (e: any) => {
              setRouteLoading(false);
              setShowRoute(true);

              const routes = e.routes;
              const summary = routes[0].summary;

              // Afficher les informations de l'itinéraire
              const distance = (summary.totalDistance / 1000).toFixed(1);
              const time = Math.round(summary.totalTime / 60);

              const routeInfo = document.createElement("div");
              routeInfo.innerHTML = `
            <div style="
              position: fixed; 
              top: 20px; 
              right: 20px; 
              background: white; 
              padding: 16px 20px; 
              border-radius: 12px; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
              z-index: 999;
              font-family: 'Segoe UI', sans-serif;
              max-width: 300px;
            ">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="
                  width: 40px; 
                  height: 40px; 
                  background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
                  border-radius: 50%; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                ">
                  <span style="color: white; font-size: 18px;">🚗</span>
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">
                    Itinéraire vers ${placeName}
                  </h3>
                  <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">
                    ${distance} km • ${time} min
                  </p>
                </div>
              </div>
              <button 
                onclick="this.parentElement.remove(); window.clearRoute();"
                style="
                  width: 100%; 
                  background: linear-gradient(135deg, #ef4444, #dc2626); 
                  color: white; 
                  padding: 8px 12px; 
                  border: none; 
                  border-radius: 8px; 
                  font-size: 14px; 
                  font-weight: 500; 
                  cursor: pointer;
                "
              >
                Masquer l'itinéraire
              </button>
            </div>
          `;
              document.body.appendChild(routeInfo);

              // Supprimer automatiquement après 10 secondes
              setTimeout(() => {
                if (document.body.contains(routeInfo)) {
                  document.body.removeChild(routeInfo);
                }
              }, 10000);
            });

            routingControlRef.current.on("routingerror", (e: any) => {
              setRouteLoading(false);

              const errorToast = document.createElement("div");
              errorToast.innerHTML = `
            <div style="
              position: fixed; 
              top: 20px; 
              right: 20px; 
              background: linear-gradient(135deg, #ef4444, #dc2626); 
              color: white;
              padding: 16px 20px; 
              border-radius: 12px; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
              z-index: 999;
              font-family: 'Segoe UI', sans-serif;
              font-weight: 500;
            ">
              ❌ Impossible de calculer l'itinéraire
            </div>
          `;
              document.body.appendChild(errorToast);

              setTimeout(() => {
                if (document.body.contains(errorToast)) {
                  document.body.removeChild(errorToast);
                }
              }, 5000);
            });
          },
          (error) => {
            setRouteLoading(false);
            toast.error({ message: "Erreur de géolocalisation:", error });

            let errorMessage = "Erreur de géolocalisation";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Accès à la localisation refusé";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Position non disponible";
                break;
              case error.TIMEOUT:
                errorMessage = "Délai de localisation dépassé";
                break;
            }

            const errorToast = document.createElement("div");
            errorToast.innerHTML = `
          <div style="
            position: fixed; 
            top: 20px; 
            right: 20px; 
            background: linear-gradient(135deg, #ef4444, #dc2626); 
            color: white;
            padding: 16px 20px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
            z-index: 999;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 500;
          ">
            ❌ ${errorMessage}
          </div>
        `;
            document.body.appendChild(errorToast);

            setTimeout(() => {
              if (document.body.contains(errorToast)) {
                document.body.removeChild(errorToast);
              }
            }, 5000);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          }
        );
      } else {
        setRouteLoading(false);
        const errorToast = document.createElement("div");
        errorToast.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: linear-gradient(135deg, #ef4444, #dc2626); 
        color: white;
        padding: 16px 20px; 
        border-radius: 12px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
        z-index: 999;
        font-family: 'Segoe UI', sans-serif;
        font-weight: 500;
      ">
        ❌ Géolocalisation non supportée
      </div>
    `;
        document.body.appendChild(errorToast);

        setTimeout(() => {
          if (document.body.contains(errorToast)) {
            document.body.removeChild(errorToast);
          }
        }, 5000);
      }
    };

    // Fonction pour effacer l'itinéraire
    window.clearRoute = () => {
      if (routingControlRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      if (userLocationMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
        userLocationMarkerRef.current = null;
      }

      setShowRoute(false);
    };

    // Gérer la fermeture avec Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showDialog) {
        closeGroupDialog();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [safeCoordinates]);

  useEffect(() => {
    let mounted = true;

    const initializeEverything = async () => {
      try {
        if (!mounted) return;

        setStatus("Chargement de Leaflet...");

        // Charger Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        // Charger MarkerCluster CSS
        if (!document.querySelector('link[href*="MarkerCluster"]')) {
          const clusterLink = document.createElement("link");
          clusterLink.rel = "stylesheet";
          clusterLink.href =
            "https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css";
          document.head.appendChild(clusterLink);

          const clusterDefaultLink = document.createElement("link");
          clusterDefaultLink.rel = "stylesheet";
          clusterDefaultLink.href =
            "https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css";
          document.head.appendChild(clusterDefaultLink);
        }

        // Charger Leaflet JS
        if (!window.L) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("Échec du chargement de Leaflet"));
            document.head.appendChild(script);
          });
        }

        // Charger MarkerCluster JS
        if (!window.L.markerClusterGroup) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js";
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error("Échec du chargement de MarkerCluster"));
            document.head.appendChild(script);
          });
        }

        // Charger Leaflet Routing Machine CSS
        if (!document.querySelector('link[href*="leaflet-routing-machine"]')) {
          const routingCss = document.createElement("link");
          routingCss.rel = "stylesheet";
          routingCss.href =
            "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css";
          document.head.appendChild(routingCss);
        }

        // Charger Leaflet Routing Machine JS
        if (!window.L.Routing) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js";
            script.onload = () => resolve();
            script.onerror = () =>
              reject(
                new Error("Échec du chargement de Leaflet Routing Machine")
              );
            document.head.appendChild(script);
          });
        }

        if (!mounted) return;

        // Attendre que Leaflet soit complètement prêt
        let attempts = 0;
        while (
          (!window.L || !window.L.map || !window.L.markerClusterGroup) &&
          attempts < 50
        ) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.L || !window.L.map) {
          throw new Error("Leaflet non disponible après le chargement");
        }

        setStatus("Création de la carte...");

        // Attendre que le DOM soit prêt
        if (!mapRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (!mapRef.current || !mounted) {
          throw new Error("Élément DOM non disponible");
        }

        // Créer la carte
        const map = window.L.map(mapRef.current, {
          center: [11.5721, 43.1456], // Djibouti
          zoom: 10,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Add double-click event listener for adding new residents
        if (onMapClick) {
          map.on("dblclick", (e: any) => {
            const { lat, lng } = e.latlng;
            onMapClick(lat, lng);
          });
        }

        // Ajouter la couche de tuiles
        const tileLayer = window.L.tileLayer(mapTypes[currentMapType].url, {
          attribution: mapTypes[currentMapType].attribution,
          maxZoom: mapTypes[currentMapType].maxZoom,
        });
        tileLayer.addTo(map);

        // Créer le groupe de clustering
        if (window.L.markerClusterGroup) {
          markerClusterGroupRef.current = window.L.markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
          });
          map.addLayer(markerClusterGroupRef.current);
        }

        setStatus("Ajout des marqueurs...");

        // Ajouter les marqueurs
        updateMarkers(map);

        setStatus("Prêt ✓");
      } catch (error) {
        toast.error({ message: "Erreur d'initialisation:", error });
        setStatus(
          `Erreur: ${
            error instanceof Error ? error.message : "Erreur inconnue"
          }`
        );
      }
    };

    // Délai pour s'assurer que le composant est monté
    const timer = setTimeout(() => {
      initializeEverything();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
      }
    };
  }, [safeCoordinates]);

  const updateMarkers = (map: any) => {
    try {
      // Nettoyer les anciens marqueurs
      if (markerClusterGroupRef.current) {
        markerClusterGroupRef.current.clearLayers();
      }
      markersRef.current = [];

      if (!safeCoordinates || safeCoordinates.length === 0) return;

      // Couleurs pour les marqueurs selon le statut du groupe et de l'utilisateur
      const getMarkerStyle = (coord: MapDetail, index: number) => {
        const { accompaniment } = coord;
        if (!accompaniment) {
          return {
            bg: "#F3F4F6",
            border: "#6B7280",
            text: "#1CA472",
            icon: MapPin,
          };
        }

        // Style basé sur le statut du groupe (status = false = terminé = rouge)
        if (accompaniment.status === false) {
          return {
            bg: "#FEE2E2",
            border: "#EF4444",
            text: "#DC2626",
            icon: MapPin,
          };
        }

        // Style basé sur le statut de l'utilisateur (disabled = gris)
        if (accompaniment.users?.status === "disabled") {
          return {
            bg: "#F3F4F6",
            border: "#6B7280",
            text: "#1CA472",
            icon: MapPin,
          };
        }

        // Pour les projets actifs (status = true), utiliser des couleurs variées avec icône MapPin
        const colors = [
          { bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF", icon: MapPin },
          { bg: "#D1FAE5", border: "#1CA472", text: "#047857", icon: MapPin },
          { bg: "#FFE4E6", border: "#FB7185", text: "#BE123C", icon: MapPin },
          { bg: "#FEF3C7", border: "#FBBF24", text: "#92400E", icon: MapPin },
          { bg: "#E0E7FF", border: "#A78BFA", text: "#5B21B6", icon: MapPin },
          { bg: "#FFEDD5", border: "#FB923C", text: "#C2410C", icon: MapPin },
          { bg: "#F0FDF4", border: "#4ADE80", text: "#15803D", icon: MapPin },
          { bg: "#FDF2F8", border: "#F472B6", text: "#BE185D", icon: MapPin },
        ];
        return colors[index % colors.length];
      };

      // Ajouter les nouveaux marqueurs
      safeCoordinates.forEach((coord, index) => {
        try {
          const style = getMarkerStyle(coord, index);
          const { accompaniment } = coord;

          // Convertir les coordonnées string en number
          const lat = Number.parseFloat(coord.latitude);
          const lng = Number.parseFloat(coord.longitude);

          // Vérifier que les coordonnées sont valides
          if (isNaN(lat) || isNaN(lng)) {
            toast.warning({
              message: `Coordonnées invalides pour ${coord.id}: lat=${coord.latitude}, lng=${coord.longitude}`,
            });
            return;
          }

          const icon = window.L.divIcon({
            html: `
              <div style="
                width: 35px;
                height: 35px;
                background: ${style.bg};
                border: 2px solid ${style.border};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
                color: ${style.text};
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                position: relative;
              ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            `,
            className: "custom-marker",
            iconSize: [35, 35],
            iconAnchor: [17, 17],
          });

          const marker = window.L.marker([lat, lng], { icon });

          // Popup enrichi avec les informations du groupe
          const formatDate = (date: Date) =>
            new Date(date).toLocaleDateString("fr-FR");
          const membersCount = accompaniment.members?.length || 0;
          const budget = accompaniment.budget || 0;
          const userName = accompaniment.users?.name || "Non défini";
          const userStatus = accompaniment.users?.status || "unknown";

          const popupContent = `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 400px; max-width: 90vw; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; padding: 20px;">
<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
  <div style="width: 40px; height: 40px; background: ${
    style.bg
  }; border: 2px solid ${
            style.border
          }; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${
    style.text
  }" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
  </div>
  <div style="text-align: left;">
    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1e293b;">
      ${accompaniment.name || "Groupe sans nom"}
    </h3>
    <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
      <span style="background: ${
        accompaniment.status === true ? "#dcfce7" : "#fee2e2"
      }; color: ${
            accompaniment.status === true ? "#2256DD" : "#2256DD"
          }; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 600;">
        ${accompaniment.status === true ? "⚠ Terminé" : "En cours"}
      </span>
      <span style="color: #64748b; font-size: 13px; font-weight: 500;">
        ${budget.toLocaleString("fr-FR")} Fdj
      </span>
    </div>
  </div>
</div>
<div style="text-align: left; margin-bottom: 16px; font-size: 13px; color: #64748b;">
  <div style="margin-bottom: 8px;">
    <strong>Responsable:</strong> ${userName} (${userStatus})
  </div>
  <div style="margin-bottom: 8px;">
    <strong>Adresse:</strong> ${accompaniment.adresse || "Non définie"}
  </div>
  <div style="margin-bottom: 8px;">
    <strong>Membres:</strong> ${membersCount} personne${
            membersCount > 1 ? "s" : ""
          }
  </div>
</div>
<div style="display: flex; flex-direction: column; gap: 8px;">
  <button 
    onclick="window.openGroupDialog('${coord.id}')"
    style="width: 100%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 16px; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);"
    onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 8px -1px rgba(59, 130, 246, 0.4)';"
    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(59, 130, 246, 0.3)';">
    Voir les détails complets
  </button>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
    <button 
      onclick="window.showRouteOnMap('${coord.latitude}', '${
            coord.longitude
          }', '${accompaniment.name?.replace(/'/g, "\\'")}');"
      style="background: linear-gradient(135deg, #1CA472, #047857); color: white; padding: 10px 12px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);"
      onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 8px -1px rgba(16, 185, 129, 0.4)';"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(16, 185, 129, 0.3)';">
      🗺️ Itinéraire
    </button>
    <button 
      onclick="window.getDirections('${coord.latitude}', '${
            coord.longitude
          }', '${accompaniment.name?.replace(/'/g, "\\'")}');"
      style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 10px 12px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);"
      onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 8px -1px rgba(139, 92, 246, 0.4)';"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(139, 92, 246, 0.3)';">
      📱 Google Maps
    </button>
  </div>
</div>`;

          marker.bindPopup(popupContent, {
            maxWidth: 450,
            minWidth: 400,
            maxHeight: 300,
            className: "custom-popup",
          });

          // Ajouter au cluster ou directement à la carte
          if (markerClusterGroupRef.current) {
            markerClusterGroupRef.current.addLayer(marker);
          } else {
            marker.addTo(map);
          }

          markersRef.current.push(marker);
        } catch (e) {}
      });

      // Ajuster la vue si on a des marqueurs
      if (safeCoordinates.length > 0) {
        try {
          if (markerClusterGroupRef.current && safeCoordinates.length > 1) {
            map.fitBounds(markerClusterGroupRef.current.getBounds().pad(0.1));
          } else if (safeCoordinates.length === 1) {
            const lat = Number.parseFloat(safeCoordinates[0].latitude);
            const lng = Number.parseFloat(safeCoordinates[0].longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              map.setView([lat, lng], 15);
            }
          }
        } catch (e) {}
      }
    } catch (error) {
      toast.error({ message: "Erreur mise à jour marqueurs:", error });
    }
  };

  const changeMapType = (mapType: keyof typeof mapTypes) => {
    if (!mapInstanceRef.current) return;

    try {
      // Supprimer toutes les couches de tuiles existantes
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer.options && layer.options.attribution) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Ajouter la nouvelle couche
      const tileLayer = window.L.tileLayer(mapTypes[mapType].url, {
        attribution: mapTypes[mapType].attribution,
        maxZoom: mapTypes[mapType].maxZoom,
      });
      tileLayer.addTo(mapInstanceRef.current);

      setCurrentMapType(mapType);
      setShowMapSelector(false);
    } catch (error) {
      toast.error({ message: "Erreur changement de carte:", error });
    }
  };

  // Mettre à jour les marqueurs quand les coordonnées changent
  useEffect(() => {
    if (mapInstanceRef.current && status === "Prêt ✓") {
      updateMarkers(mapInstanceRef.current);
    }
  }, [safeCoordinates]);

  // Fonction pour formater les données
  const formatDate = (date: Date) => new Date(date).toLocaleDateString("fr-FR");
  const formatPhone = (phones: number[]) => {
    if (!phones || !Array.isArray(phones)) return "Non défini";
    return phones.map((p) => p.toString()).join(", ");
  };

  // Fonction helper pour obtenir le style du marqueur
  function getMarkerStyle(coord: MapDetail, index: number) {
    if (!coord || !coord.accompaniment) {
      return {
        bg: "#F3F4F6",
        border: "#6B7280",
        text: "#1CA472",
        icon: MapPin,
      };
    }

    const { accompaniment } = coord;

    if (accompaniment.status === false) {
      return {
        bg: "#FEE2E2",
        border: "#EF4444",
        text: "#DC2626",
        icon: MapPin,
      };
    }

    if (accompaniment.users?.status === "disabled") {
      return {
        bg: "#F3F4F6",
        border: "#6B7280",
        text: "#1CA472",
        icon: MapPin,
      };
    }

    const colors = [
      { bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF", icon: MapPin },
      { bg: "#D1FAE5", border: "#1CA472", text: "#047857", icon: MapPin },
      { bg: "#FFE4E6", border: "#FB7185", text: "#BE123C", icon: MapPin },
      { bg: "#FEF3C7", border: "#FBBF24", text: "#92400E", icon: MapPin },
      { bg: "#E0E7FF", border: "#A78BFA", text: "#5B21B6", icon: MapPin },
      { bg: "#FFEDD5", border: "#FB923C", text: "#C2410C", icon: MapPin },
      { bg: "#F0FDF4", border: "#4ADE80", text: "#15803D", icon: MapPin },
      { bg: "#FDF2F8", border: "#F472B6", text: "#BE185D", icon: MapPin },
    ];
    return colors[index % colors.length];
  }

  return (
    <div
      className={`relative w-full ${
        className.includes("h-screen") ? "h-screen" : "h-[600px]"
      } rounded overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 rounded z-10"
        style={{
          background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
          padding: "4px",
        }}
      >
        <div
          ref={mapRef}
          className="w-full h-full rounded shadow-inner bg-gray-200"
        />
      </div>

      {/* Dialog Modal */}
      {showDialog && selectedGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={closeGroupDialog}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              width: "95vw",
              maxWidth: "1200px",
              height: "90vh",
              maxHeight: "800px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du dialog */}
            <div className="p-6 relative overflow-hidden flex-shrink-0 bg-primary">
              <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-white/10 rounded-full opacity-30"></div>
              <div className="absolute bottom-[-40px] left-[-40px] w-[150px] h-[150px] bg-white/5 rounded-full opacity-50"></div>

              <div className="relative z-20 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-[70px] h-[70px] bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {React.createElement(
                      getMarkerStyle(selectedGroup, 0).icon,
                      {
                        size: 32,
                        color: "white",
                      }
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedGroup.accompaniment?.name || "Groupe sans nom"}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold text-white uppercase tracking-wide">
                        {selectedGroup.accompaniment?.status === true
                          ? "✓ Terminér"
                          : "⚠ En cours"}
                      </span>
                      <span className="text-white/90 text-lg font-semibold">
                        Budget:{" "}
                        {(
                          selectedGroup.accompaniment?.budget || 0
                        ).toLocaleString("fr-FR")}{" "}
                        Fdj
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeGroupDialog}
                  className="w-10 h-10 bg-white/20 border-none rounded-full text-white cursor-pointer flex items-center justify-center text-xl transition-all duration-200 backdrop-blur-sm hover:bg-white/30 hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Corps du dialog avec scroll */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* Section principale en 3 colonnes */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Section Responsable */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <UserCheck size={24} color="white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      Responsable
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-600 font-medium text-sm block mb-1">
                        Nom complet
                      </label>
                      <div className="text-slate-800 font-semibold text-lg">
                        {selectedGroup.accompaniment?.users?.name ||
                          "Non défini"}
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-600 font-medium text-sm block mb-1">
                        Statut
                      </label>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-lg flex items-center gap-2 ${
                            selectedGroup.accompaniment?.users?.status ===
                            "enabled"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedGroup.accompaniment?.users?.status ===
                          "enabled" ? (
                            <CheckCircle size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {selectedGroup.accompaniment?.users?.status ===
                          "enabled"
                            ? "Activé"
                            : "Désactivé"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-600 font-medium text-sm block mb-1">
                        Email
                      </label>
                      <div className="text-slate-800 font-semibold text-sm break-all flex items-center gap-2">
                        <Mail size={14} />
                        {selectedGroup.accompaniment?.users?.email ||
                          "Non défini"}
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-600 font-medium text-sm block mb-1">
                        Téléphone
                      </label>
                      <div className="text-slate-800 font-semibold text-lg flex items-center gap-2">
                        <Phone size={16} />
                        {selectedGroup.accompaniment?.users?.phone ||
                          "Non défini"}
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-600 font-medium text-sm block mb-1">
                        Adresse personnelle
                      </label>
                      <div className="text-slate-800 font-semibold text-sm leading-relaxed flex items-start gap-2">
                        <Home size={14} className="mt-1 flex-shrink-0" />
                        {selectedGroup.accompaniment?.users?.address ||
                          "Non définie"}
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-600 font-medium text-sm block mb-1">
                        Genre
                      </label>
                      <div className="text-slate-800 font-semibold text-lg flex items-center gap-2">
                        <User size={16} />
                        {selectedGroup.accompaniment?.users?.gender === "homme"
                          ? "Masculin"
                          : "Féminin"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Groupe */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Building size={24} color="white" />
                    </div>
                    <h3 className="text-xl font-semibold text-yellow-800">
                      Informations du groupe
                    </h3>
                  </div>
                  <div className="text-yellow-800 space-y-4">
                    <div>
                      <label className="font-medium text-sm block mb-1">
                        Adresse du groupe
                      </label>
                      <div className="font-semibold text-sm leading-relaxed flex items-start gap-2">
                        <MapPin size={14} className="mt-1 flex-shrink-0" />
                        {selectedGroup.accompaniment?.adresse || "Non définie"}
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-sm block mb-1">
                        Téléphones
                      </label>
                      <div className="font-semibold text-lg flex items-center gap-2">
                        <Phone size={16} />
                        {formatPhone(selectedGroup.accompaniment?.phones)}
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-sm block mb-1">
                        Budget alloué
                      </label>
                      <div className="font-semibold text-xl flex items-center gap-2">
                        <Banknote size={20} />
                        {(
                          selectedGroup.accompaniment?.budget || 0
                        ).toLocaleString("fr-FR")}{" "}
                        Fdj
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-sm block mb-1">
                        Date de création
                      </label>
                      <div className="font-semibold text-lg flex items-center gap-2">
                        <Calendar size={16} />
                        {selectedGroup.accompaniment?.createdAt
                          ? formatDate(selectedGroup.accompaniment.createdAt)
                          : "Non définie"}
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-sm block mb-1">
                        Dernière mise à jour
                      </label>
                      <div className="font-semibold text-lg flex items-center gap-2">
                        <RefreshCw size={16} />
                        {selectedGroup.accompaniment?.updatedAt
                          ? formatDate(selectedGroup.accompaniment.updatedAt)
                          : "Non définie"}
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-sm block mb-1">
                        ID du projet
                      </label>
                      <div className="font-semibold font-mono text-xs bg-black/10 p-2 rounded-lg flex items-center gap-2">
                        <Clipboard size={12} />
                        {selectedGroup.accompaniment?.usersid || "Non défini"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Localisation */}
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-6 border border-sky-200">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
                      <MapPin size={24} color="white" />
                    </div>
                    <h3 className="text-xl font-semibold text-sky-800">
                      Localisation
                    </h3>
                  </div>
                  <div className="text-sky-800 space-y-4">
                    <div>
                      <label className="font-medium text-sm block mb-2">
                        Coordonnées GPS
                      </label>
                      <div className="font-mono bg-white p-4 rounded-lg border border-slate-200 text-sm">
                        <div className="mb-1">
                          <strong>Latitude:</strong> {selectedGroup.latitude}
                        </div>
                        <div>
                          <strong>Longitude:</strong> {selectedGroup.longitude}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-sm block mb-2">
                        Identifiants système
                      </label>
                      <div className="font-mono bg-white p-4 rounded-lg border border-slate-200 text-xs">
                        <div className="mb-1">
                          <strong>Groupe ID:</strong>{" "}
                          {selectedGroup.accompaniment?.id || "Non défini"}
                        </div>
                        <div>
                          <strong>User ID:</strong>{" "}
                          {selectedGroup.accompaniment?.usersid || "Non défini"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <a
                        href={`https://www.google.com/maps?q=${selectedGroup.latitude},${selectedGroup.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-semibold transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                      >
                        <Map size={20} />
                        Ouvrir dans Google Maps
                      </a>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${selectedGroup.latitude}&mlon=${selectedGroup.longitude}&zoom=15`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-semibold transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                      >
                        <Globe size={20} />
                        Ouvrir dans OpenStreetMap
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Membres */}
              {selectedGroup.accompaniment?.members &&
              selectedGroup.accompaniment.members.length > 0 ? (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Users size={24} color="white" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-800">
                        Membres du groupe
                      </h3>
                    </div>
                    <span className="bg-green-200/50 text-green-800 px-4 py-2 rounded-xl text-sm font-semibold">
                      {selectedGroup.accompaniment.members.length} membre
                      {selectedGroup.accompaniment.members.length > 1
                        ? "s"
                        : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGroup.accompaniment.members.map(
                      (member, index) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm"
                        >
                          <div className="w-15 h-15 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                            {(member.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800 text-lg mb-2">
                              {member.name || "Nom non défini"}
                            </div>

                            <div className="text-slate-600 text-sm mb-1 flex items-center gap-2">
                              <Smartphone size={12} />
                              {member.phone || "Téléphone non défini"}
                            </div>
                            <div className="text-slate-600 text-xs flex items-start gap-2">
                              <MapPin
                                size={12}
                                className="mt-0.5 flex-shrink-0"
                              />
                              {member.commune || "Adresse non définie"}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 text-center">
                  <div className="text-gray-500 text-lg">
                    <Users size={48} className="mx-auto mb-4" />
                    <div className="font-semibold mb-2">
                      Aucun membre dans ce groupe
                    </div>
                    <div>Ce groupe n'a pas encore de membres enregistrés</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Indicateur de statut */}
      {status !== "Prêt ✓" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-3xl z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              {status.includes("Erreur") ? (
                <AlertTriangle size={24} className="text-red-500" />
              ) : (
                <div className="animate-spin">
                  <Map size={24} />
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-800">
                  {status.includes("Erreur")
                    ? "Erreur de chargement"
                    : "Chargement de la carte"}
                </div>
                <div className="text-sm text-gray-600">{status}</div>
              </div>
            </div>
            {status.includes("Erreur") && (
              <button
                onClick={() => window.location.reload()}
                className="mt-3 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Recharger la page
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sélecteur de type de carte */}
      {status === "Prêt ✓" && (
        <div className="absolute top-6 left-14 z-20">
          <div className="relative">
            <button
              onClick={() => setShowMapSelector(!showMapSelector)}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/30 hover:bg-white transition-all"
            >
              {React.createElement(mapTypes[currentMapType].icon, { size: 18 })}
              <span className="font-medium text-gray-800">
                {mapTypes[currentMapType].name}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  showMapSelector ? "rotate-180" : ""
                }`}
              />
            </button>
            {showMapSelector && (
              <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden min-w-48 z-20">
                {Object.entries(mapTypes).map(([key, mapType]) => (
                  <button
                    key={key}
                    onClick={() => changeMapType(key as keyof typeof mapTypes)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                      currentMapType === key
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700"
                    }`}
                  >
                    {React.createElement(mapType.icon, { size: 18 })}
                    <span className="font-medium">{mapType.name}</span>
                    {currentMapType === key && (
                      <Check size={16} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contrôles */}
      {status === "Prêt ✓" && (
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-20">
          <button
            onClick={() => {
              if (mapInstanceRef.current && safeCoordinates.length > 0) {
                if (
                  markerClusterGroupRef.current &&
                  safeCoordinates.length > 1
                ) {
                  mapInstanceRef.current.fitBounds(
                    markerClusterGroupRef.current.getBounds().pad(0.1)
                  );
                } else if (safeCoordinates.length === 1) {
                  const lat = Number.parseFloat(safeCoordinates[0].latitude);
                  const lng = Number.parseFloat(safeCoordinates[0].longitude);
                  if (!isNaN(lat) && !isNaN(lng)) {
                    mapInstanceRef.current.setView([lat, lng], 15);
                  }
                }
              }
            }}
            className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 p-3 rounded-xl shadow-lg border border-white/30 text-gray-700"
            title="Centrer sur tous les points"
          >
            <Target size={20} />
          </button>
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([11.5721, 43.1456], 10);
              }
            }}
            className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 p-3 rounded-xl shadow-lg border border-white/30 text-gray-700"
            title="Vue Djibouti"
          >
            <Home size={20} />
          </button>
          {showRoute && (
            <button
              onClick={() => {
                if (routingControlRef.current && mapInstanceRef.current) {
                  mapInstanceRef.current.removeControl(
                    routingControlRef.current
                  );
                  routingControlRef.current = null;
                }

                if (userLocationMarkerRef.current && mapInstanceRef.current) {
                  mapInstanceRef.current.removeLayer(
                    userLocationMarkerRef.current
                  );
                  userLocationMarkerRef.current = null;
                }

                setShowRoute(false);
              }}
              className="bg-red-500/90 backdrop-blur-sm hover:bg-red-500 transition-all duration-200 p-3 rounded-xl shadow-lg border border-white/30 text-white"
              title="Masquer l'itinéraire"
            >
              <X size={20} />
            </button>
          )}

          {routeLoading && (
            <div className="bg-blue-500/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/30 text-white">
              <div className="animate-spin">
                <RefreshCw size={20} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
