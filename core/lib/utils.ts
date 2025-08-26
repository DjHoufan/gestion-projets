import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Permissions, ProjectDetail, RolePermission } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRemainingDays = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

export const calculateProgress = (startDate: Date, endDate: Date): number => {
  const now = new Date();

  if (now <= startDate) return 0;
  if (now >= endDate) return 100;

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();

  return Math.round((elapsed / totalDuration) * 100);
};

export const calculateDuration = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 jour";
  if (diffDays < 30) return `${diffDays} jours`;
  if (diffDays < 365) return `${Math.round(diffDays / 30)} mois`;
  return `${Math.round(diffDays / 365)} an${diffDays >= 730 ? "s" : ""}`;
};

export const getProjectStatus = (project: ProjectDetail) => {
  const now = new Date();
  const start = new Date(project.startDate);
  const end = new Date(project.endDate);

  if (now < start) {
    return {
      label: "À venir",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  } else if (now > end) {
    return {
      label: "Terminé",
      color: "bg-emerald-200 text-emerald-800 border-emerald-300",
    };
  } else {
    return {
      label: "En cours",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    }; // Orange for active
  }
};

export const calculerAge = (dob: string | Date) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number) => {
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(amount) + " FDJ"
  );
};

export const formatDateTime = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (dateString: string | Date) => {
  return new Date(dateString).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const timeSlots = Array.from({ length: (24 - 7) * 4 }, (_, i) => {
  const totalMinutes = 7 * 60 + i * 15; // Start from 7:00 (420 minutes)
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
});

export const daysOfWeek = [
  { value: "lundi", label: "Lundi" },
  { value: "mardi", label: "Mardi" },
  { value: "mercredi", label: "Mercredi" },
  { value: "jeudi", label: "Jeudi" },
  { value: "vendredi", label: "Vendredi" },
  { value: "samedi", label: "Samedi" },
  { value: "dimanche", label: "Dimanche" },
];

export const getDayFromDate = (date: Date): number => {
  return date.getDate();
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};

export const isDateInMonth = (date: Date, month: Date): boolean => {
  return (
    date.getMonth() === month.getMonth() &&
    date.getFullYear() === month.getFullYear()
  );
};

export const calculateDurationTime = (
  startTime: string,
  endTime: string
): string => {
  // Convertir les heures en minutes depuis minuit
  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  // Calculer la différence en minutes
  let diffMinutes = endMinutes - startMinutes;

  // Gérer le cas où l'heure de fin est le lendemain
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60; // Ajouter 24 heures
  }

  // Convertir la différence en heures et minutes
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (minutes === 0) {
    return `${hours} heures`;
  } else {
    return `${hours} heures et ${minutes} minutes`;
  }
};

export function formatTimeMessage(date: Date | string): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "À l'instant";
  } else if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
  } else {
    return messageDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

// Fonction pour détecter et formater les mentions dans le texte
export function formatMentions(text: string, userNames: string[]): string {
  let formattedText = text;

  // Créer un pattern pour chaque nom d'utilisateur
  userNames.forEach((name) => {
    // Échapper les caractères spéciaux pour la regex
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Créer une regex qui trouve le nom complet (insensible à la casse)
    const regex = new RegExp(`\\b${escapedName}\\b`, "gi");

    // Remplacer par une version avec span coloré
    formattedText = formattedText.replace(regex, (match) => {
      return `<span class="mention-user">${match}</span>`;
    });
  });

  return formattedText;
}

// Fonction pour extraire les mentions d'un texte
export function extractMentions(text: string, userNames: string[]): string[] {
  const mentions: string[] = [];

  userNames.forEach((name) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedName}\\b`, "gi");

    if (regex.test(text)) {
      mentions.push(name);
    }
  });

  return mentions;
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  );
};

export function definePermissions(
  rp: RolePermission,
  pathname: string
): Permissions {
 

  const scopedAccess = (rp.access ?? [])
    .map((a) => a.split("|").map((s) => s.trim()))
    .filter(([route]) => route === pathname);
 

  // Extraire toutes les actions sauf le premier élément (la route)
  const perms = scopedAccess.flatMap(([_, ...actions]) => actions);

 

  // Flags simples
  const canView = perms.includes("view");
  const canAdd = perms.includes("create");
  const canModify = perms.includes("update");
  const canDelete = perms.includes("delete");
  const canReset = perms.includes("reset");
  const canDetails = perms.includes("details");

  // Flag admin implicite
  const isAdmin =
    rp.type === "admin" || rp.type === "accompanist" || rp.type === "trainer";

  return {
    canAdd: canAdd || isAdmin,
    canModify: canModify || isAdmin,
    canDelete: canDelete || isAdmin,
    canReset: canReset || isAdmin,
    canDetails: canDetails || isAdmin,
    canView: canView || isAdmin,
  };
}
