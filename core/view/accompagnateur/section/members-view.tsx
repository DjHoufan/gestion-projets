import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Search,
} from "lucide-react";

import { useMyData } from "@/core/hooks/store";

export function MembersView() {
  const { data: user } = useMyData();

  if (!user) {
    return <div>Chargement...</div>;
  }

  // Collect all members from all accompaniments
  const allMembers = user.accompaniments.flatMap((acc: any) =>
    acc.members.map((member: any) => ({
      ...member,
      accompanimentName: acc.name,
    }))
  );

  return (
    <section className="space-y-6 p-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Rechercher un membre..." className="pl-10" />
            </div>
            <Button variant="outline">Filtrer</Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allMembers.map((member: any) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={member.profile || "/placeholder.svg"}
                    alt={member.name}
                  />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {member.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {member.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 text-xs"
                  >
                    {member.accompanimentName}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{member.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {new Date(member.dob).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{member.formation}</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-xs text-gray-500 mb-2">
                  Centre: {member.center}
                </div>
                <div className="text-xs text-gray-400">
                  Membre depuis:{" "}
                  {new Date(member.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  Voir Profil
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  Contacter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques des Membres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {allMembers.length}
              </div>
              <div className="text-sm text-gray-500">Total Membres</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {allMembers.filter((m: any) => m.gender === "homme").length}
              </div>
              <div className="text-sm text-gray-500">Hommes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {allMembers.filter((m: any) => m.gender === "femme").length}
              </div>
              <div className="text-sm text-gray-500">Femmes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(allMembers.map((m: any) => m.center)).size}
              </div>
              <div className="text-sm text-gray-500">Centres</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
