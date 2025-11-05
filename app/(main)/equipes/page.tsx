import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
// import { supabaseAdmin } from "@/core/supabase/client";
 
 
import { EquipeBody } from "@/core/view/team/team-body";


// async function resetPasswords() {
//   const userIds = [
//   "13d2536e-bfab-4c07-b5eb-496715b53b27"
//   ];

//   for (const id of userIds) {
//     const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
//       password: "Password@55V1",
//     });

//     console.log({data});
    

//     if (error) {
//       console.error(`Erreur pour ${id}:`, error.message);
//     } else {
//       console.log(`Mot de passe réinitialisé pour: ${id}`);
//     }
//   }
// }

const Epuipes = async () => {
 
  const permission = await GetUserCookies();
 
  // console.log({ data ,error});

  return <EquipeBody permission={permission} />;
};

export default Epuipes;
