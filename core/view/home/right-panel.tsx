"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Avatar, AvatarFallback } from "@/core/components/ui/avatar";
import {
  Clock,
  Calendar,
  Users,
  MessageSquare,
  Plus,
  ArrowRight,
  Activity,
  Zap,
} from "lucide-react";

const todaySessions = [
  {
    id: 1,
    title: "Formation Leadership",
    time: "14:00 - 16:00",
    participants: 12,
    instructor: "Marie Dubois",
    status: "Bientôt",
    color: "bg-teal-500",
  },
  {
    id: 2,
    title: "Data Science Workshop",
    time: "16:30 - 18:00",
    participants: 8,
    instructor: "Jean Martin",
    status: "Préparation",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Gestion Agile",
    time: "18:00 - 19:30",
    participants: 15,
    instructor: "Sophie Laurent",
    status: "Confirmé",
    color: "bg-green-500",
  },
];

const quickActions = [
  { title: "Nouveau Projet", icon: Plus, color: "bg-teal-500" },
  { title: "Inviter Participant", icon: Users, color: "bg-blue-500" },
  { title: "Planifier Session", icon: Calendar, color: "bg-green-500" },
  { title: "Générer Rapport", icon: MessageSquare, color: "bg-orange-500" },
];

const recentActivity = [
  {
    user: "Marie Dubois",
    action: "a terminé",
    target: "Module Leadership",
    time: "2 min",
    avatar: "MD",
  },
  {
    user: "Alex Martin",
    action: "s'est inscrit à",
    target: "Formation React",
    time: "5 min",
    avatar: "AM",
  },
  {
    user: "Sophie Laurent",
    action: "a créé",
    target: "Quiz JavaScript",
    time: "12 min",
    avatar: "SL",
  },
];

const liveStats = [
  { label: "Utilisateurs actifs", value: "23", color: "text-green-600" },
  { label: "Sessions en cours", value: "3", color: "text-blue-600" },
  { label: "Engagement", value: "94%", color: "text-purple-600" },
];

export const RightPanel = () => {
  return (
    <div className="space-y-6">
      {/* Stats en temps réel */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-teal-500" />
            Temps Réel
            <Badge className="ml-auto bg-green-100 text-green-700 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {liveStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className={`font-bold text-lg ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sessions du jour */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-teal-500" />
            Sessions Aujourd'hui
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaySessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${session.color}`} />
                  <h4 className="font-medium text-sm">{session.title}</h4>
                </div>
                <Badge variant="outline" className="text-xs">
                  {session.status}
                </Badge>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{session.participants} participants</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Formateur: {session.instructor}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-teal-500" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className="w-full justify-start gap-3 h-auto p-3 hover:bg-gray-50"
            >
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="h-3 w-3" />
              </div>
              <span className="text-sm">{action.title}</span>
              <ArrowRight className="h-3 w-3 ml-auto" />
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-teal-500" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                  {activity.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600">
                  <span className="font-medium text-gray-900">
                    {activity.user}
                  </span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
