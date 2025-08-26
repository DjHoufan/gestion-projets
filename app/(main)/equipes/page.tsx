import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { EquipeBody } from "@/core/view/team/team-body";
 

const Epuipes = async () => {
  const permission = await GetUserCookies();
  
  return <EquipeBody permission={permission} />;
};

export default Epuipes;
