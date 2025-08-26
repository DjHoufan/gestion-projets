import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { IdProps } from "@/core/lib/types";
import { definePermissions } from "@/core/lib/utils";
import { ClasseDetail } from "@/core/view/classe/classe-detail";

const Classe = async ({ params }: IdProps) => {
  const { Id } = await params;
  const permission = await GetUserCookies();

  const { canDetails } = definePermissions(permission, "classes");

  if (!canDetails) return "/";

  return <ClasseDetail Id={Id} />;
};

export default Classe;
