/**
 * Utilitaire pour compresser et optimiser les images avant upload
 * Réduit la taille des fichiers de 60-90% selon l'image
 */

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

/**
 * Compresse une image en utilisant Canvas API
 * @param file - Fichier image à compresser
 * @param options - Options de compression
 * @returns Promise<File> - Fichier compressé
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 2, // Taille max en MB
    maxWidthOrHeight = 1920, // Dimension max
    quality = 0.8, // Qualité de compression (0-1)
  } = options;

  // Vérifier si c'est une image
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier n'est pas une image");
  }

  // Si l'image est déjà petite, ne pas compresser
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB <= maxSizeMB / 2) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculer les nouvelles dimensions en gardant le ratio
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Impossible de créer le contexte canvas"));
          return;
        }

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en Blob avec compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Échec de la compression"));
              return;
            }

            // Vérifier la taille finale
            const compressedSizeMB = blob.size / 1024 / 1024;
            
            // Si encore trop grand, réduire la qualité
            if (compressedSizeMB > maxSizeMB && quality > 0.5) {
              canvas.toBlob(
                (blob2) => {
                  if (!blob2) {
                    reject(new Error("Échec de la compression"));
                    return;
                  }
                  const compressedFile = new File([blob2], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                },
                "image/jpeg",
                quality - 0.2
              );
            } else {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            }
          },
          file.type === "image/png" ? "image/png" : "image/jpeg",
          quality
        );
      };
      img.onerror = () => {
        reject(new Error("Erreur de chargement de l'image"));
      };
    };
    reader.onerror = () => {
      reject(new Error("Erreur de lecture du fichier"));
    };
  });
}

/**
 * Valide la taille d'un fichier
 * @param file - Fichier à valider
 * @param maxSizeMB - Taille maximale en MB
 * @returns boolean
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const fileSizeMB = file.size / 1024 / 1024;
  return fileSizeMB <= maxSizeMB;
}

/**
 * Valide le type d'un fichier
 * @param file - Fichier à valider
 * @param allowedTypes - Types autorisés
 * @returns boolean
 */
export function validateFileType(
  file: File,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp"]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Formate la taille d'un fichier en format lisible
 * @param bytes - Taille en bytes
 * @returns string - Taille formatée
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
