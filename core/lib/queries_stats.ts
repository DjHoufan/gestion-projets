"use server";

import { db } from "@/core/lib/db";
import { startOfMonth, startOfYear, subMonths, subYears } from "date-fns";

/* ---------------- TYPES ---------------- */
type Project = {
  id: string;
  name: string;
  status: boolean;
  local: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
};

type Member = {
  id: string;
  projectId: string;
  gender: "male" | "female" | "other";
  createdAt: Date;
};

type Accompaniment = {
  id: string;
  name: string;
  status: boolean;
  budget?: number;
  createdAt: Date;
};

type Visit = {
  id: string;
  date: Date;
  location: string;
  status: boolean;
};

type Rencontre = {
  id: string;
  date: Date;
  lieu: string;
  decisions?: string[];
};

type Conflit = {
  id: string;
  createdAt: Date;
  nature: string;
  resolution?: string;
  status: boolean;
  accompanimentId?: string;
};

type User = {
  id: string;
  type: "employe" | "accompanist" | "trainer" | "admin";
  status: "enabled" | "disabled";
  createdAt: Date;
  gender: "male" | "female" | "other";
};

type Signature = {
  id: string;
  createdAt: Date;
};

/* ---------------- RAW DATA ---------------- */
interface RawData {
  projects: (Omit<Project, "createdAt" | "startDate" | "endDate"> & {
    createdAt: string;
    startDate: string;
    endDate: string;
  })[];
  members: (Omit<Member, "createdAt"> & { createdAt: string })[];
  accompaniments: (Omit<Accompaniment, "createdAt"> & { createdAt: string })[];
  visits: (Omit<Visit, "date"> & { date: string })[];
  users: (Omit<User, "createdAt"> & { createdAt: string })[];
  rencontres: (Omit<Rencontre, "date"> & { date: string })[];
  conflits: (Omit<Conflit, "createdAt"> & { createdAt: string })[];
  signatures: (Omit<Signature, "createdAt"> & { createdAt: string })[];
}

/* ---------------- INTERFACES ---------------- */
export interface PrimaryMetric {
  title: string;
  value: string;
  change: string;
}

export interface StatsData {
  users: {
    total: number;
    byGender: { name: string; value: number }[];
    growthData: number[];
  };
  projects: {
    total: number;
    active: number;
    inactive: number;
    monthlyProgress: { month: string; completed: number; active: number }[];
  };
  accompaniments: {
    total: number;
    active: number;
    completed: number;
    budget: number;
    avgBudget: number;
    monthlyData: number[];
  };
  activities: {
    visits: number;
    meetings: number;
    conflicts: number;
    resolvedConflicts: number;
    monthlyActivity: {
      month: string;
      visits: number;
      meetings: number;
      conflicts: number;
    }[];
  };
}

export interface ProjectUserDataProps {
  projects: {
    name: string;
    status: boolean;
    members: number;
    location: string;
    endDate: string;
  }[];
  recentProjects: {
    name: string;
    status: boolean;
    location: string;
    endDate: string;
  }[];
  userTypes: {
    type: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  userStatus: { enabled: number; disabled: number };
}

export interface GlobalActivitiesData {
  activities: {
    visits: number;
    meetings: number;
    conflicts: number;
    signatures: number;
  };
  recentActivities: {
    type: "Visite" | "Rencontre" | "Conflit";
    location: string;
    date: string;
    status: string;
    details: string;
  }[];
}

/* ---------------- HELPERS ---------------- */
function parseDates<T extends Record<string, any>, K extends keyof T>(
  arr: (Omit<T, K> & { [P in K]: string })[] | null | undefined,
  dateFields: K[]
): (Omit<T, K> & { [P in K]: Date })[] {
  if (!arr) return [];
  return arr.map((item) => {
    const copy: any = { ...item };
    for (const field of dateFields) {
      if (copy[field]) copy[field] = new Date(copy[field]);
    }
    return copy;
  });
}

const countThisYear = <T extends { createdAt?: Date; date?: Date }>(
  data: T[],
  field: "createdAt" | "date",
  startCurrentYear: Date
) =>
  data.filter((item) => (item[field] ?? new Date()) >= startCurrentYear).length;

const countLastYear = <T extends { createdAt?: Date; date?: Date }>(
  data: T[],
  field: "createdAt" | "date",
  startLastYear: Date,
  startCurrentYear: Date
) =>
  data.filter((item) => {
    const d = item[field] ?? new Date();
    return d >= startLastYear && d < startCurrentYear;
  }).length;

/* ---------------- MAIN FUNCTION ---------------- */
export async function getAllStatsData(year: number = new Date().getFullYear()) {
  const now = new Date();
 
  const startCurrentMonth = startOfMonth(now);
  const startLastMonth = startOfMonth(subMonths(now, 1));
  // ✅ SQL typé et sécurisé
  const result = await db.$queryRaw<{ data: RawData }[]>`
    select get_all_data() as data
  `;

  if (!result?.[0]?.data) {
    throw new Error("Aucune donnée trouvée depuis get_all_data()");
  }

  const raw = result[0].data;

  // ✅ Conversion des dates
  const allProjects = parseDates<
    Project,
    "createdAt" | "startDate" | "endDate"
  >(raw.projects, ["createdAt", "startDate", "endDate"]);
  const allMembers = parseDates<Member, "createdAt">(raw.members, [
    "createdAt",
  ]);
  const allAccompaniments = parseDates<Accompaniment, "createdAt">(
    raw.accompaniments,
    ["createdAt"]
  );
  const allVisits = parseDates<Visit, "date">(raw.visits, ["date"]);
  const allUsers = parseDates<User, "createdAt">(raw.users, ["createdAt"]);
  const allRencontres = parseDates<Rencontre, "date">(raw.rencontres, ["date"]);
  const allConflits = parseDates<Conflit, "createdAt">(raw.conflits, [
    "createdAt",
  ]);
  const allSignatures = parseDates<Signature, "createdAt">(raw.signatures, [
    "createdAt",
  ]);

  /* ---------------- PRIMARY METRICS ---------------- */
  const primaryMetrics: PrimaryMetric[] = [
    {
      title: "Project",
      value: countThisYear(
        allProjects,
        "createdAt",
        startCurrentMonth
      ).toString(),
      change: `${
        countThisYear(allProjects, "createdAt", startCurrentMonth) -
        countLastYear(
          allProjects,
          "createdAt",
          startLastMonth,
          startCurrentMonth
        )
      } vs le mois dernier`,
    },
    {
      title: "Member",
      value: countThisYear(
        allMembers,
        "createdAt",
        startCurrentMonth
      ).toString(),
      change: `${
        countThisYear(allMembers, "createdAt", startCurrentMonth) -
        countLastYear(
          allMembers,
          "createdAt",
          startLastMonth,
          startCurrentMonth
        )
      } vs le mois dernier`,
    },
    {
      title: "Accompaniment",
      value: countThisYear(
        allAccompaniments,
        "createdAt",
        startCurrentMonth
      ).toString(),
      change: `${
        countThisYear(allAccompaniments, "createdAt", startCurrentMonth) -
        countLastYear(
          allAccompaniments,
          "createdAt",
          startLastMonth,
          startCurrentMonth
        )
      } vs le mois dernier`,
    },
    {
      title: "Visits",
      value: countThisYear(allVisits, "date", startCurrentMonth).toString(),
      change: `${
        countThisYear(allVisits, "date", startCurrentMonth) -
        countLastYear(allVisits, "date", startLastMonth, startCurrentMonth)
      } vs le mois dernier`,
    },
  ];
  const months = Array.from({ length: 12 }).map((_, i) => ({
    month: new Date(year, i, 1).toLocaleString("fr-FR", { month: "short" }),
    index: i,
  }));

  // USERS
  const totalUsers = allMembers.length;
  const byGender = ["homme", "femme"].map((g) => ({
    name: g,
    value: allMembers.filter((m) => m.gender === g).length,
  }));

  let cumulative = 0;
  const growthData = months.map(({ index }) => {
    const count = allUsers.filter(
      (u) =>
        u.createdAt.getFullYear() === year && u.createdAt.getMonth() === index
    ).length;
    cumulative += count;
    return cumulative;
  });

  // PROJECTS
  const totalProjects = allProjects.length;
  const activeProjects = allProjects.filter((p) => p.status).length;
  const inactiveProjects = totalProjects - activeProjects;

  const monthlyProgress = months.map(({ month, index }) => ({
    month,
    completed: allProjects.filter(
      (p) =>
        !p.status &&
        p.endDate &&
        p.endDate.getFullYear() === year &&
        p.endDate.getMonth() === index
    ).length,
    active: allProjects.filter(
      (p) =>
        p.status &&
        p.createdAt &&
        p.createdAt.getFullYear() === year &&
        p.createdAt.getMonth() === index
    ).length,
  }));

  // ACCOMPANIMENTS
  const totalAcc = allAccompaniments.length;
  const activeAcc = allAccompaniments.filter((a) => a.status).length;
  const completedAcc = totalAcc - activeAcc;

  const budgetSum = allAccompaniments.reduce(
    (sum, a) => sum + (a.budget || 0),
    0
  );
  const avgBudget = totalAcc > 0 ? budgetSum / totalAcc : 0;

  const monthlyAccData = months.map(
    ({ index }) =>
      allAccompaniments.filter(
        (a) =>
          a.createdAt &&
          a.createdAt.getFullYear() === year &&
          a.createdAt.getMonth() === index
      ).length
  );

  // ACTIVITIES
  const visits = allVisits.length;
  const meetings = allRencontres.length;
  const conflicts = allConflits.length;
  const resolvedConflicts = allConflits.filter((c) => c.status).length;

  const monthlyActivity = months.map(({ month, index }) => ({
    month,
    visits: allVisits.filter(
      (v) =>
        v.date && v.date.getFullYear() === year && v.date.getMonth() === index
    ).length,
    meetings: allRencontres.filter(
      (r) =>
        r.date && r.date.getFullYear() === year && r.date.getMonth() === index
    ).length,
    conflicts: allConflits.filter(
      (c) =>
        c.createdAt &&
        c.createdAt.getFullYear() === year &&
        c.createdAt.getMonth() === index
    ).length,
  }));

  /* ---------------- STATS DATA ---------------- */
  const statsDatas: StatsData = {
    users: { total: totalUsers, byGender, growthData },
    projects: {
      total: totalProjects,
      active: activeProjects,
      inactive: inactiveProjects,
      monthlyProgress,
    },
    accompaniments: {
      total: totalAcc,
      active: activeAcc,
      completed: completedAcc,
      budget: budgetSum,
      avgBudget,
      monthlyData: monthlyAccData,
    },
    activities: {
      visits,
      meetings,
      conflicts,
      resolvedConflicts,
      monthlyActivity,
    },
  };

  /* ---------------- PROJECT USERS ---------------- */

  // 🔹 Projets formatés
  const formattedProjects = allProjects.map((p) => ({
    name: p.name,
    status: p.status,
    members: allMembers.filter((m) => m.projectId === p.id).length,
    location: p.local,
    endDate: p.endDate.toISOString().split("T")[0],
  }));

  // 🔹 Projets récents (par date de création)
  const recentProjects = [...allProjects]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      status: p.status,
      location: p.local,
      endDate: p.endDate.toISOString().split("T")[0],
    }));

  // 🔹 Comptage par type d’utilisateur
  const typeCounts = {
    employe: allUsers.filter((u) => u.type === "employe").length,
    accompanist: allUsers.filter((u) => u.type === "accompanist").length,
    trainer: allUsers.filter((u) => u.type === "trainer").length,
    admin: allUsers.filter((u) => u.type === "admin").length,
  };

  const totalUUSers =
    typeCounts.employe +
    typeCounts.accompanist +
    typeCounts.trainer +
    typeCounts.admin;

  const formattedUserTypes = [
    {
      type: "Employé(e)s",
      count: typeCounts.employe,
      percentage: totalUUSers
        ? Math.round((typeCounts.employe / totalUUSers) * 100)
        : 0,
      color: "bg-blue-500",
    },
    {
      type: "Accompagnateur(trice)s",
      count: typeCounts.accompanist,
      percentage: totalUUSers
        ? Math.round((typeCounts.accompanist / totalUUSers) * 100)
        : 0,
      color: "bg-green-500",
    },
    {
      type: "Formateur(trice)s",
      count: typeCounts.trainer,
      percentage: totalUUSers
        ? Math.round((typeCounts.trainer / totalUUSers) * 100)
        : 0,
      color: "bg-purple-500",
    },
    {
      type: "Administrateurs",
      count: typeCounts.admin,
      percentage: totalUUSers
        ? Math.round((typeCounts.admin / totalUUSers) * 100)
        : 0,
      color: "bg-orange-500",
    },
  ];

  // 🔹 Comptage par statut
  const formattedUserStatus = {
    enabled: allUsers.filter((u) => u.status === "enabled").length,
    disabled: allUsers.filter((u) => u.status === "disabled").length,
  };

  const projectUsers: ProjectUserDataProps = {
    projects: formattedProjects,
    recentProjects,
    userTypes: formattedUserTypes,
    userStatus: formattedUserStatus,
  };

  /* ---------------- GLOBAL ACTIVITIES ---------------- */
  const globalActivities: GlobalActivitiesData = {
    activities: {
      visits: allVisits.length,
      meetings: allRencontres.length,
      conflicts: allConflits.length,
      signatures: allSignatures.length,
    },
    recentActivities: [
      ...allVisits.slice(-5).map((v) => ({
        type: "Visite" as const,
        location: v.location,
        date: v.date.toISOString(),
        status: v.status ? "Terminée" : "En attente",
        details: "",
      })),
      ...allRencontres.slice(-5).map((r) => ({
        type: "Rencontre" as const,
        location: r.lieu,
        date: r.date.toISOString(),
        status: "Terminée",
        details: r.decisions?.join(", ") || "",
      })),
      ...allConflits.slice(-5).map((c) => ({
        type: "Conflit" as const,
        location: c.accompanimentId || "N/A",
        date: c.createdAt.toISOString(),
        status: c.status ? "Résolu" : "En cours",
        details: c.nature,
      })),
    ],
  };

  return { primaryMetrics, statsDatas, projectUsers, globalActivities };
}
