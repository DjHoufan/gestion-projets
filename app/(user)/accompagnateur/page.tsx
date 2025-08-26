import { Dashboard } from "@/core/view/accompagnateur/accompagnement-body";
import { getCurrentUser } from "@/core/hooks/use-current-user";
import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
 
const UserDashboard = async () => {
  const user = await GetUserCookies();
  const currentUser = await getCurrentUser();
  return <Dashboard Id={user.id} currentUser={currentUser!} permission={user}  />;
};

export default UserDashboard;
