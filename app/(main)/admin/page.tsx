import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { AdminBody } from "@/core/view/admin/admin-body";

const Admin = async () => {
  const permission = await GetUserCookies();

  if (permission?.type !== "admin") return "/";

  return <AdminBody />;
};

export default Admin;
