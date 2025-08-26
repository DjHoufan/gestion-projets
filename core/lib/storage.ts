"use server";

import { UrlPath } from "@/core/lib/constants";
import { createActionServerCookies } from "@/core/supabase/server";

import { db } from "@/core/lib/db";

export const filesUpload = async (files: FormData) => {
  const supabase = await createActionServerCookies();
  const typeToFolderMap = new Map<string, string>([
    ["image/", "image"],
    ["video/", "video"],
    ["application/pdf", "pdf"],
    ["application/msword", "word"],
    [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "word",
    ],
  ]);

  const uploadTasks = Array.from(files.entries()).map(async ([key, value]) => {
    // Vérification du type
    if (!(value instanceof File)) {
      return null;
    }

    // Déterminer le dossier approprié
    const nameFolder = Array.from(typeToFolderMap.entries()).find(([prefix]) =>
      value.type.startsWith(prefix)
    )?.[1];

    if (!nameFolder) {
      return null;
    }

    try {
      // Téléchargement du fichier vers Supabase
      const { data, error } = await supabase.storage
        .from("docs")
        .upload(`${value.name}_${Date.now()}`, value);

      if (error) {
        return { success: false, error: true };
      }

      const element = await db.files.create({
        data: {
          name: value.name,
          type: nameFolder,
          url: `${UrlPath}/docs/${data?.path}`,
          size: value.size,
        },
      });

      return { success: element, error: false };
    } catch (err) {
      return { success: false, error: true };
    }
  });

  // Attendre que tous les fichiers soient traités
  const results = await Promise.all(uploadTasks);

  // Vérifier les échecs
  if (results.some((result) => result?.error)) {
    return { success: false, error: true };
  }

  return { success: results, error: false };
};

export const uploadImage = async (file: FormData, folder: string) => {
  const supabase = await createActionServerCookies();
  const { data, error } = await supabase.storage
    .from(folder)
    .upload(`${Date.now()}_${folder}.png`, file);

  return { success: data, error };
};

export const deleteFileDoc = async (id: string) => {
  try {
    const docs = await db.files.delete({ where: { id } });

    await deleteFromStorage(docs.name);

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const deleteFromStorage = async (name: string) => {
  const supabase = await createActionServerCookies();
  const { data } = await supabase.storage.from("docs").remove([name]);

  if (data) {
    return { success: true, error: false };
  } else {
    return { success: false, error: true };
  }
};
