import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { AccompanimentBody } from "@/core/view/accompaniment/Accompaniment-body";

const Accompaniments = async () => {
  const permission = await GetUserCookies();
  return <AccompanimentBody permission={permission} />;
};

export default Accompaniments;
