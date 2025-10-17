import { SupervisionProvider } from "@/core/contexts/SupervisionContext";
import { getCurrentUser } from "@/core/hooks/use-current-user";
import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { SupLayoutContent } from "@/core/view/superiviseur/super-layout";

export default async function SupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await GetUserCookies();
  const user = await getCurrentUser();
  return (
    <SupervisionProvider>
      <SupLayoutContent userId={userId.id} user={user!}>
        {children}
      </SupLayoutContent>
    </SupervisionProvider>
  );
}
