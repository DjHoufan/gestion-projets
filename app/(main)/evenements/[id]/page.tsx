import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { IdProps } from "@/core/lib/types";
import { EventDetail } from "@/core/view/events/event-detail";

const Evenement = async ({ params }: IdProps) => {
  const { Id } = await params;
  const permission = await GetUserCookies();

  return <EventDetail Id={Id} permission={permission} />;
};

export default Evenement;
