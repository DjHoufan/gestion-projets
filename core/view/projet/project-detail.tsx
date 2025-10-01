"use client";

import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Users,
  Plus,
  Download,
  Search,
  MoreHorizontal,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Building,
  Briefcase,
  Ban,
  IdCardLanyard,
  UserX,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent } from "@/core/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Progress } from "@/core/components/ui/progress";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import {
  calculateProgress,
  formatCurrency,
  formatDate,
  getRemainingDays,
} from "@/core/lib/utils";
import { useGetOneProjet } from "@/core/hooks/use-projet";
import {
  IdType,
  MemberDetail,
  MemberDetailWP,
  UserDetail,
} from "@/core/lib/types";
import { Spinner } from "@/core/components/ui/spinner";
import { useModal } from "@/core/providers/modal-provider";
import CustomModal from "@/core/components/wrappeds/custom-modal";
import LeaveForm from "@/core/view/leave/leave-form";
import { DataTable } from "@/core/components/global/data-table";
import { format } from "date-fns";

type oneUserDetail = Omit<UserDetail, "cv"> & {
  groupName: string;
};

export const ProjectDetail = ({ Id }: IdType) => {
  const { open } = useModal();
  const { data: projectData, isPending } = useGetOneProjet(Id);

  const [searchTerm, setSearchTerm] = useState("");
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [currentPageGroups, setCurrentPageGroups] = useState(1);
  const itemsPerPageGroups = 6;

  const { allMembers, allMembersLeave, allMembersWithoutLeave } =
    useMemo(() => {
      // Early return si pas de données
      if (!projectData) {
        return {
          allMembers: [],
          allMembersLeave: [],
          allMembersWithoutLeave: [],
        };
      }

      const allMembers: MemberDetailWP[] = [];
      const allMembersLeave: MemberDetailWP[] = [];
      const allMembersWithoutLeave: MemberDetailWP[] = [];

      // Une seule boucle pour traiter tous les accompaniments
      projectData.members.forEach((member) => {
        allMembers.push(member);
        if (member.leave === null) {
          allMembersWithoutLeave.push(member);
        } else {
          allMembersLeave.push(member);
        }
      });

      return {
        allMembers,
        allMembersLeave,
        allMembersWithoutLeave,
      };
    }, [projectData]);

  const { allAccompanists } = useMemo(() => {
    // Early return si pas de données
    if (!projectData?.accompaniments?.length) {
      return {
        allAccompanists: [],
      };
    }

    const allAccompanists: oneUserDetail[] = [];

    // Une seule boucle pour traiter tous les accompaniments
    projectData.accompaniments.forEach((acc) => {
      // Traitement des accompagnateurs
      if (acc.users) {
        allAccompanists.push({
          ...acc.users,
          groupName: acc.name,
        });
      }
    });

    return {
      allAccompanists,
    };
  }, [projectData?.accompaniments]);

  const { filteredAccompanists } = useMemo(() => {
    const accompanists = allAccompanists.filter(
      (accompanist) =>
        accompanist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accompanist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accompanist.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      filteredAccompanists: accompanists,
    };
  }, [allAccompanists, searchTerm]);

  const filteredGroups = useMemo(() => {
    if (!projectData?.accompaniments || !groupSearchTerm) {
      return projectData?.accompaniments || [];
    }

    return projectData.accompaniments.filter(
      (group) =>
        group.name?.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
        group.adresse?.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
        group.users?.name?.toLowerCase().includes(groupSearchTerm.toLowerCase())
    );
  }, [projectData, groupSearchTerm]);

  const indexOfLastGroup = currentPageGroups * itemsPerPageGroups;
  const indexOfFirstGroup = indexOfLastGroup - itemsPerPageGroups;
  const currentGroups = filteredGroups.slice(
    indexOfFirstGroup,
    indexOfLastGroup
  );
  const totalPagesGroups = Math.ceil(
    filteredGroups.length / itemsPerPageGroups
  );

  const handlePageChangeGroups = (pageNumber: number) => {
    setCurrentPageGroups(pageNumber);
  };

  const { progress, remainingDays } = useMemo(() => {
    if (!projectData) {
      return { progress: 1, remainingDays: 0 };
    }

    return {
      progress:
        calculateProgress(projectData.startDate, projectData.endDate) || 1,
      remainingDays:
        getRemainingDays(projectData.startDate, projectData.endDate) || 1,
    };
  }, [projectData?.startDate, projectData?.endDate]);

  const columns = [
    {
      id: "user",
      header: "Bénéficiaire",
      cell: ({ row }: any) => {
        const user = row.original;
        const gender = row.original.gender.toLowerCase();
        const genderMap = {
          homme: {
            label: "Homme",
            class: "bg-blue-100 text-blue-800 border-blue-200",
          },
          femme: {
            label: "Femme",
            class: "bg-pink-100 text-pink-800 border-pink-200",
          },
        };
        const genderConfig = genderMap[gender as keyof typeof genderMap] || {
          label: row.original.gender,
          class: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return (
          <div className="flex items-center gap-3 ">
            <Avatar className="h-8 w-8 border border-primary-200">
              <AvatarImage src={user.profile || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1  w-full">
              <span className="font-medium text-primary-900">{user.name}</span>
              <div className="flex justify-between items-center gap-5 w-full">
                <span className="text-xs text-primary-600">{user.phone}</span>
                <Badge
                  variant="outline"
                  className={`${genderConfig.class} font-medium capitalize`}
                >
                  {genderConfig.label}
                </Badge>
              </div>
            </div>
          </div>
        );
      },
      size: 250,
    },

    {
      id: "address",
      header: "Adresse",
      cell: ({ row }: any) => {
        const { commune, residential } = row.original;
        return (
          <div className="flex flex-col w-36">
            <span className="font-medium whitespace-pre-wrap">
              {residential}
            </span>
            <span className="text-xs text-gray-600 whitespace-pre-wrap">
              {commune}
            </span>
          </div>
        );
      },
      size: 100,
    },

    {
      id: "dob",
      header: "Date de naissance",
      cell: ({ row }: any) => {
        const dob = new Date(row.original.dob);
        return <span>{format(dob, "dd/MM/yyyy")}</span>;
      },
      size: 150,
    },
    {
      id: "language",
      header: "Langue",
      cell: ({ row }: any) => {
        const languages = row.original.language;
        if (languages === "N/A" || !languages) {
          return <span className="text-gray-400">Non spécifié</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {languages.split(", ").map((lang: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {lang.trim()}
              </Badge>
            ))}
          </div>
        );
      },
      size: 150,
    },
    {
      id: "attestation",
      header: "Attestation",
      cell: ({ row }: any) => {
        const attestation = row.original.attestation;
        if (attestation === "N/A" || !attestation) {
          return <span className="text-gray-400">Aucune</span>;
        }
        return (
          <span className="text-sm" title={attestation}>
            {attestation.length > 30
              ? `${attestation.substring(0, 30)}...`
              : attestation}
          </span>
        );
      },
      size: 200,
    },

    {
      id: "disability",
      header: "Handicap",
      cell: ({ row }: any) => {
        const disability = row.original.disability;
        const isDisabled = disability !== "Pas de Handicap";
        return (
          <Badge
            variant={isDisabled ? "destructive" : "outline"}
            className="text-xs"
          >
            {disability}
          </Badge>
        );
      },
      size: 130,
    },
    {
      id: "statut",
      header: "Statut",
      cell: ({ row }: any) => {
        const leave = row.original.leave;
        const gender = row.original.gender;
        return (
          <span
            className={`flex items-center gap-2 px-3 py-1.5 justify-center  rounded-full text-sm font-medium ${
              leave
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {leave ? (
              <UserX className="w-4 h-4" />
            ) : (
              <UserCheck className="w-4 h-4" />
            )}
            {leave ? `Abandonné${gender === "Femme" ? "e" : ""}` : "Actif"}
          </span>
        );
      },
    },
  ];

  const [single, multiple] = useMemo(() => {
    const accompaniments = projectData?.accompaniments ?? [];

    const single = accompaniments.filter((a) => a.members?.length === 1);
    const multiple = accompaniments.filter((a) => (a.members?.length ?? 0) > 1);

    return [single, multiple];
  }, [projectData?.accompaniments]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 rounded-2xl shadow-lg border border-gray-200 p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {projectData ? (
                      projectData.name
                    ) : (
                      <Spinner variant="ellipsis" />
                    )}
                  </h1>
                  <p className="text-blue-200">Projet d'accompagnement</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {projectData ? (
                <Badge
                  variant={projectData.status ? "default" : "secondary"}
                  className={`px-4 py-2 text-sm ${
                    projectData.status
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                  }`}
                >
                  {projectData.status ? "Actif" : "En cours"}
                </Badge>
              ) : (
                <Spinner variant="ellipsis" />
              )}
              <Button
                onClick={() =>
                  open(
                    <CustomModal>
                      <LeaveForm
                        projectId={Id}
                        cmembers={allMembersWithoutLeave!}
                      />
                    </CustomModal>
                  )
                }
                variant="outline"
                size="sm"
                className="border-white/30 text-white   bg-transparent cursor-pointer"
              >
                <Ban className="h-4 w-4 mr-2" />
                Enregistre un abandon
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <Building className="h-8 w-8 text-emerald-100" />
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {projectData ? (
                      projectData.accompaniments.length
                    ) : (
                      <Spinner variant="ellipsis" />
                    )}
                  </span>
                  <div className="text-sm flex gap-5">
                    <span>{multiple.length} groupe</span>
                    <span>{single.length} individuel</span>
                  </div>
                </div>
              </div>
              <p className="text-emerald-100 font-medium text-sm">AGR</p>
              <p className="text-xs text-emerald-200 mt-1">
                agr actifs
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <IdCardLanyard className="h-8 w-8 text-emerald-100" />
                <span className="text-2xl font-bold">
                  {projectData ? (
                   33
                  ) : (
                    <Spinner variant="ellipsis" />
                  )}
                </span>
              </div>
              <p className="text-emerald-100 font-medium text-sm">
                Accompagnateur
              </p>
              <p className="text-xs text-emerald-200 mt-1">
                Accompagnateur actifs
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <Users className="h-8 w-8 text-purple-100" />
                <span className="text-2xl font-bold">{allMembers.length}</span>
              </div>
              <p className="text-purple-100 font-medium text-sm">Bénéficiaires</p>
              <p className="text-xs text-purple-200 mt-1">
                Participants totaux
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <Ban className="h-8 w-8 text-purple-100" />
                <span className="text-2xl font-bold">
                  {allMembersLeave.length}
                </span>
              </div>
              <p className="text-purple-100 font-medium text-sm">Abandons</p>
              <p className="text-xs text-purple-200 mt-1">
                Participants totaux
              </p>
            </div>

            <div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <Calendar className="h-8 w-8 text-blue-100" />
                  <span className="text-2xl font-bold">{remainingDays}</span>
                </div>
                <p className="text-blue-100 font-medium text-sm">
                  Jours restants
                </p>
                <p className="text-xs text-blue-200 mt-1">
                  Du{" "}
                  {projectData ? (
                    <>
                      {formatDate(projectData.startDate)} au{" "}
                      {formatDate(projectData.endDate)}
                    </>
                  ) : (
                    <Spinner variant="ellipsis" />
                  )}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600   rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="h-8 w-8 text-orange-100" />
                <span className="text-2xl font-bold">{progress}%</span>
              </div>
              <p className="text-orange-100 font-medium text-sm">Progression</p>
              <Progress
                indicatorClassName="!bg-orange-900"
                value={progress}
                className="mt-2 h-2   !bg-white "
              />
            </div>
          </div>
        </div>

        {/* Groups Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Groupes d'accompagnement
                </h2>
                <p className="text-gray-500">
                  {filteredGroups.length} groupe(s) disponible(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un groupe..."
                    value={groupSearchTerm}
                    onChange={(e) => setGroupSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {projectData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentGroups.map((group, index) => {
                  const colorClasses = [
                    "border-l-4 border-l-blue-500 hover:shadow-blue-100",
                    "border-l-4 border-l-emerald-500 hover:shadow-emerald-100",
                    "border-l-4 border-l-purple-500 hover:shadow-purple-100",
                    "border-l-4 border-l-orange-500 hover:shadow-orange-100",
                    "border-l-4 border-l-pink-500 hover:shadow-pink-100",
                    "border-l-4 border-l-indigo-500 hover:shadow-indigo-100",
                  ];
                  const avatarColors = [
                    "bg-gradient-to-r from-blue-500 to-blue-600",
                    "bg-gradient-to-r from-emerald-500 to-emerald-600",
                    "bg-gradient-to-r from-purple-500 to-purple-600",
                    "bg-gradient-to-r from-orange-500 to-orange-600",
                    "bg-gradient-to-r from-pink-500 to-pink-600",
                    "bg-gradient-to-r from-indigo-500 to-indigo-600",
                  ];

                  return (
                    <Card
                      key={group.id}
                      className={`hover:shadow-lg transition-all duration-200 border-gray-200 ${
                        colorClasses[index % colorClasses.length]
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={group.users?.profile || "/placeholder.svg"}
                              />
                              <AvatarFallback
                                className={`${
                                  avatarColors[index % avatarColors.length]
                                } text-white font-semibold`}
                              >
                                {group.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {group.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {group.users?.name}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span>{group.adresse}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span>{group.members.length} membre(s)</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(group.budget)}
                            </span>
                            <Badge
                              variant={group.status ? "default" : "secondary"}
                              className={`text-xs ${
                                group.status
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              {group.status ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="w-full  flex justify-center items-center">
                <Spinner variant="bars" className="text-primary" size={50} />
              </div>
            )}

            {/* Pagination */}
            {totalPagesGroups > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChangeGroups(currentPageGroups - 1)}
                  disabled={currentPageGroups === 1}
                >
                  Précédent
                </Button>
                {Array.from({ length: totalPagesGroups }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={
                      currentPageGroups === i + 1 ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChangeGroups(i + 1)}
                    className={
                      currentPageGroups === i + 1
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChangeGroups(currentPageGroups + 1)}
                  disabled={currentPageGroups === totalPagesGroups}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Members Table */}

        <DataTable<MemberDetailWP>
          header={false}
          data={allMembers ? allMembers : []}
          columns={columns}
          searchPlaceholder="Rechercher par nom ou date..."
          searchField="name"
          additionalSearchFields={["phone", "email", "status"]}
          canAdd={false}
          pageSize={10}
          addButtonText="Enregistre un nouveau bénéficiaires"
          isPending={isPending}
        />

        {/* Accompanists Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Accompagnateurs
                </h2>
                <p className="text-gray-500">
                  {searchTerm
                    ? `${filteredAccompanists.length} accompagnateur(s) trouvé(s)`
                    : `${allAccompanists.length} accompagnateurs au total`}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {projectData ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">
                      Accompagnateur
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Contact
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Groupe
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Genre
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(searchTerm ? filteredAccompanists : allAccompanists).map(
                    (accompanist, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={accompanist.profile || "/placeholder.svg"}
                              />
                              <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold">
                                {accompanist.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {accompanist.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {accompanist.address}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600 truncate max-w-[180px]">
                                {accompanist.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">
                                {accompanist.phone}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-700">
                            {accompanist.groupName}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {accompanist.gender}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir profil
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="w-full  flex justify-center items-center">
                <Spinner variant="bars" className="text-primary" size={50} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
