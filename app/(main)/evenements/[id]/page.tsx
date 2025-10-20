import { IdProps } from "@/core/lib/types";
import { EventDetail } from "@/core/view/events/event-detail";

const Evenement = async ({ params }: IdProps) => {
  const { Id } = await params;

  return <EventDetail Id={Id}/>;
};

export default Evenement;
