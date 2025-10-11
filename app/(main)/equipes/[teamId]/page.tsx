import { TeamDetail } from "@/core/view/team/team-detail";
 
export type Props = {
  params: Promise<{ teamId: string }>;
};

//akis''11

const Team = async ({ params }: Props) => {
  const { teamId } = await params;

  return <TeamDetail Id={teamId} />;
};

export default Team;
