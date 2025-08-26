"use client";

import { Welcome } from "@/core/view/home/welcome";
import { MetricsGrid } from "@/core/view/home/metrics-grid";
import { MainDashboard } from "@/core/view/home/main-dashboard";
 
import { ActivityStats } from "@/core/view/home/activity-stats";
import { ProjectUsers } from "@/core/view/home/project-users";
 

const Home = () => {
  return (
    <div className="p-6 space-y-6 max-w-full">
      <Welcome />
      <MetricsGrid />

      <MainDashboard />
      <ProjectUsers />
      <ActivityStats />
    </div>
  );
};

export default Home;
