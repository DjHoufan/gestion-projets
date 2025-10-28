import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
 
import { EquipeBody } from "@/core/view/team/team-body";

const Epuipes = async () => {
  const permission = await GetUserCookies();

  // const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
  //   "c61c84b4-db4a-41a4-901c-c9d0f05807b1",
  //   {
  //     password: "Password@55V1",
  //   }
  // );

  // console.log({ data ,error});

  return <EquipeBody permission={permission} />;
};

export default Epuipes;
