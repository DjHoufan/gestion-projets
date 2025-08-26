import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { BodyAcces } from "@/core/view/access/access-body";

const Acces = async () => {
  const permission = await GetUserCookies();
  return <BodyAcces permission={permission} />;
};

export default Acces;
