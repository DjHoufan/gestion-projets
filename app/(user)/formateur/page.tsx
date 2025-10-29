import { getCurrentUser } from "@/core/hooks/use-current-user";
import { TrainerBody } from "@/core/view/RapportTrainer/trainer-body";

// Configuration du cache pour cette page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const Formateur = async () => {
  // Utiliser uniquement getCurrentUser qui contient toutes les infos nécessaires
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  return <TrainerBody userId={currentUser.id} currentUser={currentUser} />;
};

export default Formateur;
