import { GetUserCookies } from "@/core/hooks/use-get-user-cookies";
import { MemberBody } from "@/core/view/member/member-body";

const Members = async () => {
  const permission = await GetUserCookies();

  return (
    <div className="p-6 space-y-6 max-w-full">
      <MemberBody permission={permission} />
    </div>
  );
};

export default Members;
