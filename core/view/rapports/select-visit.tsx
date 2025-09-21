"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useGetPlanning } from "@/core/hooks/use-planning";
import { Spinner } from "@/core/components/ui/spinner";

type Props = {
  disabled: boolean;
  id: string;
  onChangeValueAction: (value: string) => void;
};

export const SelectVisit = ({ disabled, id, onChangeValueAction }: Props) => {
  const { data, isPending } = useGetPlanning();
  const [selectedTourId, setSelectedTourId] = useState(id);

 
  const allTours = (data ?? [])
    .flatMap((planning) =>
      planning.visit.map((visit) => ({
        ...visit,
        accompanimentName:
          planning.accompaniments.length > 0
            ? planning.accompaniments[0].name
            : "Aucun accompagnement",
      }))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSelectChange = (value: string) => {
    setSelectedTourId(value);
    onChangeValueAction(value);
  };

  return (
    <div className="relative  ">
      <Select
        disabled={disabled}
        onValueChange={handleSelectChange}
        value={selectedTourId}
      >
        <SelectTrigger className="w-full !h-14 border-2  border-orange-100 rounded-lg bg-white  transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
          <SelectValue
            placeholder="Sélectionner un créneau"
            className="text-gray-500"
          />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-none shadow-2xl bg-white">
          {isPending ? (
            <SelectItem
              key="loading"
              value="laoding"
              className="w-full flex justify-center items-center h-10"
            >
              <Spinner variant="bars" className="text-primary " />
            </SelectItem>
          ) : (
            allTours.map((tour) => (
              <SelectItem
                key={tour.id}
                value={tour.id}
                className="rounded-md m-1 hover:bg-teal-50 transition-colors duration-150 py-3 w-full "
              >
                <div className="flex items-center justify-between w-[450px]  ">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center bg-teal-100 rounded-md p-1.5 w-10">
                      <span className="text-xs font-bold text-teal-800">
                        {new Date(tour.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                        })}
                      </span>
                      <span className="text-[10px] text-teal-600">
                        {new Date(tour.date).toLocaleDateString("fr-FR", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {tour.location}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tour.startTime} - {tour.endTime}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex gap-5">
                    <div className="text-sm font-medium text-teal-700">
                      {tour.accompanimentName}
                    </div>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        tour.status
                          ? "bg-teal-100 text-teal-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {tour.status ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>{tour.status ? "Confirmé" : "En attente"}</span>
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
