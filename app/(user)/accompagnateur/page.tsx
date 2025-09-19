import { Dashboard } from "@/core/view/accompagnateur/accompagnement-body";
import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
 
const UserDashboard = async () => {
  const user = await GetUserCookies();
 
  return <Dashboard Id={user.id}   permission={user}  />;
};

export default UserDashboard;
