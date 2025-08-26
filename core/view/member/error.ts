import { toast } from "@/core/components/global/custom-toast";

type PrismaError = {
  error?: {
    code?: string;
    meta?: {
      target?: string[];
    };
  };
};

export const handleMemberError = (err: unknown): void => {
  try {
    // Vérifie si c'est une Error et a un message
    if (!(err instanceof Error) || !err.message) {
      throw new Error("Erreur inconnue");
    }

    let parsedError: PrismaError;

    try {
      parsedError = JSON.parse(err.message) as PrismaError;
    } catch (parseError) {
      // Si le parsing échoue, on utilise le message d'erreur original
      toast.error({
        message: `Échec de la création de l'utilisateur : ${err.message}`,
      });
      return;
    }

    // Vérifie si c'est une erreur de violation de contrainte unique
    if (
      parsedError?.error?.code === "P2002" &&
      Array.isArray(parsedError?.error?.meta?.target)
    ) {
      const target = parsedError.error.meta.target[0];
      let message = "Un champ unique est déjà utilisé.";

      switch (target) {
        case "email":
          message =
            "L'adresse email est déjà utilisée par un autre utilisateur.";
          break;
        case "phone":
          message =
            "Le numéro de téléphone est déjà utilisé par un autre utilisateur.";
          break;
        // Ajoutez d'autres cas au besoin
      }

      toast.error({ message });
    } else {
      // Erreur non gérée spécifiquement
      toast.error({
        message: `Échec de la création de l'utilisateur : ${err.message}`,
      });
    }
  } catch (unexpectedError) {
 
   
    toast.error({
      message:
        "Une erreur inattendue est survenue lors de la création de l'utilisateur",
    });
  }
};
