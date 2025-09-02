import { Hono } from "hono";
import { sessionMiddleware } from "@/core/lib/session-middleware";
import { unstable_cache } from "next/cache";

const getCachedPrimaryMetrics = unstable_cache(
  async () => getPrimaryMetrics(),
  ["primary-metrics"],
  { revalidate: 300 } // 5 min
);

const getCachedStats = unstable_cache(
  async () => getStatsDatas(),
  ["stats-data"],
  { revalidate: 300 } // 5 min
);

const getCachedProjectUsers = unstable_cache(
  async () => getSatsProjectUsers(),
  ["project-users"],
  { revalidate: 300 } // 5 min
);

const getCachedGlobalActivities = unstable_cache(
  async () => getGlobalActivities(),
  ["global-activities"],
  { revalidate: 300 } // 5 min
);

const getDashboardStats = unstable_cache(
  async () => getAllStatsData(),
  ["stats-dashboard"],
  { revalidate: 300 } // 5 min
);

import {
  getPrimaryMetrics,
  getSatsProjectUsers,
  getStatsDatas,
  getGlobalActivities,
} from "@/core/lib/stats";
import { getAllStatsData } from "@/core/lib/queries_stats";

const app = new Hono()
  .get("/DashboardStats", sessionMiddleware, async (c) => {
    const data = await getCachedPrimaryMetrics();
    return c.json({ data });
  })
  .get("/statsData", sessionMiddleware, async (c) => {
    const data = await getCachedStats();
    return c.json({ data });
  })
  .get("/SatsProjectUsers", sessionMiddleware, async (c) => {
    const data = await getCachedProjectUsers();
    return c.json({ data });
  })
  .get("/Activities", sessionMiddleware, async (c) => {
    const data = await getCachedGlobalActivities();
    return c.json({ data });
  })
  .get("/akis", sessionMiddleware, async (c) => {
    const data = await getAllStatsData();
    return c.json({ data });
  });

export default app;
