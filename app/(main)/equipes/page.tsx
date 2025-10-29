import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
 
 
import { EquipeBody } from "@/core/view/team/team-body";

const Epuipes = async () => {
  const permission = await GetUserCookies();

  // const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
  //   "1921de34-d251-492d-9495-f6990765bc30",
  //   {
  //     password: "Password@55V1",
  //   }
  // );

  // console.log({ data ,error});

  return <EquipeBody permission={permission} />;
};

export default Epuipes;
