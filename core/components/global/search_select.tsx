"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  LucideProps,
  ScanSearch,
  Search,
} from "lucide-react";

import { cn } from "@/core/lib/utils";
import { Button } from "@/core/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/core/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Spinner } from "@/core/components/ui/spinner";
import { memoizeComponent, useOptimizedCallback } from "@/core/lib/component-optimization";

type IconType = React.ComponentType<LucideProps>;

interface BaseItem {
  id: string;
  name: string;
}

interface SearchProps<T extends BaseItem>
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  loading?: boolean;
  disabled?: boolean;
  items: T[];
  selectedId?: string;
  Icon: IconType;
  onChangeValue: (value: string) => void;
}

// ✅ Composant optimisé avec React.memo
const SearchSelectComponent = <T extends BaseItem>({
  className,
  Icon,
  items = [],
  onChangeValue,
  selectedId,
  disabled = false,
  loading = false,
}: SearchProps<T>) => {
  const [open, setOpen] = React.useState(false);

  // ✅ Optimisation du calcul du selectedItem
  const selectedItem = React.useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId]
  );

  // ✅ Optimisation des event handlers
  const handleSelect = useOptimizedCallback((itemId: string) => {
    onChangeValue(itemId);
    setOpen(false);
  }, [onChangeValue]);

  const handleOpenChange = useOptimizedCallback((isOpen: boolean) => {
    setOpen(isOpen);
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an item"
          disabled={disabled}
          className={cn(
            "w-full justify-between whitespace-break-spaces",
            disabled && "bg-gray-100 cursor-not-allowed",
            className
          )}
        >
          <Icon className="mr-2 h-4 w-4 text-primary" />
          {loading ? (
            <Spinner variant="ellipsis" />
          ) : (
            <span>{selectedItem?.name}</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0 w-full")}
        align="start"
        sideOffset={4}
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command className="w-full">
          <CommandList className="w-full">
            <CommandInput placeholder="Fait votre recherche..." />
            {loading ? (
              <div className="flex justify-center items-center h-10">
                <Spinner variant="bars" className="text-primary" size={15} />
              </div>
            ) : (
              <CommandEmpty>Aucune donnée trouvée.</CommandEmpty>
            )}
            <CommandGroup className="w-full">
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item.id)}
                  className="text-sm"
                >
                  <ScanSearch className="mr-2 h-4 w-4" />
                  {item.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedItem?.id === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// ✅ Export du composant mémorisé
export default memoizeComponent(SearchSelectComponent, (prevProps, nextProps) => {
  // ✅ Comparaison personnalisée pour éviter les re-renders inutiles
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.selectedId === nextProps.selectedId &&
    prevProps.items === nextProps.items &&
    prevProps.onChangeValue === nextProps.onChangeValue &&
    prevProps.Icon === nextProps.Icon
  );
});
