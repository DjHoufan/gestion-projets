import type { Metadata } from "next";
import MainLayout from "@/core/components/layout/main-layout";
import { getCurrentUser } from "@/core/hooks/use-current-user";
import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";

export const metadata: Metadata = {
  title: "Houfan",
  description: "Research & Transform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const userCurrent = await GetUserCookies();
  return (
    <MainLayout userId={userCurrent.id} user={user}>
      {children}

     
    </MainLayout>
  );
}
