import { Hono } from "hono";
import { sessionMiddleware } from "@/core/lib/session-middleware";
import { unstable_cache } from "next/cache";

 
const getDashboardStats = unstable_cache(
  async () => getAllStatsData(),
  ["stats-dashboard"],
  { revalidate: 300 } // 5 min
);

import { getAllStatsData } from "@/core/lib/queries_stats";

const app = new Hono().get("/akis", sessionMiddleware, async (c) => {
  const data = await getDashboardStats();
  return c.json({ data });
});

export default app;
