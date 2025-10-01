"use client";

import type React from "react";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  Pencil,
  Trash,
  MoreHorizontal,
  NotepadText,
  NotepadTextDashed,
  LucideProps,
} from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/core/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { Spinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/global/custom-toast";
type IconType = React.ComponentType<LucideProps>;

interface FilterOption {
  label: string;
  icon: IconType;
  field: string;
  type: "select";
  options?: string[];
}

interface DataTableProps<T> {
  data: T[];
  columns: any[];
  searchPlaceholder?: string;
  searchField?: string;
  additionalSearchFields?: string[];
  pageSize?: number;
  isPending?: boolean;
  title?: string;
  description?: string;
  color?: string;
  canAdd?: boolean;
  addButtonText?: string;
  onAddButtonClick?: () => void;
  exportFunction?: (data: T[]) => Promise<boolean>;
  header?: boolean;
  filters?: FilterOption[];
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = "Rechercher...",
  searchField = "name",
  additionalSearchFields = [],
  pageSize = 10,
  isPending = false,
  title,
  description,
  color = "bg-primary",
  canAdd = true,
  addButtonText = "Ajouter",
  onAddButtonClick,
  exportFunction,
  header = true,
  filters,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isExporting, setIsExporting] = useState(false);
  const [pageSizeState, setPageSizeState] = useState(pageSize);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  const getNestedValues = (obj: any, path: string): string[] => {
    const parts = path.split(".");
    const key = parts[0];
    if (!obj || !key) return [];
    const value = obj[key];
    if (Array.isArray(value)) {
      const subPath = parts.slice(1).join(".");
      return value.flatMap((v) => getNestedValues(v, subPath));
    } else if (parts.length > 1) {
      return getNestedValues(value, parts.slice(1).join("."));
    } else {
      return [value];
    }
  };

  const filterOptionsMap = useMemo(() => {
    if (!filters) return {};
    const map: Record<string, string[]> = {};
    filters.forEach((f) => {
      if (f.type === "select") {
        if (f.options?.length) {
          map[f.field] = f.options;
        } else {
          map[f.field] = Array.from(
            new Set(
              data
                .flatMap((item: any) => getNestedValues(item, f.field))
                .filter(Boolean)
            )
          );
        }
      }
    });
    return map;
  }, [filters, data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filtres dynamiques
      if (filters) {
        for (const f of filters) {
          const val = activeFilters[f.field];
          if (val) {
            const values = getNestedValues(item, f.field);
            if (
              !values.some((v) => String(v).toLowerCase() === val.toLowerCase())
            ) {
              return false;
            }
          }
        }
      }

      // Recherche texte
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();

      // Vérifie sur le champ principal
      const mainFieldValues = getNestedValues(item, searchField);
      if (
        mainFieldValues.some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(searchLower)
        )
      ) {
        return true;
      }

      // Vérifie sur les champs additionnels
      return additionalSearchFields.some((field) => {
        const values = getNestedValues(item, field);
        return values.some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(searchLower)
        );
      });
    });
  }, [
    data,
    searchQuery,
    searchField,
    additionalSearchFields,
    filters,
    activeFilters,
  ]);

  // Trier les données
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortField];
      const bValue = (b as any)[sortField];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSizeState);
  const paginatedData = sortedData.slice(
    currentPage * pageSizeState,
    (currentPage + 1) * pageSizeState
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Fonction pour exporter les données en Excel
  const handleExportToExcel = async () => {
    if (!exportFunction) {
      alert(
        "La fonction d'exportation n'a pas été configurée pour ce tableau."
      );
      return;
    }

    try {
      setIsExporting(true);

      const success = await exportFunction(filteredData);

      if (success) {
        toast.success({
          message: "Le fichier Excel a été téléchargé avec succès.",
        });
      } else {
        throw new Error("Échec de l'exportation");
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      toast.error({
        message: "Une erreur s'est produite lors de l'exportation des données.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto ">
      <Card className="mb-6 border-none shadow-none py-0">
        {header ? (
          <div className="flex justify-between items-center p-5 ">
            {title && title.length > 0 && (
              <CardHeader className="pb-2 w-full">
                <CardTitle className="text-xl font-semibold text-primary-800">
                  Liste des {title.toLowerCase()}
                </CardTitle>
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </CardHeader>
            )}

            <div className="w-full flex pr-4 justify-end">
              {onAddButtonClick && canAdd && (
                <Button
                  className="hover:cursor-pointer"
                  onClick={onAddButtonClick}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {addButtonText}
                </Button>
              )}
            </div>
          </div>
        ) : null}

        <CardContent className="pt-4">
          <div className="flex flex-col    gap-4 mb-4">
            <div className="flex flex-wrap gap-2  items-end">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="pl-8 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchQuery("")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              {exportFunction && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExportToExcel}
                  disabled={isExporting || filteredData.length === 0}
                  className="text-secondary-700 hover:bg-secondary-50 hover:text-secondary-800"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
              )}
              {filters?.map((f, index) => (
                <div key={index} className="flex flex-col justify-center gap-1">
                  <label className="text-sm flex items-center gap-3">
                    <f.icon className="text-primary" size={15} />
                    {f.label}
                  </label>
                  <Select
                    key={f.field}
                    value={activeFilters[f.field] || "all"}
                    onValueChange={(val) =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        [f.field]: val === "all" ? "" : val,
                      }))
                    }
                  >
                    <SelectTrigger className="h-10 w-[200px]">
                      <SelectValue placeholder={f.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {filterOptionsMap[f.field]?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border">
            <Table className="rounded-md">
              <TableHeader className={`rounded-md  ${color} `}>
                <TableRow className={`rounded-md text-white  hover:${color}`}>
                  {columns.map((column, index) => (
                    <TableHead
                      key={column.id || index}
                      className={`text-white font-semibold ${
                        index === 0 ? "rounded-tl-md" : ""
                      } ${index === columns.length - 1 ? "rounded-tr-md" : ""}`}
                    >
                      {column.sortable ? (
                        <Button
                          variant="ghost"
                          onClick={() => handleSort(column.accessorKey)}
                          className="hover:bg-primary hover:cursor-pointer hover:text-white h-8 text-white"
                        >
                          {column.header}
                          {getSortIcon(column.accessorKey)}
                        </Button>
                      ) : (
                        column.header
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="w-full flex justify-center items-center">
                        <Spinner
                          variant="bars"
                          size={20}
                          className="text-primary"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length ? (
                  paginatedData.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column, index) => (
                        <TableCell key={column.id || index}>
                          {column.cell
                            ? column.cell({ row: { original: row } })
                            : (row as any)[column.accessorKey]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Aucun résultat trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div>
                {sortedData.length} résultat{sortedData.length > 1 ? "s" : ""}
              </div>
              <div>
                <Select
                  value={`${pageSizeState}`}
                  onValueChange={(val) => {
                    setPageSizeState(Number(val));
                    setCurrentPage(0); // reset à la première page
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pageSizeState} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>par page</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 text-sm font-medium">
                Page {currentPage + 1} sur {totalPages || 1}
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Fonction utilitaire pour créer des colonnes d'actions
export function createActionsColumn<TData>(
  actions: Array<{
    label: string;
    onClick: (data: TData) => void;
    icon?: React.ReactNode;
    variant?: "default" | "destructive";
  }>
) {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      const data = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(data)}
                  className={`cursor-pointer ${
                    action.variant === "destructive"
                      ? "text-destructive focus:text-destructive"
                      : ""
                  }`}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };
}

// Fonction utilitaire pour créer des actions standard (voir, modifier, supprimer)
export function createStandardActions<T>(
  canDelete: boolean,
  canEdit: boolean,
  onView?: (item: T) => void,
  onEdit?: (item: T) => void,
  onDelete?: (item: T) => void,
  onDetail?: (item: T) => void,
  onVolume?: (item: T) => void
) {
  const actions = [];

  if (onView) {
    actions.push({
      label: "Voir",
      onClick: onView ?? (() => {}),
      icon: <Eye className="h-4 w-4" />,
    });
  }

  if (onVolume) {
    actions.push({
      label: "Volume",
      onClick: onVolume ?? (() => {}),
      icon: <NotepadTextDashed className="h-4 w-4" />,
    });
  }

  if (onDetail) {
    actions.push({
      label: "détails",
      onClick: onDetail ?? (() => {}),
      icon: <NotepadText className="h-4 w-4" />,
    });
  }

  if (onEdit && canEdit) {
    actions.push({
      label: "Modifier",
      onClick: onEdit ?? (() => {}),
      icon: <Pencil className="h-4 w-4" />,
    });
  }

  if (onDelete && canDelete) {
    actions.push({
      label: "Supprimer",
      onClick: onDelete ?? (() => {}),
      icon: <Trash className="h-4 w-4" />,
      variant: "destructive" as const,
    });
  }

  return createActionsColumn<T>(actions);
}

// Fonction utilitaire pour créer une fonction d'exportation Excel générique
export function createExcelExporter<T>(
  headers: Record<string, string>,
  mapFunction: (item: T) => Record<string, any>,
  fileName: string,
  sheetName: string
) {
  return async (data: T[]) => {
    // Simulation d'exportation Excel
    const exportData = data.map(mapFunction);

    // Créer un CSV simple pour la démonstration
    const csvHeaders = Object.values(headers).join(",");
    const csvRows = exportData.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(",")
    );
    const csvContent = [csvHeaders, ...csvRows].join("\n");

    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${fileName}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  };
}
