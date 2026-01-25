import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
// import { supabaseAdmin } from "@/core/supabase/client";
 

import { EquipeBody } from "@/core/view/team/team-body";


//  export async function updateUserPassword(
//   userId: string,
//   newPassword: string
// ) {
//   const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
//     userId,
//     {
//       password: newPassword,
//     }
//   )

//   if (error) {
//     throw new Error(`Erreur mise à jour mot de passe : ${error.message}`)
//   }

//   return data
// }


 

 
const Epuipes = async () => {
  const permission = await GetUserCookies();

 

  return <EquipeBody permission={permission} />;
};

export default Epuipes;
