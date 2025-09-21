"server-only";

import { db } from "@/core/lib/db";
import { startOfYear, endOfYear, subYears } from "date-fns";

/* ---------------- PRIMARY METRICS ---------------- */
export async function getPrimaryMetrics() {
  const now = new Date();
  const startCurrentYear = startOfYear(now);
  const startLastYear = startOfYear(subYears(now, 1));

  // Projects
  const projectsThisYear = await db.project.count();
  const projectsLastYear = await db.project.count({
    where: { createdAt: { gte: startLastYear, lt: startCurrentYear } },
  });
  const projectDelta = projectsThisYear - projectsLastYear;

  // Members
  const membersThisYear = await db.member.count();
  const membersLastYear = await db.member.count({
    where: { createdAt: { gte: startLastYear, lt: startCurrentYear } },
  });
  const memberDelta = membersThisYear - membersLastYear;

  // Accompaniments
  const accompThisYear = await db.accompaniment.count();
  const accompLastYear = await db.accompaniment.count({
    where: { createdAt: { gte: startLastYear, lt: startCurrentYear } },
  });
  const accompDelta = accompThisYear - accompLastYear;

  // Visits
  const visitsThisYear = await db.visits.count({
    where: { date: { gte: startCurrentYear } },
  });
  const visitsLastYear = await db.visits.count({
    where: { date: { gte: startLastYear, lt: startCurrentYear } },
  });
  const visitsDelta = visitsThisYear - visitsLastYear;

  return [
    {
      title: "Project",
      value: projectsThisYear.toString(),
      change: `${projectDelta >= 0 ? "+" : ""}${projectDelta} vs l'année dernière`,
    },
    {
      title: "Member",
      value: membersThisYear.toString(),
      change: `${memberDelta >= 0 ? "+" : ""}${memberDelta} vs l'année dernière`,
    },
    {
      title: "Accompaniment",
      value: accompThisYear.toString(),
      change: `${accompDelta >= 0 ? "+" : ""}${accompDelta} vs l'année dernière`,
    },
    {
      title: "Visits",
      value: visitsThisYear.toString(),
      change: `${visitsDelta >= 0 ? "+" : ""}${visitsDelta} vs l'année dernière`,
    },
  ];
}

function getMonths(year: number) {
  return Array.from({ length: 12 }).map((_, i) => ({
    month: new Date(year, i, 1).toLocaleString("fr-FR", { month: "short" }),
    index: i,
  }));
}

/* ---------------- STATS DATAS ---------------- */
export async function getStatsDatas(year: number = new Date().getFullYear()) {
  const months = getMonths(year);

  // USERS
  const totalUsers = await db.member.count();
  const byGender = await db.member.groupBy({ by: ["gender"], _count: { gender: true } });
  const userCounts = await db.users.groupBy({
    by: ["createdAt"],
    _count: { id: true },
    where: {
      createdAt: { gte: startOfYear(new Date(year, 0, 1)), lte: endOfYear(new Date(year, 11, 31)) },
    },
  });

  let cumulative = 0;
  const growthData = months.map(({ index }) => {
    const count = userCounts.filter((u) => u.createdAt.getMonth() === index)
      .reduce((a, b) => a + b._count.id, 0);
    cumulative += count;
    return cumulative;
  });

  // PROJECTS
  const totalProjects = await db.project.count();
  const activeProjects = await db.project.count({ where: { status: true } });
  const inactiveProjects = totalProjects - activeProjects;

  const completedProjects = await db.project.groupBy({
    by: ["endDate"], _count: { id: true },
    where: { status: false, endDate: { gte: startOfYear(new Date(year, 0, 1)), lte: endOfYear(new Date(year, 11, 31)) } },
  });
  const activeByMonth = await db.project.groupBy({
    by: ["startDate"], _count: { id: true },
    where: { status: true, startDate: { gte: startOfYear(new Date(year, 0, 1)), lte: endOfYear(new Date(year, 11, 31)) } },
  });

  const monthlyProgress = months.map(({ month, index }) => ({
    month,
    completed: completedProjects.filter((p) => p.endDate.getMonth() === index).reduce((a, b) => a + b._count.id, 0),
    active: activeByMonth.filter((p) => p.startDate.getMonth() === index).reduce((a, b) => a + b._count.id, 0),
  }));

  // ACCOMPANIMENTS
  const totalAcc = await db.accompaniment.count();
  const activeAcc = await db.accompaniment.count({ where: { status: true } });
  const completedAcc = totalAcc - activeAcc;

  const budgetSum = await db.accompaniment.aggregate({ _sum: { budget: true } });
  const avgBudget = totalAcc > 0 ? (budgetSum._sum.budget ?? 0) / totalAcc : 0;

  const accCounts = await db.accompaniment.groupBy({
    by: ["createdAt"], _count: { id: true },
    where: { createdAt: { gte: startOfYear(new Date(year, 0, 1)), lte: endOfYear(new Date(year, 11, 31)) } },
  });
  const monthlyAccData = months.map(({ index }) =>
    accCounts.filter((a) => a.createdAt.getMonth() === index).reduce((a, b) => a + b._count.id, 0)
  );

  // ACTIVITIES
  const visits = await db.visits.count();
  const meetings = await db.rencontre.count();
  const conflicts = await db.conflit.count();
  const resolvedConflicts = await db.conflit.count({ where: { status: true } });

  const visitsByMonth = await db.visits.groupBy({
    by: ["date"], _count: { id: true },
    where: { date: { gte: startOfYear(new Date(year, 0, 1)), lte: endOfYear(new Date(year, 11, 31)) } },
  });
  const meetingsByMonth = await db.rencontre.groupBy({
    by: ["date"], _count: { id: true },
    where: { date: { gte: startOfYear(new Date(year, 0, 1)), lte: endOfYear(new Date(year, 11, 31)) } },
  });
  const conflictsByMonth = await db.conflit.groupBy({
    by: ["createdAt"], _count: { id: true },
    where: { createdAt: { gte: startOfYear(new Date(year, 0, 1)), lte: endOfYear(new Date(year, 11, 31)) } },
  });

  const monthlyActivity = months.map(({ month, index }) => ({
    month,
    visits: visitsByMonth.filter((v) => v.date.getMonth() === index).reduce((a, b) => a + b._count.id, 0),
    meetings: meetingsByMonth.filter((m) => m.date.getMonth() === index).reduce((a, b) => a + b._count.id, 0),
    conflicts: conflictsByMonth.filter((c) => c.createdAt.getMonth() === index).reduce((a, b) => a + b._count.id, 0),
  }));

  // FILES
  const totalFiles = await db.files.count();
  const totalSizeAgg = await db.files.aggregate({ _sum: { size: true } });
  const totalSize = (totalSizeAgg._sum.size ?? 0) / 1024;
  const byType = await db.files.groupBy({ by: ["type"], _count: { type: true } });

  return {
    users: { total: totalUsers, byGender: byGender.map((g) => ({ name: g.gender, value: g._count.gender })), growthData },
    projects: { total: totalProjects, active: activeProjects, inactive: inactiveProjects, monthlyProgress },
    accompaniments: { total: totalAcc, active: activeAcc, completed: completedAcc, budget: budgetSum._sum.budget ?? 0, avgBudget, monthlyData: monthlyAccData },
    activities: { visits, meetings, conflicts, resolvedConflicts, monthlyActivity },
    files: { total: totalFiles, totalSize, byType: byType.map((f) => ({ name: f.type, value: f._count.type })) },
  };
}

/* ---------------- PROJECT USERS ---------------- */
export async function getSatsProjectUsers() {
  const projects = await db.project.findMany({
    select: { name: true, status: true, local: true, endDate: true, _count: { select: { members: true } } },
  });

  const userTypesCount = await db.users.groupBy({ by: ["type"], _count: { type: true } });
  const userStatusCount = await db.users.groupBy({ by: ["status"], _count: { status: true } });

  const recentProjects = await db.project.findMany({
    take: 5, orderBy: { createdAt: "desc" },
    select: { name: true, status: true, local: true, endDate: true, _count: { select: { members: true } } },
  });

  const formattedProjects = projects.map((p) => ({
    name: p.name, status: p.status, members: p._count.members, location: p.local, endDate: p.endDate.toISOString().split("T")[0],
  }));

  const formattedRecentProjects = recentProjects.map((p) => ({
    name: p.name, status: p.status, location: p.local, endDate: p.endDate.toISOString().split("T")[0],
  }));

  const totalUsers = userTypesCount.reduce((sum, t) => sum + t._count.type, 0);

  const formattedUserTypes = [
    { type: "Employés", count: userTypesCount.find((t) => t.type === "employe")?._count.type || 0, percentage: Math.round(((userTypesCount.find((t) => t.type === "employe")?._count.type || 0) / totalUsers) * 100), color: "bg-blue-500" },
    { type: "Accompagnateurs", count: userTypesCount.find((t) => t.type === "accompanist")?._count.type || 0, percentage: Math.round(((userTypesCount.find((t) => t.type === "accompanist")?._count.type || 0) / totalUsers) * 100), color: "bg-green-500" },
    { type: "Formateurs", count: userTypesCount.find((t) => t.type === "trainer")?._count.type || 0, percentage: Math.round(((userTypesCount.find((t) => t.type === "trainer")?._count.type || 0) / totalUsers) * 100), color: "bg-purple-500" },
    { type: "Administrateurs", count: userTypesCount.find((t) => t.type === "admin")?._count.type || 0, percentage: Math.round(((userTypesCount.find((t) => t.type === "admin")?._count.type || 0) / totalUsers) * 100), color: "bg-orange-500" },
  ];

  const formattedUserStatus = {
    enabled: userStatusCount.find((s) => s.status === "enabled")?._count.status || 0,
    disabled: userStatusCount.find((s) => s.status === "disabled")?._count.status || 0,
  };

  return { projects: formattedProjects, recentProjects: formattedRecentProjects, userTypes: formattedUserTypes, userStatus: formattedUserStatus };
}

/* ---------------- GLOBAL ACTIVITIES ---------------- */
export async function getGlobalActivities() {
  try {
    const visitsCount = await db.visits.count();
    const meetingsCount = await db.rencontre.count();
    const conflictsCount = await db.conflit.count();
    const signaturesCount = await db.signature.count();

    const recentVisits = await db.visits.findMany({
      orderBy: { date: "desc" }, take: 2,
      select: { date: true, location: true, status: true, VisiteTerrain: { select: { observations: true } } },
    });

    const recentMeetings = await db.rencontre.findMany({
      orderBy: { date: "desc" }, take: 2,
      select: { date: true, lieu: true, decisions: true },
    });

    const recentConflicts = await db.conflit.findMany({
      orderBy: { createdAt: "desc" }, take: 2,
      select: { nature: true, resolution: true, status: true, createdAt: true, accompaniment: { select: { name: true } } },
    });

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const recentActivities = [
      ...recentVisits.map((v) => ({ type: "Visite" as const, location: v.location, date: formatDate(v.date), status: v.status ? "completed" : "pending", details: v.VisiteTerrain?.observations ?? "" })),
      ...recentMeetings.map((m) => ({ type: "Rencontre" as const, location: m.lieu, date: formatDate(m.date), status: m.decisions?.length ? "completed" : "scheduled", details: m.decisions?.join(", ") ?? "" })),
      ...recentConflicts.map((c) => ({ type: "Conflit" as const, location: c.accompaniment?.name ?? c.nature, date: formatDate(c.createdAt), status: c.status ? "resolved" : "pending", details: c.resolution ?? "" })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

    return { activities: { visits: visitsCount, meetings: meetingsCount, conflicts: conflictsCount, signatures: signaturesCount }, recentActivities };
  } catch (err) {
    console.error("Error fetching global dashboard data:", err);
    throw err;
  }
}
