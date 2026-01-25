import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
 

import { EquipeBody } from "@/core/view/team/team-body";


 

 
const Epuipes = async () => {
  const permission = await GetUserCookies();

 
 const result = await updateUserPassword('61a4bf7d-70c6-43db-8a1a-0b25d01a43b8', 'Password@55V1');

 console.log({result});
 
  return <EquipeBody permission={permission} />;
};

export default Epuipes;
