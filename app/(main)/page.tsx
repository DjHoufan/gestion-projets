"use client";

import { Welcome } from "@/core/view/home/welcome";
import { MetricsGrid } from "@/core/view/home/metrics-grid";
import { MainDashboard } from "@/core/view/home/main-dashboard";

import { ActivityStats } from "@/core/view/home/activity-stats";
import { ProjectUsers } from "@/core/view/home/project-users";
import { useGetakis } from "@/core/hooks/use-stats";

const Home = () => {
  const { data, isPending } = useGetakis();
 
  
  return (
    <div className="p-6 space-y-6 max-w-full">
      <Welcome />
      <MetricsGrid data={data?.primaryMetrics!} isPending={isPending} />

      <MainDashboard statsData={data?.statsDatas!} isPending={isPending} />
      <ProjectUsers data={data?.projectUsers!} isPending={isPending} />
      <ActivityStats data={data?.globalActivities!} isLoading={isPending} />
    </div>
  );
};

export default Home;
