import { Hono } from "hono";
import { sessionMiddleware } from "@/core/lib/session-middleware";
import { unstable_cache } from "next/cache";
import { getAllStatsData } from "@/core/lib/queries_stats";

 

const getDashboardStats = unstable_cache(
  async () => getAllStatsData(),
  ["stats-dashboard"],
  { revalidate: 300 } // 5 min
);

 

const app = new Hono().get("/akis", sessionMiddleware, async (c) => {
  const data = await getDashboardStats();
  return c.json({ data });
});

export default app;
