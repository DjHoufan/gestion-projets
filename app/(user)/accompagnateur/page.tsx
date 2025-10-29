import { Dashboard } from "@/core/view/accompagnateur/accompagnement-body";
import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";

// Configuration du cache pour cette page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const UserDashboard = async () => {
  const user = await GetUserCookies();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return <Dashboard Id={user.id} permission={user} />;
};

export default UserDashboard;
