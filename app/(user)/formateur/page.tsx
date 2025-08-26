import { getCurrentUser } from "@/core/hooks/use-current-user";
import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { TrainerBody } from "@/core/view/RapportTrainer/trainer-body";
 
const Formateur = async () => {
  const user = await GetUserCookies();

  const currentUser = await getCurrentUser();

  return <TrainerBody userId={user.id} currentUser={currentUser!} />;
};

export default Formateur;
