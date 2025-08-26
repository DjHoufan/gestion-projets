"use client";

import { Spinner } from "@/core/components/ui/spinner";
import { useGetSatsProjectUsers } from "@/core/hooks/use-stats";
import { ProjectStats } from "@/core/view/home/project-stats";
import { UserStats } from "@/core/view/home/user-stats";

export const ProjectUsers = () => {
  const { data, isPending } = useGetSatsProjectUsers();
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
