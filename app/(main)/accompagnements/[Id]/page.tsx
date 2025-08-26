import { AccompanimentDetails } from "@/core/view/accompaniment/Accompaniment-details";
import { IdProps } from "@/core/lib/types";
import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";

const Accompaniment = async ({ params }: IdProps) => {
  const { Id } = await params;
  const permission = await GetUserCookies();

  
  return <AccompanimentDetails Id={Id} permission={permission} />;
};

export default Accompaniment;
