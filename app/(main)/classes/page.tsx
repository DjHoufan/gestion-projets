import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import ClasseBody from "@/core/view/classe/classe-body";

const Classes = async () => {
  const permission = await GetUserCookies();

  return <ClasseBody permission={permission} />;
};

export default Classes;
