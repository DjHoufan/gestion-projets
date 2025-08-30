"use client";

import { ProjectUserDataProps } from "@/core/lib/queries_stats";
import { ProjectStats } from "@/core/view/home/project-stats";
import { UserStats } from "@/core/view/home/user-stats";

type Props = {
  data: ProjectUserDataProps;
  isPending: boolean;
};

export const ProjectUsers = ({ data, isPending }: Props) => {
  return (
    <section className="flex flex-col md:flex-row justify-between gap-5 ">
      <ProjectStats projects={data?.projects!} isPending={isPending} />
      <UserStats
        userTypes={data?.userTypes!}
        userStatus={data?.userStatus!}
        isPending={isPending}
      />
    </section>
  );
};
