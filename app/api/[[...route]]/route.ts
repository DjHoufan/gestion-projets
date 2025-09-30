import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/core/servers/auth/route";
import projet from "@/core/servers/projet/route";
import team from "@/core/servers/team/route";
import member from "@/core/servers/member/route";
import accompaniment from "@/core/servers/accompaniment/route";
import maps from "@/core/servers/maps/route";
import purchase from "@/core/servers/purchase/route";
import planning from "@/core/servers/planning/route";
import rapport from "@/core/servers/rapport/route";
import chat from "@/core/servers/chat/route";
import admin from "@/core/servers/admin/route";
import trainer from "@/core/servers/trainer/route";
import leave from "@/core/servers/leave/route";
import stats from "@/core/servers/stats/route";
import classe from "@/core/servers/classe/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/projet", projet)
  .route("/team", team)
  .route("/member", member)
  .route("/accompaniment", accompaniment)
  .route("/maps", maps)
  .route("/purchase", purchase)
  .route("/planning", planning)
  .route("/rapport", rapport)
  .route("/chat", chat)
  .route("/admin", admin)
  .route("/trainer", trainer)
  .route("/leave", leave)
  .route("/stats", stats)
  .route("/classe", classe);

export const GET = handle(routes);
export const POST = handle(routes);
export const PATCH = handle(routes);
export const DELETE = handle(routes);

export type AppType = typeof routes;
