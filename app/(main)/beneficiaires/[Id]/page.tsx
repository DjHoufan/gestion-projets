import { MemberDetail } from "@/core/view/member/member-detail";
import { IdProps } from "@/core/lib/types";

const Member = async ({ params }: IdProps) => {
  const { Id } = await params;
  return <MemberDetail Id={Id} />;
};

export default Member;
